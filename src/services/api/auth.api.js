import { postData } from "./api-helper";

const LOGIN_API = "login";

export const loginUser = async (email, password) => {
  try {
    const response = await postData(LOGIN_API, { email, password });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};
