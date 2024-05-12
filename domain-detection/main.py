import json
from typing import TypedDict
import requests
from typing import Any
import torch
import requests
import logging
from transformers import (
    AutoModelForSequenceClassification,
    TextClassificationPipeline,
    AutoTokenizer,
)
import warnings
from concurrent import futures
from prometheus_client import start_http_server, Summary

import grpc
from grpc import ServicerContext, server

import grpc
import domain_pb2 as pb
import domain_pb2_grpc as pb_gprc


from bs4 import BeautifulSoup
from bs4.element import Tag
from typing import Literal
from bs4.element import Tag, NavigableString

from selenium import webdriver
from selenium.webdriver.chrome.options import Options


BS4_ELEMENT = Tag | NavigableString | None

FIELD_TYPE = Literal["text", "number", "tel", "email", "date", "password"]
field_type = ["text", "number", "tel", "email", "date", "password"]


class ElementData(TypedDict):
    label: str
    type: str
    name: str
    placeholder: str
    splellcheck: bool
    inputmode: str


log = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

warnings.filterwarnings("ignore")

device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")

# prometheus metrics

REQUEST_TIME = Summary("request_processing_seconds", "Time spent processing request")


class Ner:

    def __init__(self, api_url: str) -> None:
        self.api = api_url

    def __ask_llama(self, user: str, system: str = "") -> str:
        messages_json = {
            "user": user,
            "system": system,
        }
        try:
            # Send the POST request with the input data
            response = requests.post(self.api, json=messages_json)

            # Check if the request was successful (status code 200)
            if response.status_code == 200:
                # Process the response
                result = response.json()
                return result["responce"]
            else:
                print("Failed to send request. Status code:", response.status_code)

        except Exception as e:
            print("An error occurred:", e)

    def get_features(self, content: str, keys: dict[str, str]) -> dict[str, Any]:
        key_str = ";".join([":".join([key, value]) for key, value in keys.items()])
        done = False
        data: dict | None = None
        retries = 0

        while not done:
            response = self.__ask_llama(
                system="ты NER модель, которая собирает именованные сущности в формат yaml, из текста если таких сущностей нет сделай значения в yaml пустой строкой, то есть yaml всегда должен иметь значения, даже если нет именованных сущностей, в ответе должен быть только словарь без вспомогательного текста, не меняй ключи в словаре и обязательно надо выводить все ключи.",
                user=f"{key_str} найди эти именованные сущности в тексте {content}",
            ).replace("'", '"')
            print("got response", response)
            try:
                data = json.loads(response)
            except Exception as e:
                print(f"retrying {retries}", e)
                retries += 1
                data = None
            finally:
                done = True
        if data is None:
            raise ValueError("llm failed")
        return data


class FeatureExtractor:

    def __init__(self, driver: webdriver.Remote) -> None:
        self.driver = driver

    def get_html(self, url: str) -> str:
        self.driver.get(url)
        self.driver.implicitly_wait(1)
        return self.driver.page_source

    def __get_input_fields(self, html: str) -> list[Tag]:
        """Получение всех полей ввода из html

        Args:
            html (str): страница с формой нового формата

        Returns:
            list[Tag]: div с атрибутом label и компонентом input внутри
        """
        soup: BeautifulSoup = BeautifulSoup(html, "html.parser")
        inputs: list[BS4_ELEMENT] = soup.find_all("div", attrs={"label": True})

        return [
            input_
            for input_ in inputs
            if isinstance(input_, Tag) and input_.find("input") is not None
        ]

    def __parse_input_field(self, input_field: Tag) -> ElementData:
        """Парсинг поля ввода

        Args:
            input_field (Tag): div с атрибутом label и компонентом input внутри

        Returns:
            dict[str, str]: словарь с ключами label и value type
        """
        label = input_field["label"]
        input_element: BS4_ELEMENT = input_field.find("input")
        if not isinstance(input_element, Tag):
            raise ValueError("input_element is not Tag")

        input_type = input_element.get("type")

        if (
            input_type is None
            or isinstance(input_type, str)
            and input_type not in field_type
            or not isinstance(input_type, str)
        ):
            raise ValueError("input_type is None")

        name = input_element.get("name")
        if name is None or not isinstance(name, str):
            name = ""

        placeholder = input_element.get("placeholder")
        if placeholder is None or not isinstance(placeholder, str):
            placeholder = ""
        spellcheck = input_element.get("spellcheck")
        if spellcheck is None or not isinstance(spellcheck, str):
            spellcheck = ""

        inputmode = input_element.get("inputmode")
        if inputmode is None or not isinstance(inputmode, str):
            inputmode = "none"

        return ElementData(
            label=str(label),
            type=input_type,
            name=name,
            placeholder=placeholder,
            splellcheck=True if spellcheck == "true" else False,
            inputmode=inputmode,
        )

    def parse(self, html: str):
        input_fields = self.__get_input_fields(html)
        fields = []
        for input_field in input_fields:
            try:
                field = self.__parse_input_field(input_field)
                fields.append(field)
            except ValueError as e:
                print(e)
            finally:
                continue
        return fields

    def extract(self, url: str):
        html = self.get_html(url)
        return self.parse(html)

    def close(self):
        self.driver.quit()


