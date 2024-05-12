from typing import Any
from typing import Iterator, Mapping
import json
from ollama import Client
import logging
from grpc import ServicerContext, server
from concurrent import futures

import preprocessor_pb2, preprocessor_pb2_grpc

log = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


class Ollama:
    def __init__(
        self,
        uri: str = "http://localhost:11434/api/generate",
        template: str | None = None,
    ) -> None:
        self.client = Client(host=uri)

    def get_response(self, input_text: str) -> str:
        response = self.client.chat(
            model="mistral",
            messages=[
                {
                    "role": "user",
                    "content": f"""Context:Вот текст который надо преобразовать:
Question:{input_text}""",
                },
                {
                    "role": "assistant",
                    "content": """Ты текстовый обработчик, ты помогаешь исправить недочеты перевода речи в текст. Отвечай только на русском языке. Если пишешь на другом языке, переводи его на русский. Всегда на выходе должен получаться текст без орфографических ошибок""",
                },
            ],
            options={"temperature": 0.2},
        )

        return response["message"]["content"]  # type: ignore

    def get_stream_response(
        self, input_text: str
    ) -> Mapping[str, Any] | Iterator[Mapping[str, Any]]:
        stream = self.client.chat(
            model="mistral",
            messages=[
                {
                    "role": "user",
                    "content": f"""Context:Вот текст который надо преобразовать:
Question:{input_text}""",
                },
                {
                    "role": "assistant",
                    "content": """Ты текстовый обработчик, ты помогаешь исправить недочеты перевода речи в текст. Отвечай только на русском языке. Если пишешь на другом языке, переводи его на русский. Всегда на выходе должен получаться текст без орфографических ошибок""",
                },
            ],
            options={"temperature": 0.2},
            stream=True,
        )
        return stream


class Server(preprocessor_pb2_grpc.TextProcessingServiceServicer):

    def __init__(self, llm: Ollama) -> None:
        self.llm = llm

    def ProcessText(self, request: preprocessor_pb2.ProcessingRequest, context) -> preprocessor_pb2.ProcessingResponse:
        """Missing associated documentation comment in .proto file."""
        log.info(f"started processing: {request.text}")

        response = self.llm.get_response(request.text)
        log.info(f"processed  {request.text} ")

        return preprocessor_pb2.ProcessingResponse(text=response)


def serve():
    s = server(futures.ThreadPoolExecutor(max_workers=10))
    llm = Ollama("192.168.1.70:11434/api/generate")
    service = Server(llm)
    preprocessor_pb2_grpc.add_TextProcessingServiceServicer_to_server(service, s)
    log.info("starting server")
    s.add_insecure_port("[::]:10001")
    s.start()
    s.wait_for_termination()


if __name__ == "__main__":
    serve()
