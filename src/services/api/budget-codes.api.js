import { fetchData, postData, deleteData, patchData } from "./api-helper";

const BUDGET_CODES_API = "budget-codes";

export const getAllBudgetCodes = () => fetchData(BUDGET_CODES_API);

export const deleteBudgetCode = (id) => deleteData(`${BUDGET_CODES_API}/${id}`);

export const updateBudgetCode = (id, data) => patchData(`${BUDGET_CODES_API}/${id}`, data);

export const addBudgetCode = (newBudgetCodeData) => postData(BUDGET_CODES_API, newBudgetCodeData);
