import axios from "axios";
import { API } from "./base-url";

const axiosInstance = axios.create({
	baseURL: API,
	headers: {
		"Content-Type": "application/json",
	},
});

axiosInstance.interceptors.request.use(
	async (config) => {
		const access_token = window.localStorage.getItem("token");

		if (access_token !== null) {
			config.headers["Authorization"] = `Bearer ${access_token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

const httpServices = {
	get: axiosInstance.get,
	post: (url, data, config) => {
		if (data instanceof FormData) {
			// If data is FormData, set 'Content-Type' to 'multipart/form-data'
			return axiosInstance.post(url, data, {
				...config,
				headers: { ...config?.headers, "Content-Type": "multipart/form-data" },
			});
		} else {
			return axiosInstance.post(url, data, config);
		}
	},
	put: (url, data, config) => {
		if (data instanceof FormData) {
			// If data is FormData, set 'Content-Type' to 'multipart/form-data'
			return axiosInstance.put(url, data, {
				...config,
				headers: { ...config?.headers, "Content-Type": "multipart/form-data" },
			});
		} else {
			return axiosInstance.put(url, data, config);
		}
	},
	delete: axiosInstance.delete,
	patch: (url, data, config) => {
		if (data instanceof FormData) {
			// If data is FormData, set 'Content-Type' to 'multipart/form-data'
			return axiosInstance.patch(url, data, {
				...config,
				headers: { ...config?.headers, "Content-Type": "multipart/form-data" },
			});
		} else {
			return axiosInstance.patch(url, data, config);
		}
	},
};

export default httpServices;
