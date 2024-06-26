import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zz } from "@/utils/zz";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { AuthService } from "@/stores/auth.service";

const loginSchema = zz.object({
  email: zz.string().email(),
  password: zz.string(),
});

export const Page = () => {
  const navigate = useNavigate();
  const form = useForm<zz.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (v: zz.infer<typeof loginSchema>) => {
    const res = await AuthService.login(v);
    if (res) {
      navigate({
        to: "/",
      });
    } else {
      toast.error("Неверная почта или пароль");
    }
  };

  const disabled = form.formState.isSubmitting;

  return (
    <Card className="m-auto max-w-sm w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Вход</CardTitle>
        <CardDescription>
          Введите вашу почту чтобы войти в аккаунт
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Почта</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      name="email"
                      disabled={disabled}
                      placeholder="me@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel className="flex">Пароль</FormLabel>
                    <Link
                      onClick={() =>
                        toast.info("Обратитесь к администратору системы")
                      }
                      className="ml-auto inline-block text-sm underline text-foreground"
                    >
                      Забыли пароль?
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      {...field}
                      name="password"
                      disabled={disabled}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={disabled}>
              Войти
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Нет аккаунта?{" "}
            <Link to="/register" className="underline">
              Регистрация
            </Link>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export const Route = createFileRoute("/_base/login")({
  component: () => <Page />,
});
