from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Optional as _Optional

DESCRIPTOR: _descriptor.FileDescriptor

class SpeechToTextRequest(_message.Message):
    __slots__ = ("audio",)
    AUDIO_FIELD_NUMBER: _ClassVar[int]
    audio: bytes
    def __init__(self, audio: _Optional[bytes] = ...) -> None: ...

class SpeechToTextResponse(_message.Message):
    __slots__ = ("text",)
    TEXT_FIELD_NUMBER: _ClassVar[int]
    text: str
    def __init__(self, text: _Optional[str] = ...) -> None: ...
