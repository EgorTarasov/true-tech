import { ReactNode } from "react";

export type LocaleWithIcon<T extends string> = Record<
  T,
  {
    icon: ReactNode;
    locale: string;
  }
>;

export type LocaleExtended<T extends string> = Record<
  T,
  {
    icon: ReactNode;
    locale: string;
    backgroundColor: string;
    color: string;
    borderColor: string;
  }
>;
