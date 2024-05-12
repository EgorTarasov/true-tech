import grpc
import search_engine_pb2
import search_engine_pb2_grpc
from config import cfg
from typing import AsyncGenerator


def run():
    # Create a channel to the server
    channel = grpc.insecure_channel("192.168.1.70:10000")

    # Create a stub (client)
    stub = search_engine_pb2_grpc.SearchEngineStub(channel)

    # Create a valid request message
    request = search_engine_pb2.Query(
        body="Какие экзамены меня ждут в 1 семестре? Я учусь на SMM менеджера",
        model="test model",
    )

    # Make the call to the Respond method
    # response = stub.Respond(request)
    # print(response)

    # # Print the response
    # pprint(response.body)
    # pprint(response.context)

    # Make the call to the RespondStream method
    responses = stub.RespondStream(request)

    # # Print the responses
    for response in responses:
        print(response)


if __name__ == "__main__":
    run()
