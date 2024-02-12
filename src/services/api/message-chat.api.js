import { fetchData, postData } from "./api-helper";

const MESSAGES_API = "messages";

export const fetchMessages = async (requisitionId) => {
  try {
    return await fetchData(`${MESSAGES_API}/${requisitionId}`);
  } catch (error) {
    throw error;
  }
};

export const addMessage = async (requisitionId, userId, message) => {
  try {
    const payload = {
      requisition_id: requisitionId,
      user_id: userId,
      message: message,
    };
    return await postData(MESSAGES_API, payload);
  } catch (error) {
    throw error;
  }
};
