import { redirect } from "@tanstack/react-router";

export const checkGrant = (allowed: boolean) => {
  if (allowed) {
    return;
  }

  throw redirect({
    to: "/login"
  });
};
