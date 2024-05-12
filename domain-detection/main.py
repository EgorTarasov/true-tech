import json
from typing import TypedDict
import requests
from typing import Any
from transformers import pipeline
import transformers
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
    _TAGS = [
        "Payment Period",
        "Payment Amount",
        "Card Number",
        "Expiration Date",
        "CVC",
        "Phone Number",
        # "Card Number",
        "Recipient's Account Number",
        "Recipient's Bank BIC",
        "Recipient's Tax Identification Number",
        "Recipient's Company Name",
        "Recipient's KPP",
        "Payment Purpose",
        "Sender's Full Name",
        "Payment Month",
        "Payment Year",
        "Payer's Patronymic",
        "Series and Number of Passport",
        "Registration Address",
    ]

    # карта преобразований результатов NER во внутренние теги mts
    TAG_MAP = {
        "Payment Period": "jky_period",
        "Payment Amount": "amount",
        "Card Number": "cardNumber",
        "Expiration Date": "validityPeriod",
        "CVC": "CVC",
        "Phone Number": "mobilianyi_telefon",
        "Recipient's Account Number": "receiverAccount",
        "Recipient's Bank BIC": "receiverBankBIC",
        "Recipient's Tax Identification Number": "receiverINN",
        "Recipient's Company Name": "receiverName",
        "Recipient's KPP": "receiverKPP",
        "Payment Purpose": "purpose",
        "Sender's Full Name": "payerName",
        "Payment Month": "id2",
        "Payment Year": "id3",
        "Payer's Patronymic": "id4",
        "Series and Number of Passport": "id6",
        "Registration Address": "id7",
    }

    def __init__(self, ner_pipeline: transformers.Pipeline) -> None:
        self.pipeline = ner_pipeline

    def __features_serialize(self, features: list[dict[str, Any]]) -> dict[str, Any]:
        """Если модель выделила несколько фичей одного типа, то оставляем только валидную

        Args:
            features (list[dict[str, Any]]): _description_

        Returns:
            dict[str, Any]: _description_
        """
        result = dict()
        for feature in features:
            # проверяем мобильный телефон, если его длина больше 10 символов, то это не мобильный телефон
            if feature["entity_group"] == "Phone Number" and len(feature["word"]) < 14:
                continue
            else:
                result[feature["entity_group"]] = feature["word"]
                continue

        return result

    def get_features(self, content: str) -> dict[str, Any]:
        result: list[dict] = self.pipeline(content)  # type: ignore
        result = self.__features_serialize(result)
        # change tags into mts tags
        result = {self.TAG_MAP[k]: v for k, v in result.items() if k in self.TAG_MAP}

        return result


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
    labels = {
        0: "ood",
        1: "check_balance",
        2: "sbp",
        3: "card2card",
        4: "self",
        5: "abroad",
        6: "freepayment",
        7: "kvartplata, jkh",
        8: "mobile_phone",
        9: "transport",
        10: "ishop",
    }

    def __init__(self, base_path):
        # self.prepare_model()
        self.path = base_path
        self.classifier = TextClassificationPipeline(
            model=SkillClassifier.load_model(self),
            tokenizer=SkillClassifier.load_tokenizer(self),
        )

    def load_model(self):
        model = AutoModelForSequenceClassification.from_pretrained(
            self.path  # +'model.safetensors'
        )
        return model

    def load_tokenizer(self):
        tokenizer = AutoTokenizer.from_pretrained("ai-forever/ruRoberta-large")
        return tokenizer

    def get_response(self, text: str) -> str:
        label = int(self.classifier(text)[0]["label"].split("_")[-1])
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

            resposne_data = self.ner.get_features(request.query)

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
    classifier = SkillClassifier("Classification_model_v2.0")

    ner_model = pipeline("ner", model="./checkpoint-147", aggregation_strategy="max")
    ner = Ner(ner_model)
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
