const tokenKey = "authToken";

let token: string | null = null;

const get = () => {
  if (token) {
    return token;
  }
  token = localStorage.getItem(tokenKey);
  return token;
};

const set = (newToken: string) => {
  localStorage.setItem(tokenKey, newToken);
  token = newToken;
  return token;
};

const remove = () => {
  localStorage.removeItem(tokenKey);
  token = null;
};

export const authToken = Object.assign(
  {},
  {
    get,
    set,
    remove,
  },
);
