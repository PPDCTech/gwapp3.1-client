import {
    fetchData,
    postData,
    putData,
    patchData,
    deleteData,
} from "./api-helper";

const REQUISITION_API = "requisitions";

export const createRequisition = (data) => postData(REQUISITION_API, data);

export const getAllRequisitions = (page, limit) => {
    if (page && limit) {
        return fetchData(`${REQUISITION_API}?page=${page}&limit=${limit}`);
    }
    return fetchData(REQUISITION_API);
};

export const getRequisitionById = (id) => fetchData(`${REQUISITION_API}/${id}`);

export const getAttentionedToRequisitions = (email, page, limit) => {
    if (page && limit) {
        return fetchData(`attention/${email}?page=${page}&limit=${limit}`);
    }
    return fetchData(`${REQUISITION_API}/attention/${email}`);
};

export const getAllApprovedRequisitions = async (queryParams) => {
    try {
        const params = new URLSearchParams(queryParams).toString();
        return fetchData(`${REQUISITION_API}/approved?${params}`);
    } catch (error) {
        console.error("Error fetching approved requisitions:", error);
        let errorMessage = "An error occurred.";
        if (error.response && error.response.data) {
            errorMessage =
                error.response.data.message || error.response.data.error;
        }
        throw new Error(errorMessage);
    }
};

export const getApprovedForPrint = async (params = {}) => {
    const query = Object.keys(params).length
        ? `?${new URLSearchParams(params).toString()}`
        : "";
    const endpointWithQuery = `print/approved${query}`;

    return await fetchData(endpointWithQuery);
};

export const getUserRequisitions = (userId, page, limit) => {
    if (page && limit) {
        return fetchData(
            `user-requisitions/${userId}?page=${page}&limit=${limit}`
        );
    }
    return fetchData(`user-requisitions/${userId}`);
};

export const getUserUnretiredRequisitions = (email, page, limit) => {
    if (page && limit) {
        return fetchData(
            `user-requisitions/unretired/${email}?page=${page}&limit=${limit}`
        );
    }
    return fetchData(`user-requisitions/unretired/${email}`);
};

export const updateRequisition = (id, data) =>
    putData(`${REQUISITION_API}/${id}`, data);

export const updateRequisitionStatus = (id, status) =>
    patchData(`${REQUISITION_API}/${id}`, { status });

export const searchFilterRequisitions = (queryParams, page, limit) => {
    const endpoint = "filter-requisitions";
    const params = new URLSearchParams(queryParams).toString();
    const url = `${endpoint}?${params}`;
    if (page && limit) {
        return fetchData(`${url}&page=${page}&limit=${limit}`);
    }
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

export const deleteRequisition = (requisitionId) =>
    putData(`requisitions/delete/${requisitionId}`);

export const cancelRequisition = (requisitionId) =>
    putData(`requisitions/cancel/${requisitionId}`);

export const binRequisitions = () => fetchData(`requisitions/bin`);

export const destroyRequisition = (requisitionId) =>
    deleteData(`requisitions/destroy/${requisitionId}`);

export const sendForRetire = (id, data) =>
    putData(`user-requisitions/retire/${id}`, data);

export const markAsRetired = (requisitionId) =>
    patchData(`finance-requisitions/retire/${requisitionId}`);

export const sendBackRequisition = (requisitionId) =>
    putData(`send-requisition-back/${requisitionId}`);
