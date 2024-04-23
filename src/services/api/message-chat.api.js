import { fetchData, patchData, postData } from "./api-helper";

const MESSAGES_API = "messages";

export const fetchMessages = async (requisitionId) => {
  try {
    return await fetchData(`${MESSAGES_API}/${requisitionId}`);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchUserMessages = async (userId) => {
  try {
    return await fetchData(`${MESSAGES_API}/user/${userId}`);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const markMessageAsRead = async (userId, messageId) => {
  try {
    return await patchData(`${MESSAGES_API}/mark-read/${userId}/${messageId}`);
  } catch (error) {
   throw new Error(error.message);
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
    throw new Error(error.message);
  }
};
