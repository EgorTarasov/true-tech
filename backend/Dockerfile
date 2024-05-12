# Builder

FROM golang:1.22-alpine AS builder
RUN apk add --update make git curl

ARG MODULE_NAME=github.com/EgorTarasov/true-tech/backend

RUN apk upgrade --update-cache --available && \
    apk add openssl && \
    rm -rf /var/cache/apk/*
COPY Makefile /home/${MODULE_NAME}/Makefile
COPY go.mod /home/${MODULE_NAME}/go.mod
COPY go.sum /home/${MODULE_NAME}/go.sum

WORKDIR /home/${MODULE_NAME}

COPY . /home/${MODULE_NAME}
RUN make build


# Service

FROM alpine:latest as server
ARG MODULE_NAME=github.com/EgorTarasov/true-tech/backend
RUN apk --no-cache add ca-certificates
WORKDIR /root/

COPY --from=builder /home/${MODULE_NAME}/bin/main .
COPY --from=builder /home/${MODULE_NAME}/config.yaml .

RUN chown root:root main