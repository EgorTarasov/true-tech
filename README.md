
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