class SkillClassifier:
    def __init__(self, base_path):
        # self.prepare_model()
        self.path = base_path
        self.classifier = TextClassificationPipeline(
            model=SkillClassifier.load_model(self),
            tokenizer=SkillClassifier.load_tokenizer(self),
        )
        self.labels = {
            "LABEL_0": "payment",
            "LABEL_1": "balance",
            "LABEL_2": "money_transfer",
        }
        self.required_keys = {"LABEL_2": ["target", "amount"]}

    def load_model(self):
        model = AutoModelForSequenceClassification.from_pretrained(
            self.path  # +'model.safetensors'
        )
        return model

    def load_tokenizer(self):
        tokenizer = AutoTokenizer.from_pretrained("deepvk/deberta-v1-distill")
        return tokenizer

    @REQUEST_TIME.time()
    def get_response(self, text: str) -> str:
        label = self.classifier(text)[0]["label"]
        return self.labels[label]


class DomainDetectionService(pb_gprc.DomainDetectionServiceServicer):

    def __init__(
        self,
        classifier: SkillClassifier,
        ner_model: Ner,
        feature_extractor: FeatureExtractor,
    ):
        self.classifier = classifier
        self.feature_extractor = feature_extractor
        self.ner = ner_model

    def DetectDomain(
        self, request: pb.DomainDetectionRequest, context
    ) -> pb.DomainDetectionResponse:
        return pb.DomainDetectionResponse(
            label=self.classifier.get_response(request.query)
        )

    def ExtractLabels(
        self, request: pb.LabelDetectionRequest, context
    ) -> pb.LabelDetectionResponse | None:
        try:
            fields = self.feature_extractor.extract(request.html)
            return pb.LabelDetectionResponse(
                labels=[
                    pb.ActionLabel(
                        name=field["name"],
                        type=field["type"] if field["type"] in field_type else "text",
                        label=field["label"],
                        placeholder=field["placeholder"],
                        splellcheck=field["splellcheck"],
                    )
                    for field in fields
                ]
            )
        except Exception as e:
            log.error(f"Error: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Internal error: {e}")

    def ExtractFormData(
        self, request: pb.ExtractFormDataRequest, context
    ) -> pb.ExtractFormDataResponse | None:
        """Missing associated documentation comment in .proto file."""
        try:

            keys: dict = {}
            while len(request.fields) > 0:
                value: pb.ActionLabel = request.fields.pop()
                keys[value.name] = value.type

            max_retry = 10
            retry = 0
            resposne_data = self.ner.get_features(request.query, keys)
            while resposne_data.keys() != keys.keys() or retry < max_retry:
                resposne_data = self.ner.get_features(request.query, keys)
                retry += 1
            if retry > max_retry:
                er = f"Error: exceeded max retry"
                log.error(er)
                context.set_code(grpc.StatusCode.INTERNAL)
                context.set_details(f"Internal error: {er}")
            return pb.ExtractFormDataResponse(
                fields=[
                    pb.ActionLabelData(name=name, value=value)
                    for name, value in resposne_data.items()
                ]
            )

        except Exception as e:
            log.error(f"Error: {e}")
            context.set_code(grpc.StatusCode.INTERNAL)
            context.set_details(f"Internal error: {e}")


def serve():
    s = server(futures.ThreadPoolExecutor(max_workers=1))
    classifier = SkillClassifier("Classification_model_v1.0")
    ner = Ner("https://864e-37-230-179-200.ngrok-free.app/llama/")
    log.info("initializing driver")
    driver = webdriver.Remote(
        command_executor="http://selenium:4444", options=Options()
    )
    logging.info("driver initialized")

    fe = FeatureExtractor(driver)
    service = DomainDetectionService(classifier, ner, fe)

    pb_gprc.add_DomainDetectionServiceServicer_to_server(service, s)
    log.info("starting server")
    s.add_insecure_port("[::]:10002")
    s.start()
    s.wait_for_termination()


if __name__ == "__main__":
    start_http_server(9991)
    serve()
