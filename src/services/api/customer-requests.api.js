import { fetchData, postData } from "./api-helper";

const CUSTOMERS_REQ_API = "customer-requests";

export const addCustomerRequest = (customerData) => {
    try {
        return postData(CUSTOMERS_REQ_API, customerData);
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getAllCustomerRequests = () => {
    try {
        return fetchData(CUSTOMERS_REQ_API);
    } catch (error) {
        throw new Error(error.message);
    }
}