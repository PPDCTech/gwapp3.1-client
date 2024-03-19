import { fetchData, postData, deleteData, patchData } from "./api-helper";

const VENDORS_API = "vendors";

export const getAllVendors = () => fetchData(VENDORS_API);

export const deleteVendor = (id) => deleteData(`${VENDORS_API}/${id}`);

export const updateVendor = (id, data) => patchData(`${VENDORS_API}/${id}`, data);

export const addVendor = (data) => postData(VENDORS_API, data);

export const getUserVendors = (userId) => fetchData(`${VENDORS_API}/user/${userId}`);
