.PHONY:go-create-grpc
go-create-grpc:
	protoc -I proto proto/speech.proto \
	--go_out=./backend/internal/gen/ \
	--go-grpc_out=./backend/internal/gen/ && \
	protoc -I proto proto/preprocessor.proto \
	--go_out=./backend/internal/gen/ \
	--go-grpc_out=./backend/internal/gen/ && \
	protoc -I proto proto/domain.proto \
    	--go_out=./backend/internal/gen/ \
    	--go-grpc_out=./backend/internal/gen/\


.PHONY:python-speech-create-grpc
python-create-grpc:
	python -m grpc_tools.protoc -Iproto --python_out=speech-to-text --pyi_out=speech-to-text --grpc_python_out=speech-to-text proto/speech.proto
	
.PHONY:python-text-grpc
python-text-grpc:
	python -m grpc_tools.protoc -Iproto --python_out=text-processor --pyi_out=text-processor --grpc_python_out=text-processor proto/preprocessor.proto

.PHONY:python-domain-grpc
python-domain-grpc:
	python -m grpc_tools.protoc -Iproto --python_out=domain-detection --pyi_out=domain-detection --grpc_python_out=domain-detection proto/domain.proto




.PHONY: docker-up
docker-up:
	docker compose up -f docker/docker-compose.yaml -d --build

.PHONY: docker-dev
docker-dev:
		docker compose -f docker/docker-compose.yaml up speech-to-text \
    		domain-detection \
    		jaeger prometheus\
    		grafana \
    		node-exporter \
    		postgres \
    		redis \
    		-d --build


