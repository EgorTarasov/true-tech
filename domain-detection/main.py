import json
import os
import torch
import requests
import logging
from transformers import AutoModelForSequenceClassification, TextClassificationPipeline, AutoTokenizer
import warnings
from concurrent import futures

import grpc
from grpc import ServicerContext, server

import grpc
import domain_pb2 as pb
import domain_pb2_grpc as pb_gprc

log = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

warnings.filterwarnings("ignore")

device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")


class SkillClassifier:
    def __init__(self, base_path):
        # self.prepare_model()
        self.path = base_path
        self.classifier = TextClassificationPipeline(model=SkillClassifier.load_model(self),
                                                     tokenizer=SkillClassifier.load_tokenizer(self))
        self.labels = {'LABEL_0': 'payment',
          'LABEL_1': 'balance',
          'LABEL_2': 'money_transfer'}
        self.required_keys = {
            "LABEL_2": ["target", "amount"]
        }

    def load_model(self):
        model = AutoModelForSequenceClassification.from_pretrained(
            self.path#+'model.safetensors'
        )
        return model

    def load_tokenizer(self):
        tokenizer = AutoTokenizer.from_pretrained("deepvk/deberta-v1-distill")
        return tokenizer

    def get_response(self, text: str) -> str:
        label = self.classifier(text)[0]['label']
        return self.labels[label]


class DomainDetectionService(pb_gprc.DomainDetectionServiceServicer):

    def __init__(self, classifier: SkillClassifier):
        self.model = classifier

    def DetectDomain(self, request: pb.DomainDetectionRequest, context):
        return pb.DomainDetectionResponse(label=self.model.get_response(request.query))


def serve():
    s = server(futures.ThreadPoolExecutor(max_workers=10))
    classifier = SkillClassifier("Classification_model_v1.0")
    service = DomainDetectionService(classifier)
    pb_gprc.add_DomainDetectionServiceServicer_to_server(service, s)
    log.info("starting server")
    s.add_insecure_port("[::]:10002")
    s.start()
    s.wait_for_termination()

if __name__ == "__main__":
    serve()