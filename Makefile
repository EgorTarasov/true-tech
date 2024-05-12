.PHONY:go-create-grpc
go-create-grpc:
	protoc -I proto proto/speech.proto \
	--go_out=./backend/internal/stubs/ \
	--go-grpc_out=./backend/internal/stubs/ && \
	protoc -I proto proto/preprocessor.proto \
	--go_out=./backend/internal/stubs/ \
	--go-grpc_out=./backend/internal/stubs/ && \
	protoc -I proto proto/domain.proto \
    	--go_out=./backend/internal/stubs/ \
    	--go-grpc_out=./backend/internal/stubs/ && \
	protoc -I proto proto/search.proto \
    	--go_out=./backend/internal/stubs/ \
    	--go-grpc_out=./backend/internal/stubs/


.PHONY:python-speech-create-grpc
python-create-grpc:
	python -m grpc_tools.protoc -Iproto --python_out=speech-to-text --pyi_out=speech-to-text --grpc_python_out=speech-to-text proto/speech.proto

.PHONY:python-text-grpc
python-text-grpc:
	python -m grpc_tools.protoc -Iproto --python_out=text-processor --pyi_out=text-processor --grpc_python_out=text-processor proto/preprocessor.proto

.PHONY:python-domain-grpc
python-domain-grpc:
	python -m grpc_tools.protoc -Iproto --python_out=domain-detection --pyi_out=domain-detection --grpc_python_out=domain-detection proto/domain.proto


.PHONY:python-search-grpc
python-search-grpc:
	python -m grpc_tools.protoc -Iproto --python_out=faq --pyi_out=faq --grpc_python_out=faq proto/search.proto

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


.PHONY: deploy
deploy:
	docker kill docker_app-1 && docker rm docker_app-1 && \
	docker compose -f docker/docker-compose.yaml up app --build -d

.PHONY: server-sync
server-sync:
	 rsync -avz --exclude .venv --exclude .idea --exclude research --exclude frontend/node_modules /Users/egortarasov/uni/Хакатоны/true-tech etarasov@192.168.1.70:/home/etarasov/
