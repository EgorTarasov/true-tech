
# Project Title

A brief description of what this project does and who it's for

# Документация проекта

## Модель классификации навыков (Skill Classifier)

### Назначение
Модель предназначена для точного определения намерений пользователя.

### Детали модели
- **Тип модели:** ruRoberta-large
- **Обучающий набор данных:** Наш специализированный набор данных для классификации намерений пользователя.
- **Классифицируемые классы:** Модель классифицирует следующие намерения:
  - `0`: ood (не относится к задаче)
  - `1`: check_balance (проверка баланса)
  - `2`: sbp
  - `3`: card2card
  - `4`: self
  - `5`: abroad (зарубежные переводы)
  - `6`: freepayment
  - `7`: kvartplata, jkh (коммунальные платежи)
  - `8`: mobile_phone (мобильная связь)
  - `9`: transport
  - `10`: ishop (интернет-магазины)

### Метрики
- **Точность на тестовой выборке:** f1-score = 0.98

### Примеры использования
- Текст: 'Пожалуйста оплати мне квартплату за месяц'
  Вывод: 'kvartplata, jkh'
- Текст: 'хочу кинуть деньги по номеру телефону через сбп'
  Вывод: 'sbp'
- Текст: 'сколько денег у меня щас на балансе карты'
  Вывод: 'check_balance'
- Текст: 'переведи деньги в бангладеш на карту 5469380012345678'
  Вывод: 'abroad'

### Как использовать
- **Ссылка на скачивание:** [Skill Classifier Model](https://drive.google.com/file/d/1g54eK1LH2go1jXtNkEjhQEdStcToDME4/view?usp=sharing)
- **Код для инференса:**
  ```python
  import json
  import os
  import requests
  from transformers import AutoModelForSequenceClassification, TextClassificationPipeline, AutoTokenizer
  import warnings
  import torch

  warnings.filterwarnings("ignore")

  device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
  print(device)

  class SkillClassifier:
      def __init__(self, base_path):
          self.path = base_path
          self.classifier = TextClassificationPipeline(model=self.load_model(), tokenizer=self.load_tokenizer())

      def load_model(self):
          return AutoModelForSequenceClassification.from_pretrained(self.path)

      def load_tokenizer(self):
          return AutoTokenizer.from_pretrained("ai-forever/ruRoberta-large")

      def get_response(self, text: str) -> str:
          label = self.classifier(text)[0]['label']
          return label

  classifier = SkillClassifier('path to directory')
  print(classifier.get_response('your text here'))

- **dependencies**:
  transformers, torch
## Модель распознавания именованных сущностей (Named Entity Recognition)

### Назначение
Модель необходима для определения именованных сущностей, поступающих на вход.

### Детали модели
- **Тип модели:** LaBSE-en-ru
- **Обучающий набор данных:** Наш специализированный набор данных для распознавания сущностей.
- **Классифицируемые классы:** Модель определяет следующие сущности:
  - "Payment Period"
  - "Payment Amount"
  - "Card Number"
  - "Expiration Date"
  - "CVC"
  - "Phone Number"
  - "Recipient's Account Number"
  - "Recipient's Bank BIC"
  - "Recipient's Tax Identification Number"
  - "Recipient's Company Name"
  - "Recipient's KPP"
  - "Payment Purpose"
  - "Sender's Full Name"
  - "Payment Month"
  - "Payment Year"
  - "Payer's Patronymic"
  - "Series and Number of Passport"
  - "Registration Address"

### Метрики
- **Точность на тестовой выборке:** f1-score(macro) = 0.93

### Примеры использования
- Текст: 'кинь 500 рублей на счет 5469380043501234'
  Вывод: [{'entity_group': 'Recipient's Account Number', 'word': '5469380043501234'}, {'entity_group': 'Payment Amount', 'word': '500 рублей'}]

### Как использовать
- **Ссылка на скачивание:** [NER Model](https://drive.google.com/drive/folders/1IWPL3la7_mq9CsEEJIj9-Pl-WKWLsGSi?usp=drive_link)
- **Код для инференса:**
  ```python
  from transformers import pipeline
  classifier = pipeline("ner", model='path to directory', aggregation_strategy="max")

  classfier(text)

- **dependencies**:
  transformers, torch