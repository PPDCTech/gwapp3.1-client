import httpServices from "./httpServices";

export const newContract = async (data) => {
	try {
		const res = await httpServices.post("/contract/new", data);
		return res.data;
	} catch (err) {
		let errorMessage = "Unable to create contract. Please try again later.";
		if (err.response && err.response.data && err.response.data.message) {
			errorMessage = err.response.data.message;
		}
		throw new Error(errorMessage);
	}
};

export const applyForContract = async (contractId) => {
	try {
		const response = await httpServices.put(`/contract/${contractId}/apply`);
		return response;
	} catch (err) {
		let errorMessage;
		if (err.response && err.response.data && err.response.data.message) {
			errorMessage = err.response.data.message;
		}
		throw new Error(errorMessage);
	}
};

export const updateContract = async (id, form) => {
	try {
		const response = await httpServices.put(`/contract/${id}/update`, form);
		return response;
	} catch (err) {
		let errorMessage;
		if (err.response && err.response.data && err.response.data.message) {
			errorMessage = err.response.data.message;
		}
		throw new Error(errorMessage);
	}
};

export const deleteContract = async (id) => {
	try {
		const response = await httpServices.delete(`/contract/delete/${id}`);
		return response;
	} catch (err) {
		let errorMessage;
		if (err.response && err.response.data && err.response.data.message) {
			errorMessage = err.response.data.message;
		}
		throw new Error(errorMessage);
	}
};

export const awardContract = async (contractId, form) => {
	try {
		const res = await httpServices.patch(`/contract/${contractId}/award`, form);
		return res.data;
	} catch (err) {
		let errorMessage;
		if (err.response && err.response.data && err.response.data.message) {
			errorMessage = err.response.data.message;
		}
		throw new Error(errorMessage);
	}
};

export const viewAContract = async (id) => {
	try {
		const res = await httpServices.get(`/contract/${id}/view`);
		return res;
	} catch (err) {
		let errorMessage;
		if (err.response && err.response.data && err.response.data.message) {
			errorMessage = err.response.data.message;
		}
		throw new Error(errorMessage);
	}
};

export const getAllContracts = async (page, limit, status, keyword) => {
	const params = new URLSearchParams();
	if (page) params.append("page", page);
	if (limit) params.append("limit", limit);
	if (status) params.append("status", status);
	if (keyword) params.append("keyword", keyword);

	const url = `/contract/all?${params.toString()}`;

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
