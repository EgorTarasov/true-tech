import logging
import whisper


import grpc
from grpc import ServicerContext, server

from concurrent import futures
import speech_pb2, speech_pb2_grpc


log = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)
log.info("downloading model")
model = whisper.load_model("small")
log.info("downloaded model")


class Service(speech_pb2_grpc.SpeechServiceServicer):
    def SpeechToText(
        self, request: speech_pb2.SpeechToTextRequest, context: ServicerContext
    ):
        log.info("received request")
        """Missing associated documentation comment in .proto file."""
        # with open("audio.wav", "wb") as f:
        #     f.write(request.audio)
        result = model.transcribe("audio.wav")

        return speech_pb2.SpeechToTextResponse(text=result["text"])


def serve():

    s = server(futures.ThreadPoolExecutor(max_workers=10))

    speech_pb2_grpc.add_SpeechServiceServicer_to_server(Service(), s)
    log.info("starting server")
    s.add_insecure_port("[::]:10000")
    s.start()
    s.wait_for_termination()


if __name__ == "__main__":
    serve()
