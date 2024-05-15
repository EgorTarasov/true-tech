import { Button, Input } from "@/ui";
import { FormDto } from "api/models/form.model";
import { FC, FormEvent, useState } from "react";
import EyeOpenIcon from "@/assets/icons/eye-open.svg";
import EyeCloseIcon from "@/assets/icons/eye-close.svg";
import headerImage from "@/assets/images/header.png";

// переведи 200 рублей на номер +79852309245, срок действия 21 дробь 2023. мой секретный код 123

export const BankCardForm: FC<{
  onSubmit: (form: FormDto.MobileTopUpTemplate | null) => Promise<void>;
}> = (x) => {
  const [loading, setLoading] = useState(false);
  const [showCvv, setShowCvv] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const values = {
      phoneNumber: form.get("mobilianyi_telefon") as string,
      amount: form.get("amount") as string,
      cardNumber: form.get("cardNumber") as string,
      cardDate: form.get("validityPeriod") as string,
      cardCvv: form.get("CVC") as string
    };

    try {
      await x.onSubmit({
        bankCardInfo: {
          cardNumber: Number(values.cardNumber),
          cvc: Number(values.cardCvv),
          expirationDate: values.cardDate
        },
        phoneData: {
          phoneNumber: Number(values.phoneNumber),
          amount: Number(values.amount)
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-auto flex flex-col items-center">
      <div className="flex items-center gap-4 w-full justify-between pb-10">
        <img
          className="max-w-[200px] max-h-[80px] h-auto object-contain"
          src={headerImage}
          alt="form"
        />
        <h1 className="text-2xl font-bold">Оплата мобильных операторов РФ</h1>
      </div>
      <form onSubmit={onSubmit} className="w-full flex flex-col gap-2">
        <Input
          disabled={loading}
          required
          label="Номер телефона"
          placeholder="+79XXXXXXXXX"
          name="mobilianyi_telefon"
          type="tel"
        />
        <Input
          disabled={loading}
          required
          label="Сумма платежа"
          name="amount"
          type="text"
          placeholder="0 руб."
        />
        <fieldset
          aria-labelledby="bank-card"
          className="flex flex-col gap-4 p-8 rounded-3xl border mt-4">
          <h4 id="bank-card" className="font-bold text-lg">
            Банковская карта
          </h4>
          <div className="flex gap-2">
            <Input
              disabled={loading}
              required
              label="Номер карты"
              name="cardNumber"
              type="text"
              placeholder="0000 0000 0000 0000"
            />
          </div>
          <div className="flex gap-2">
            <Input
              disabled={loading}
              required
              label="Срок действия"
              name="validityPeriod"
              type="text"
              placeholder="ММ/ГГ"
            />
            <Input
              disabled={loading}
              required
              label="CVC"
              name="CVC"
              type={showCvv ? "text" : "password"}
              rightIconIsButton
              onIconClick={() => setShowCvv(!showCvv)}
              rightIcon={
                showCvv ? (
                  <EyeOpenIcon aria-label="Скрыть CVC" />
                ) : (
                  <EyeCloseIcon aria-label="Показать CVC" />
                )
              }
              placeholder="Введите код"
            />
          </div>
        </fieldset>
        <div className="h-6" />
        <div className="flex justify-between">
          <p>
            Нажимая на кнопку Отправить, вы соглашаетесь с{" "}
            <a
              href="https://static.mts.ru/upload/images/Oferta_MTS_Apple.html"
              target="_blank"
              className="text-link"
              rel="noreferrer">
              Договором оферты
            </a>
          </p>
          <Button type="submit" disabled={loading}>
            Оплатить
          </Button>
        </div>
      </form>
    </div>
  );
};
