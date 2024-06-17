import { buttonVariants } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import React from "react";

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <p className="text-2xl text-muted-foreground mt-2">Мы не нашли такую страницу.</p>
      <Link
        to="/"
        className={buttonVariants({
          variant: "default",
          size: "lg",
          className: "mt-10"
        })}>
        На главную
      </Link>
    </div>
  );
};

export default NotFoundPage;
