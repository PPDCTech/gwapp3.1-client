import axios from "axios";
import { toast } from "react-toastify";

const API = process.env.API;

const setAuthorizationHeader = () => {
  const token = window.localStorage.getItem("token");
  if (token) {
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    delete axios.defaults.headers.common["Authorization"];
  }
};

export const uploadFileAPI = async (formData) => {
  try {
    setAuthorizationHeader();
    const response = await axios.post(`${API}/upload-file`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    toast.error("Error uploading files");
    console.error("Error uploading files:", error.message);
    throw error;
  }
};

export const removeFileAPI = async (publicId) => {
  try {
    setAuthorizationHeader();
    const response = await axios.delete(`${API}/remove-file`, {
      data: { publicId },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    toast.error("Error uploading files");
    console.error("Error removing file:", error.message);
    throw error;
  }
};
