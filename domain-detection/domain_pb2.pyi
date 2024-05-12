from google.protobuf.internal import containers as _containers
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from typing import ClassVar as _ClassVar, Iterable as _Iterable, Mapping as _Mapping, Optional as _Optional, Union as _Union

DESCRIPTOR: _descriptor.FileDescriptor

class DomainDetectionRequest(_message.Message):
    __slots__ = ("query",)
    QUERY_FIELD_NUMBER: _ClassVar[int]
    query: str
    def __init__(self, query: _Optional[str] = ...) -> None: ...

class DomainDetectionResponse(_message.Message):
    __slots__ = ("label",)
    LABEL_FIELD_NUMBER: _ClassVar[int]
    label: str
    def __init__(self, label: _Optional[str] = ...) -> None: ...

class LabelDetectionRequest(_message.Message):
    __slots__ = ("html",)
    HTML_FIELD_NUMBER: _ClassVar[int]
    html: str
    def __init__(self, html: _Optional[str] = ...) -> None: ...

class ActionLabel(_message.Message):
    __slots__ = ("name", "type", "label", "placeholder", "splellcheck", "inputmode")
    NAME_FIELD_NUMBER: _ClassVar[int]
    TYPE_FIELD_NUMBER: _ClassVar[int]
    LABEL_FIELD_NUMBER: _ClassVar[int]
    PLACEHOLDER_FIELD_NUMBER: _ClassVar[int]
    SPLELLCHECK_FIELD_NUMBER: _ClassVar[int]
    INPUTMODE_FIELD_NUMBER: _ClassVar[int]
    name: str
    type: str
    label: str
    placeholder: str
    splellcheck: bool
    inputmode: str
    def __init__(self, name: _Optional[str] = ..., type: _Optional[str] = ..., label: _Optional[str] = ..., placeholder: _Optional[str] = ..., splellcheck: bool = ..., inputmode: _Optional[str] = ...) -> None: ...

class LabelDetectionResponse(_message.Message):
    __slots__ = ("labels",)
    LABELS_FIELD_NUMBER: _ClassVar[int]
    labels: _containers.RepeatedCompositeFieldContainer[ActionLabel]
    def __init__(self, labels: _Optional[_Iterable[_Union[ActionLabel, _Mapping]]] = ...) -> None: ...

class ActionLabelData(_message.Message):
    __slots__ = ("name", "value")
    NAME_FIELD_NUMBER: _ClassVar[int]
    VALUE_FIELD_NUMBER: _ClassVar[int]
    name: str
    value: str
    def __init__(self, name: _Optional[str] = ..., value: _Optional[str] = ...) -> None: ...

class ExtractFormDataRequest(_message.Message):
    __slots__ = ("fields", "query")
    FIELDS_FIELD_NUMBER: _ClassVar[int]
    QUERY_FIELD_NUMBER: _ClassVar[int]
    fields: _containers.RepeatedCompositeFieldContainer[ActionLabel]
    query: str
    def __init__(self, fields: _Optional[_Iterable[_Union[ActionLabel, _Mapping]]] = ..., query: _Optional[str] = ...) -> None: ...

class ExtractFormDataResponse(_message.Message):
    __slots__ = ("fields",)
    FIELDS_FIELD_NUMBER: _ClassVar[int]
    fields: _containers.RepeatedCompositeFieldContainer[ActionLabelData]
    def __init__(self, fields: _Optional[_Iterable[_Union[ActionLabelData, _Mapping]]] = ...) -> None: ...
