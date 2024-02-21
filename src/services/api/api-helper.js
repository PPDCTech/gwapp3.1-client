import axios from "axios";

const API = process.env.API;

// if (typeof window !== "undefined") {
//   const token = localStorage.getItem("token");
//   if (token) {
//     axios.defaults.headers.common["Authorization"] = token;
//   }
// }

export const postData = async (endpoint, data) => {
  try {
    const token = window.localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.post(`${API}/${endpoint}`, data);
    return response;
  } catch (error) {
    console.error("Error during POST request:", error);
    return null;
  }
};

export const fetchData = async (endpoint) => {
  try {
    console.log(`${API}/${endpoint}`);
    const token = window.localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.get(`${API}/${endpoint}`);
    return response;
  } catch (error) {
    console.error("Error during GET request:", error);
    throw error;
  }
};

export const putData = async (endpoint, data) => {
  try {
    const token = window.localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.put(`${API}/${endpoint}`, data);
    return response;
  } catch (error) {
    console.error("Error during PUT request:", error);
    return null;
  }
};

export const patchData = async (endpoint, data) => {
  try {
    const token = window.localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;

    const response = await axios.patch(`${API}/${endpoint}`, data);
    return response;
  } catch (error) {
    console.error("Error during PATCH request:", error);
    return null;
  }
};

export const deleteData = async (endpoint) => {
  try {
    const token = window.localStorage.getItem("token");
    axios.defaults.headers.common["Authorization"] = token;
    
    const response = await axios.delete(`${API}/${endpoint}`);
    return response;
  } catch (error) {
    console.error("Error during DELETE request:", error);
    return null;
  }
};
