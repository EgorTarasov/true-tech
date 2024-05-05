import { FC, ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import ExpandIcon from "./assets/expand.svg";
import { Button, Logo } from "@/ui";

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
    <NavLink to={x.to} className={({ isActive }) => twMerge("")}>
      {x.children}
    </NavLink>
  );
};

export const DesktopNavigation = () => {
  return (
    <nav className="w-full bg-bg">
      <div className="section w-full flex items-center">
        <ul className="flex items-center">
          <li>
            <Link to={"/"} className="pl-0">
              Частным клиентам
            </Link>
          </li>
          <li className="h-6 w-px bg-grey" />
          <li>
            <Link to={"/map"} className="pr-2">
              Все сайты <ExpandIcon />
            </Link>
          </li>
        </ul>
        <Button appearance="outline" className="ml-auto">
          Выйти
        </Button>
      </div>
      <div className="bg-white">
        <div className="section flex py-6 gap-24">
          <Logo />
          <ul className="flex items-center font-medium text-lg *:px-3 *:cursor-pointer">
            <li>
              <RibbonLink to="/">Главная</RibbonLink>
            </li>
            <li>
              <RibbonLink to="/">Платежи и переводы</RibbonLink>
            </li>
            <li>
              <RibbonLink to="/">История</RibbonLink>
            </li>
            <li>
              <RibbonLink to="/">Банковские продукты</RibbonLink>
            </li>
            <li>
              <RibbonLink to="/">Предложения</RibbonLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
