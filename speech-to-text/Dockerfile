FROM python:3.11.8

WORKDIR /code

RUN apt update -y && apt install ffmpeg -y

COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . /code
RUN mkdir -p /data/logs