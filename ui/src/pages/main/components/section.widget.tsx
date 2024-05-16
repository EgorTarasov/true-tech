import { PropsWithChildren } from "react";

export const Section = (x: PropsWithChildren<{ title: string }>) => {
  return (
    <section className="space-y-6 w-full" title={x.title}>
      <h2 className="text-2xl font-medium">{x.title}</h2>
      {x.children}
    </section>
  );
};
