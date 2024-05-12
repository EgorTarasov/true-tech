LOCAL_BIN:=$(CURDIR)/bin

GOLANGCI_BIN:=$(LOCAL_BIN)/golangci-lint
GOLANGCI_TAG:=1.56.2
MOCKGEN_TAG:=latest
SMART_IMPORTS := ${LOCAL_BIN}/smartimports


.PHONY: install-swag
install-swag:
	go install github.com/swaggo/swag/cmd/swag@latest


.PHONY: create-swag
create-swag:
	swag init -g ./cmd/main.go  -o ./internal/docs


.PHONY: dev
dev:
	go run cmd/main.go

# build app
.PHONY: build
build:
	go mod download && CGO_ENABLED=0  go build \
		-o ./bin/main$(shell go env GOEXE) ./cmd/main.go

# precommit jobs
.PHONY: precommit
precommit: format lint

# install golangci-lint binary
.PHONY: install-lint
install-lint:
ifeq ($(wildcard $(GOLANGCI_BIN)),)
	$(info Downloading golangci-lint v$(GOLANGCI_TAG))
	GOBIN=$(LOCAL_BIN) go install github.com/golangci/golangci-lint/cmd/golangci-lint@v$(GOLANGCI_TAG)
endif

# run diff lint like in pipeline
.PHONY: .lint
.lint: install-lint
	$(info Running lint...)
	$(GOLANGCI_BIN) run --new-from-rev=origin/master --config=.golangci.yaml ./...

# golangci-lint diff master
.PHONY: lint
lint: .lint

# run full lint like in pipeline
.PHONY: .lint-full
.lint-full: install-lint
	$(GOLANGCI_BIN) run --config=.golangci.yaml ./...

# golangci-lint full
.PHONY: lint-full
lint-full: .lint-full

.PHONY: format
format:
	$(info Running goimports...)
	test -f ${SMART_IMPORTS} || GOBIN=${LOCAL_BIN} go install github.com/pav5000/smartimports/cmd/smartimports@latest
	${SMART_IMPORTS} -exclude pkg/,internal/pb  -local 'gitlab.ozon.dev'

ifeq (,$(wildcard .env))
    # Если файл .env отсутствует, устанавливаем параметры по умолчанию
    POSTGRES_USER := 'SuperPuperUser'
    POSTGRES_PASSWORD := 'SuperStrongPassword'
    POSTGRES_DB := 'dev'
    POSTGRES_HOST := '192.168.1.70'
    POSTGRES_PORT := 5432
else
    # Иначе, подключаем переменные из файла .env
    include .env
    export
endif
POSTGRES_SETUP_TEST := user=${POSTGRES_USER} password=${POSTGRES_PASSWORD} dbname=${POSTGRES_DB} host=${POSTGRES_HOST} port=${POSTGRES_PORT} sslmode=disable

INTERNAL_PKG_PATH=$(CURDIR)/internal
MIGRATION_FOLDER=$(INTERNAL_PKG_PATH)/migrations

.PHONY: migration-create
migration-create:
	goose -dir "$(MIGRATION_FOLDER)" create "$(name)" sql

.PHONY: migration-up
migration-up:
	goose -dir "$(MIGRATION_FOLDER)" postgres "$(POSTGRES_SETUP_TEST)" up


.PHONY: migration-down
migration-down:
	goose -dir "$(MIGRATION_FOLDER)" postgres "$(POSTGRES_SETUP_TEST)" down

