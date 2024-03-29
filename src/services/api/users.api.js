import { fetchData, patchData } from "./api-helper";

const USERS_API = "users";
const DEACTIVATE_USER_API = "deactivate-user";
const CHANGE_ACCESS_API = "change-user-access";
const ALL_USERS = "all-users";
const CHANGE_PROFILE_PIC = "update-user-photo";
const CHANGE_SIGNATURE = "update-user-signature";

export const fetchAllUsers = async () => {
  try {
    const response = await fetchData(ALL_USERS);
    return response;
  } catch (error) {
    console.error(error?.response?.data?.message || error.message);
  }
};

export const fetchUsers = async (page = 0, rowsPerPage = 25) => {
  try {
    const response = await fetchData(`${USERS_API}?page=${page}&rowsPerPage=${rowsPerPage}`);
    return response;
  } catch (error) {
    console.error(error?.response?.data?.message || error.message);
  }
};

export const fetchSingleUser = async (userId) => {
  try {
    const response = await fetchData(`${USERS_API}/${userId}`);
    return response;
  } catch (error) {
    console.error(error?.response?.data?.message || error.message);
  }
};

export const fetchAlumni = async (page = 0, rowsPerPage = 25) => {
  try {
    const response = await fetchData(`${USERS_API}/alumni?page=${page}&rowsPerPage=${rowsPerPage}`);
    return response;
  } catch (error) {
    console.error(error?.response?.data?.message || error.message);
  }
};

export const deactivateUser = async (userId) => {
  try {
    const response = await patchData(DEACTIVATE_USER_API, { userId });
    return response;
  } catch (error) {
    console.error(error?.response?.data?.message || error.message);
  }
};

export const changeUserAccess = async (userId, accessLevel) => {
  try {
    const response = await patchData(CHANGE_ACCESS_API, { userId, accessLevel });
    return response;
  } catch (error) {
    console.error(error?.response?.data?.message || error.message);
  }
};

export const updateProfilePic = async (id, imageUrl) => {
  try {
    const response = await patchData(`${CHANGE_PROFILE_PIC}/${id}`, { imageUrl });
    return response;
  } catch (error) {
    console.error(error?.response?.data?.message || error.message);
  }
};

export const updateSignaturePic = async (id, imageUrl) => {
  try {
    const response = await patchData(`${CHANGE_SIGNATURE}/${id}`, { imageUrl });
    return response;
  } catch (error) {
    console.error(error?.response?.data?.message || error.message);
  }
};

export const fetchBudgetHolders = async () => {
  try {
    const response = await fetchData("budget-holders");
    return response;
  } catch (error) {
    console.error(error?.response?.data?.message || error.message);
  }
};
