import { FC, ReactNode, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import ExpandIcon from "./assets/expand.svg";
import { Button, Logo } from "@/ui";
import { SpeechWidget } from "../speech/speech.widget";
import { observer } from "mobx-react-lite";
import { AuthService } from "../../../stores/auth.store";

interface LinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

const Link: FC<LinkProps> = (x) => {
  return (
    <NavLink
      to={x.to}
      className={({ isActive }) =>
        twMerge(
          "relative flex w-fit justify-center items-center gap-2 px-6 pb-4 pt-5 text-grey",
          isActive && "text-black after:absolute after:top-0 after:w-3/4 after:h-1 after:bg-red",
          x.className
        )
      }>
      {x.children}
    </NavLink>
  );
};

const RibbonLink: FC<LinkProps> = (x) => {
  return (
    <NavLink to={x.to} className={({ isActive }) => twMerge("px-3 cursor-pointer")}>
      {x.children}
    </NavLink>
  );
};

export const DesktopNavigation = observer(() => {
  const navigate = useNavigate();
  useEffect(() => {
    if (AuthService.item.state === "authenticated") {
      navigate("/");
    }
  }, [AuthService.item.state, navigate]);

  if (AuthService.item.state !== "authenticated") {
    return (
      <nav className="justify-between section flex items-center h-14">
        <Logo />
        <a href="tel:8-800-250-01-99" className="text-lg">
          8 800 250-01-99
        </a>
      </nav>
    );
  }

  return (
    <nav className="w-full bg-bg">
      <div className="section w-full flex items-center gap-2">
        <ul className="flex items-center">
          <li>
            <Link to={"/"} className="pl-0">
              Частным клиентам
            </Link>
          </li>
          <li className="h-6 w-px bg-grey" />
          <li>
            <Link to={"/assistant"} className="pr-2">
              Ассистент
            </Link>
          </li>
        </ul>
        <SpeechWidget />
        <Button onClick={() => AuthService.logout()} appearance="outline">
          Выйти
        </Button>
      </div>
      <div className="bg-white">
        <div className="section flex py-6 gap-6 sm:gap-24 flex-col sm:flex-row">
          <Logo />
          <ul className="flex items-center font-medium text-lg *:hidden">
            <li className="!flex">
              <RibbonLink to="/">Главная</RibbonLink>
            </li>
            <li className="!flex">
              <RibbonLink to="/">Платежи и переводы</RibbonLink>
            </li>
            <li className="sm:flex">
              <RibbonLink to="/">История</RibbonLink>
            </li>
            <li className="md:flex">
              <RibbonLink to="/">Банковские продукты</RibbonLink>
            </li>
            <li className="content:flex">
              <RibbonLink to="/">Предложения</RibbonLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
});
