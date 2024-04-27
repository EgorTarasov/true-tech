.PHONY:go-create-grpc
go-create-grpc:
	protoc -I proto proto/speech.proto \
	--go_out=./backend/internal/gen/ \
	--go-grpc_out=./backend/internal/gen/\


.PHONY:python-create-grpc
python-create-grpc:
	python -m grpc_tools.protoc -Iproto --python_out=speech-to-text --pyi_out=speech-to-text --grpc_python_out=speech-to-text proto/speech.proto