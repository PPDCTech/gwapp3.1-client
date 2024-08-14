import { fetchData, patchData, postData } from "./api-helper";

const USERS_API = "users";
const DEACTIVATE_USER_API = "deactivate-user";
const CHANGE_ACCESS_API = "change-user-access";
const CHANGE_ROLES_API = "change-user-roles"; 
const ALL_USERS = "all-users";
const ADD_USER = "users/create";
const CHANGE_PROFILE_PIC = "update-user-photo";
const CHANGE_SIGNATURE = "update-user-signature";

export const addNewUser = async (formData) => {
  try {
    const response = await postData(ADD_USER, formData);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchAllUsers = async () => {
  try {
    const response = await fetchData(ALL_USERS);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchUsers = async (page = 0, rowsPerPage = 25, keyword) => {
  try {
    const response = await fetchData(`${USERS_API}?page=${page}&rowsPerPage=${rowsPerPage}&keyword=${keyword}`);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const fetchSingleUser = async (userId) => {
  try {
    const response = await fetchData(`${USERS_API}/${userId}`);
    return response;
  } catch (error) {
    console.log("Error fetching user:", error, error.message);
    throw new Error(error.message);
  }
};

export const fetchAlumni = async (page = 0, rowsPerPage = 25, keyword) => {
  try {
    const response = await fetchData(`${USERS_API}/alumni?page=${page}&rowsPerPage=${rowsPerPage}&keyword=${keyword}`);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deactivateUser = async (userId) => {
  try {
    const response = await patchData(DEACTIVATE_USER_API, { userId });
    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const changeUserAccess = async (userId, accessLevel) => {
  try {
    const response = await patchData(CHANGE_ACCESS_API, { userId, accessLevel });
    return response;
  } catch (error) {
   throw new Error(error.message);
  }
};

export const changeUserRoles = async (userId, roles) => {
  try {
    const response = await patchData(CHANGE_ROLES_API, { userId, roles });
    return response;
  } catch (error) {
   throw new Error(error.message);
  }
};

export const updateProfilePic = async (id, imageUrl) => {
  try {
    const response = await patchData(`${CHANGE_PROFILE_PIC}/${id}`, { imageUrl });
    return response;
  } catch (error) {
   throw new Error(error.message);
  }
};

export const updateSignaturePic = async (id, imageUrl) => {
  try {
    const response = await patchData(`${CHANGE_SIGNATURE}/${id}`, { imageUrl });
    return response;
  } catch (error) {
   throw new Error(error.message);
  }
};

export const fetchBudgetHolders = async () => {
  try {
    const response = await fetchData("budget-holders");
    return response;
  } catch (error) {
   throw new Error(error.message);
  }
};
