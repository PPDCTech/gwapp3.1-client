import { postData } from "./api-helper";

const LOGIN_API = "login";
const VERIFY_LOGIN_API = "verify-login";

export const loginUser = async (email) => {
  try {
    const response = await postData(LOGIN_API, { email });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const verifyLogin = async (password) => {
  try {
    const response = await postData(VERIFY_LOGIN_API, { password });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};
