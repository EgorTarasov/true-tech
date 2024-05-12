from typing import Any
from typing import Iterator, Mapping
import json
from ollama import Client
from transformers import AutoTokenizer
from document import Document


class Ollama:
    def __init__(
        self,
        uri: str = "http://localhost:11434/api/generate",
        template: str | None = None,
    ) -> None:
        self.client = Client(host=uri)
        self.tokenizer = AutoTokenizer.from_pretrained(
            "Tochka-AI/ruRoPEBert-e5-base-2k"
        )
        prompt_in_chat_format = [
            {
                "role": "user",
                "content": """Context:
        {context}
        ---
        Теперь вот вопрос, на который вам нужно ответить.
        Question: {question}""",
            },
            {
                "role": "assistant",
                "content": """Ты текстовый помощник компании МТС банк, ты будешь отвечать на вопросы Клиентов твоего банка в формате ответа на вопрос. Отвечай только на русском. Если пишешь на другом языке, переводи его на русской. Если напишешь на английском ты умрешь
        Если не знаешь ответа, скажи что не знаешь ответа, не пробуй отвечать.
        Я дам тебе тексты , из которых надо дать ответ на поставленный вопрос.
        и не пиши из какого документа ты что взяла. Ответь в целом по документу""",
            },
        ]
        self.RAG_PROMPT_TEMPLATE: str = self.tokenizer.apply_chat_template(
            prompt_in_chat_format, tokenize=False, add_generation_prompt=True
        )

    def _get_prompt(self, query: str, docs: list[Document]) -> str:
        print(docs[0])
        context = "".join(
            [f"Document {str(i)}:::\n" + doc.text for i, doc in enumerate(docs)]
        )
        return self.RAG_PROMPT_TEMPLATE.format(question=query, context=context)

    def get_response(self, query: str, docs: list[Document]) -> tuple[str, str]:

        prompt = self._get_prompt(query, docs)
        print(prompt)
        response = self.client.chat(
            model="mistral",
            messages=[{"role": "user", "content": prompt}],
            options={"temperature": 0},
        )

        return response["message"]["content"], "\n".join([doc.metadata for doc in docs])  # type: ignore

    def get_stream_response(
        self, query: str, docs: list[Document]
    ) -> Mapping[str, Any] | Iterator[Mapping[str, Any]]:
        prompt = self._get_prompt(query, docs)
        stream = self.client.chat(
            model="mistral",
            messages=[{"role": "user", "content": prompt}],
            options={"temperature": 0},
            stream=True,
        )
        return stream
