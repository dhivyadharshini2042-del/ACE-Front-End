export const isUserLoggedIn = () => {
  if (typeof document === "undefined") return false;

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("authToken="));

  return Boolean(token);
};
