import { fetchData, postData, putData, patchData, deleteData } from "./api-helper";

const REQUISITION_API = "requisitions";

export const createRequisition = (data) => postData(REQUISITION_API, data);

export const getAllRequisitions = () => fetchData(REQUISITION_API);

export const getRequisitionById = (id) => fetchData(`${REQUISITION_API}/${id}`);

export const getAttentionedToRequisitions = (email) =>
  fetchData(`${REQUISITION_API}/attention/${email}`);

export const getAllApprovedRequisitions = async (queryParams) => {
  try {
    const params = new URLSearchParams(queryParams).toString();
    return fetchData(`${REQUISITION_API}/approved?${params}`);
  } catch (error) {
    console.error("Error fetching approved requisitions:", error);
    throw error;
  }
};

export const getUserRequisitions = (userId) => fetchData(`user-requisitions/${userId}`);

export const getUserUnretiredRequisitions = (email) =>
  fetchData(`user-requisitions/unretired/${email}`);

export const updateRequisition = (id, data) => putData(`${REQUISITION_API}/${id}`, data);

export const updateRequisitionStatus = (id, status) =>
  patchData(`${REQUISITION_API}/${id}`, { status });

export const searchFilterRequisitions = (queryParams) => {
  const endpoint = "filter-requisitions";
  const params = new URLSearchParams(queryParams).toString();
  const url = `${endpoint}?${params}`;
  return fetchData(url);
};

// REQUISITION CHECKS FUNCTION
export const budgetHolderCheckRequisition = (requisitionId, body) =>
  putData(`requisitions/budgetHolderCheck/${requisitionId}`, body);

export const financeCheckRequisition = (requisitionId, body) =>
  putData(`requisitions/financeCheck/${requisitionId}`, body);

export const financeReviewRequisition = (requisitionId, body) =>
  putData(`requisitions/financeReview/${requisitionId}`, body);

export const approveRequisition = (requisitionId, body) =>
  putData(`requisitions/approve/${requisitionId}`, body);

export const deleteRequisition = (requisitionId) => putData(`requisitions/delete/${requisitionId}`);

export const cancelRequisition = (requisitionId) => putData(`requisitions/cancel/${requisitionId}`);

export const binRequisitions = () => fetchData(`requisitions/bin`);

export const destroyRequisition = (requisitionId) =>
  deleteData(`requisitions/destroy/${requisitionId}`);

export const markAsRetired = (requisitionId) =>
  putData(`user-requisitions/retire/${requisitionId}`);

export const sendBackRequisition = (requisitionId) =>
  putData(`send-requisition-back/${requisitionId}`);
