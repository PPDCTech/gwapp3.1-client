import axios from "axios";

const API = process.env.API;

const setAuthorizationHeader = () => {
  const token = window.localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const postData = async (endpoint, data) => {
  try {
    setAuthorizationHeader();
    const response = await axios.post(`${API}/${endpoint}`, data);
    return response;
  } catch (error) {
    console.error("Error during POST request:", error);
    return null;
  }
};

export const fetchData = async (endpoint) => {
  try {
    setAuthorizationHeader();
    const response = axios ? await axios.get(`${API}/${endpoint}`) : null;
    return response;
  } catch (error) {
    console.error("Error during GET request:", error);
    throw error;
  }
};

export const putData = async (endpoint, data) => {
  try {
    setAuthorizationHeader();
    const response = await axios.put(`${API}/${endpoint}`, data);
    return response;
  } catch (error) {
    console.error("Error during PUT request:", error);
    return null;
  }
};

export const patchData = async (endpoint, data) => {
  try {
    setAuthorizationHeader();
    const response = await axios.patch(`${API}/${endpoint}`, data);
    return response;
  } catch (error) {
    console.error("Error during PATCH request:", error);
    return null;
  }
};

export const deleteData = async (endpoint) => {
  try {
    setAuthorizationHeader();
    const response = await axios.delete(`${API}/${endpoint}`);
    return response;
  } catch (error) {
    console.error("Error during DELETE request:", error);
    return null;
  }
};
