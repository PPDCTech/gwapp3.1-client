import axios from "axios";
import { API } from "../base-url";


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
    throw new Error(error.message);
  }
};

export const removeFileAPI = async (publicId, reqId) => {
  try {
    setAuthorizationHeader();
    const response = await axios.delete(`${API}/remove-file`, {
					data: { publicId, reqId },
					headers: {
						"Content-Type": "application/json",
					},
				});
    return response;
  } catch (error) {
    console.error("Error removing file:", error.message);
    throw new Error(error.message);
  }
};

export const removeFilesAPI = async (publicIds) => {
  try {
    setAuthorizationHeader();
    const response = await axios.delete(`${API}/remove-files`, {
      data: { publicIds },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response;
  } catch (error) {
    console.error("Error removing file:", error.message);
    throw new Error(error.message);
  }
};
