import { fetchData, postData, deleteData, patchData, putData } from "./api-helper";

const ACCOUNT_CODES_API = "account-codes";

export const getAllAccountCodes = () => fetchData(ACCOUNT_CODES_API);

export const deleteAccountCode = (id) => deleteData(`${ACCOUNT_CODES_API}/${id}`);

export const updateAccountCode = (id, data) => putData(`${ACCOUNT_CODES_API}/${id}`, data);

export const addAccountCode = (newAccountCodeData) => postData(ACCOUNT_CODES_API, newAccountCodeData);
