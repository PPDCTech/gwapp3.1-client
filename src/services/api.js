
import { fetchData, postData } from './helpers';
import { MESSAGES_URL, REQUISITION_URL } from './constants';

export const fetchMessages = async (requisitionId) => {
  try {
    return await fetchData(`${MESSAGES_URL}/${requisitionId}`);
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
    return await postData(MESSAGES_URL, payload);
  } catch (error) {
    throw error;
  }
};

export const fetchSingleRequisition = async (requisitionId) => {
    try {
      return await fetchData(`${REQUISITION_URL}/${requisitionId}`);
    } catch (error) {
      throw error;
    }
  };