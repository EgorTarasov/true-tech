import { Button, Input } from "@/ui";
import { FormDto } from "api/models/form.model";
import { FC, FormEvent, useState } from "react";
import EyeOpenIcon from "@/assets/icons/eye-open.svg";
import EyeCloseIcon from "@/assets/icons/eye-close.svg";
import headerImage from "@/assets/images/header.png";

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
      phoneNumber: form.get("phoneNumber") as string,
      amount: form.get("amount") as string,
      cardNumber: form.get("cardNumber") as string,
      cardDate: form.get("cardDate") as string,
      cardCvv: form.get("cardCvv") as string
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
        <Input disabled={loading} required label="Номер телефона" name="phoneNumber" type="tel" />
        <Input disabled={loading} required label="Сумма платежа" name="amount" type="text" />
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
              name="cardDate"
              type="text"
              placeholder="ММ/ГГ"
            />
            <Input
              disabled={loading}
              required
              label="CVC"
              name="cardCvv"
              type="password"
              rightIconIsButton
              onIconClick={() => setShowCvv(!showCvv)}
              rightIcon={showCvv ? <EyeOpenIcon /> : <EyeCloseIcon />}
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
