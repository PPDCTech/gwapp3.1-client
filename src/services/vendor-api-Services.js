import httpServices from "./httpServices";

export const signin = async (userData) => {
	try {
		const res = await httpServices.post("/public/vendor/signin", userData);
		return res.data;
	} catch (err) {
		let errorMessage = "Unable to login. Please try again later.";
		if (err.response && err.response.data && err.response.data.message) {
			errorMessage = err.response.data.message;
		}
		throw new Error(errorMessage);
	}
};

export const signup = async (form) => {
	try {
		const response = await httpServices.post("/public/vendor/signup", form);
		return response;
	} catch (err) {
		let errorMessage;
		if (err.response && err.response.data && err.response.data.message) {
			errorMessage = err.response.data.message;
		}
		throw new Error(errorMessage);
	}
};

export const updateProfile = async (id, form) => {
	try {
		const res = await httpServices.put(
			`/public/vendor/${id}/update-profile`,
			form,
		);
		return res.data;
	} catch (err) {
		let errorMessage;
		if (err.response && err.response.data && err.response.data.message) {
			errorMessage = err.response.data.message;
		}
		throw new Error(errorMessage);
	}
};

export const requestResetPassword = async (form) => {
	try {
		const res = await httpServices.post("/public/vendor/reset-password", form);

		return res.data;
	} catch (err) {
		let errorMessage;
		if (err.response && err.response.data && err.response.data.message) {
			errorMessage = err.response.data.message;
		}
		throw new Error(errorMessage);
	}
};

export const verifyTokenAndResetPassword = async (form) => {
	try {
		const res = await httpServices.post(
			"/public/vendor/confirm-reset-password",
			form,
		);
		return res.data;
	} catch (err) {
		let errorMessage;
		if (err.response && err.response.data && err.response.data.message) {
			errorMessage = err.response.data.message;
		}
		throw new Error(errorMessage);
	}
};

export const changePassword = async (form) => {
	try {
		const res = await httpServices.patch("/public/vendor/change-password", form);
		return res.data;
	} catch (err) {
		let errorMessage;
		if (err.response && err.response.data && err.response.data.message) {
			errorMessage = err.response.data.message;
		}
		throw new Error(errorMessage);
	}
};

export const removeFile = async (fileId, doc) => {
	try {
		const res = await httpServices.delete(
			`/public/vendor/remove-file/${fileId}`,
			doc,
		);
		return res.data;
	} catch (err) {
		let errorMessage;
		if (err.response && err.response.data && err.response.data.message) {
			errorMessage = err.response.data.message;
		}
		throw new Error(errorMessage);
	}
};

export const adminChangeStatus = async (form) => {
	try {
		const res = await httpServices.put(
			"/public/vendor/admin/change-status",
			form,
		);
		return res.data;
	} catch (err) {
		let errorMessage;
		if (err.response && err.response.data && err.response.data.message) {
			errorMessage = err.response.data.message;
		}
		throw new Error(errorMessage);
	}
};

export const adminDeleteVendor = async (id) => {
	try {
		const res = await httpServices.delete(`/public/vendor/admin/delete/${id}`);
		return res.data;
	} catch (err) {
		let errorMessage;
		if (err.response && err.response.data && err.response.data.message) {
			errorMessage = err.response.data.message;
		}
		throw new Error(errorMessage);
	}
};

export const getAllVendors = async (page, limit, status, keyword) => {
	const params = new URLSearchParams();
	if (page) params.append("page", page);
	if (limit) params.append("limit", limit);
	if (keyword) params.append("keyword", keyword);
	if (status) params.append("status", status);

	const url = `/public/vendor/all?${params.toString()}`;

	try {
		const res = await httpServices.get(url);
		return res.data;
	} catch (err) {
		let errorMessage;
		if (err.response && err.response.data && err.response.data.message) {
			errorMessage = err.response.data.message;
		}
		throw new Error(errorMessage);
	}
};

export const viewAVendor = async (id) => {
	try {
		const res = await httpServices.get(`/public/vendor/${id}/view`);
		return res;
	} catch (err) {
		let errorMessage;
		if (err.response && err.response.data && err.response.data.message) {
			errorMessage = err.response.data.message;
		}
		throw new Error(errorMessage);
	}
};
