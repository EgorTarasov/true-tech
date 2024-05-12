/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FormEvent, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { AuthService } from "../../stores/auth.store";
import { Button, Input } from "@/ui";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { VKButton } from "@/components/buttons/VkLoginButton";

const mockEmail = "tarasov.egor@mail.com";
const mockPass = "Test123456";

export const LoginPage = observer(() => {
  const [loginView, setLoginView] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const email = (e.target as any).email.value;
    const password = (e.target as any).password.value;
    if (loginView) {
      try {
        await AuthService.login(email, password);
        navigate("/");
      } catch (e) {
        setLoading(false);
      }
    } else {
      const repeatPassword = (e.target as any)["repeat-password"].value;
      if (password !== repeatPassword) {
        toast.error("Пароли не совпадают");
        setLoading(false);
        return;
      }
      try {
        await AuthService.register(email, password);
        navigate("/");
      } catch (e) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const vkLoginCode = new URLSearchParams(window.location.search).get("code");
    if (vkLoginCode) {
      setLoading(true);
      AuthService.loginVk(vkLoginCode).then((isSuccess) => {
        if (isSuccess) {
          setTimeout(() => {
            navigate("/");
          }, 300);
        }
        setLoading(false);
      });
    }
  }, [navigate]);

  return (
    <div className="size-full overflow-auto pb-10 flex flex-col items-center bg-white pt-20">
      <h1 className="text-3xl text-center font-bold pb-12">{loginView ? "Вход" : "Регистрация"}</h1>
      <form onSubmit={onSubmit} className="max-w-80 w-full space-y-2">
        <Input
          disabled={loading}
          defaultValue={mockEmail}
          label="Почта"
          name="email"
          type="email"
          placeholder="me@mts.ru"
        />
        <Input
          disabled={loading}
          defaultValue={mockPass}
          label="Пароль"
          name="password"
          type="password"
          placeholder="********"
        />
        {!loginView && (
          <Input
            label="Повторите пароль"
            name="repeat-password"
            type="password"
            disabled={loading}
            placeholder="********"
          />
        )}
        <button
          type="button"
          className="hover:underline text-link text-sm"
          onClick={() => setLoginView(!loginView)}>
          {loginView ? "Нет аккаунта?" : "Уже есть аккаунт?"}
        </button>
        <div className="h-6" />
        <Button type="submit" className="w-full" disabled={loading}>
          {loginView ? "Войти" : "Зарегистрироваться"}
        </Button>
        <VKButton />
      </form>
    </div>
  );
});

export default LoginPage;
