// This file is for same purpose of the dashboard files in the API
import { fetchData } from "./api-helper";

const DASHBOARD_API = "dashboard";

export const getAllHolderCheckedRequisitions = () => fetchData(`${DASHBOARD_API}/holder-checked`);
export const getAllFinanceCheckedRequisitions = () => fetchData(`${DASHBOARD_API}/finance-checked`);
export const getAllReviewedRequisitions = () => fetchData(`${DASHBOARD_API}/reviewed`);