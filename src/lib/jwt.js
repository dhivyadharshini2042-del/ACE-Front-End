import Cookies from "js-cookie";

export const decodeAuthToken = () => {
  try {
    const token = Cookies.get("authToken");
    if (!token) return null;

    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));

    return decoded; // contains data, iat, exp
  } catch (err) {
    return null;
  }
};
