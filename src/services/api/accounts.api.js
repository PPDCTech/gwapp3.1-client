import { fetchData, postData, deleteData, patchData } from "./api-helper";

const ACCOUNTS_API = "accounts";

export const getAllAccounts = () => fetchData(ACCOUNTS_API);

export const deleteAccount = (id) => deleteData(`${ACCOUNTS_API}/${id}`);

export const updateAccount = (id, data) => patchData(`${ACCOUNTS_API}/${id}`, data);

export const addAccount = (newAccountData) => postData(ACCOUNTS_API, newAccountData);
