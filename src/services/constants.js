import { API } from "./base-url";

export const STATUS_COLOR_TYPE = {
	pending: "warning",
	holderChecked: "neutral",
	requested: "secondary",
	checked: "primary",
	reviewed: "info",
	approved: "success",
	retired: "success",
	sentBack: "error",
	cancelled: "error",
	controlled: "error",
	deleted: "error",
};

export const VERIFY_PASSWORD_API = `${API}/verify-password`;
export const CHANGE_PASSWORD_API = `${API}/change-password`;
export const RESET_PASSWORD_API = `${API}/reset-password`;

export const REQUISITION_API = `${API}/requisitions`;
export const GET_ATTENTIONED_TO_REQUISITIONS_API = (email) =>
	`${API}/requisitions/attention/${email}`;
export const GET_ALL_APPROVED_REQUISITIONS_API = `${API}/requisitions/approved`;
export const GET_USER_REQUISITIONS_API = (email) =>
	`${API}/user-requisitions/${email}`;
export const GET_USER_UNRETIRED_REQUISITIONS_API = (email) =>
	`${API}/user-requisitions/unretired/${email}`;
export const BUDGET_HOLDER_CHECK_REQUISITION_API = (requisitionId) =>
	`${API}/requisitions/budgetHolderCheck/${requisitionId}`;
export const FINANCE_CHECK_REQUISITION_API = (requisitionId) =>
	`${API}/requisitions/financeCheck/${requisitionId}`;
export const FINANCE_REVIEW_REQUISITION_API = (requisitionId) =>
	`${API}/requisitions/financeReview/${requisitionId}`;
export const APPROVE_REQUISITION_API = (requisitionId) =>
	`${API}/requisitions/approve/${requisitionId}`;
export const DELETE_REQUISITION_API = (requisitionId) =>
	`${API}/requisitions/delete/${requisitionId}`;
export const CANCEL_REQUISITION_API = (requisitionId) =>
	`${API}/requisitions/cancel/${requisitionId}`;
export const GET_BIN_REQUISITIONS_API = `${API}/requisitions/bin`;
export const DESTROY_REQUISITION_API = (requisitionId) =>
	`${API}/requisitions/destroy/${requisitionId}`;
export const UPDATE_REQUISITION_API = (requisitionId) =>
	`${API}/requisitions/${requisitionId}`;
export const GET_REQUISITION_BY_ID_API = (requisitionId) =>
	`${API}/requisitions/${requisitionId}`;
export const FILTER_REQUISITIONS_API = `${API}/filter-requisitions`;

export const PROJECTS_API = `${API}/projects`;
export const BUDGET_CODES_API = `${API}/budget-codes`;
export const UPLOAD_FILE_API = `${API}/upload-file`;
export const MESSAGES_API = `${API}/messages`;
export const USERS_API = `${API}/users`;
export const DEACTIVATE_USER_API = `${API}/deactivate-user`;
export const CHANGE_ACCESS_API = `${API}/change-user-access`;
export const ACCOUNTS_API = `${API}/accounts`;
export const ACCOUNT_CODES_API = `${API}/account-codes`;
export const BUDEGT_CODES_API = `${API}/budget-codes`;
export const PROJECT_CODES_API = `${API}/projects`;

export const USER_ACCESS_LABELS = {
	user: "User",
	superUser: "Super User",
	userManager: "User Mgmt.",
	budgetHolder: "Budget Holder",
	finance: "Finance",
	financeReviewer: "Reviewer",
	tech: "Tech",
};

// This is for what users can view depending on what access group they fall into
export const ZERO_ACCESS_VIEW = ["staff", "user"];
export const BUDGET_ACCESS_VIEW = ["budgetHolder", "tech"];
export const FINANCE_ACCESS_VIEW = ["finance", "financeReviewer", "tech"];
export const USER_ACCESS_VIEW = ["userManager", "tech"];
export const SUPER_ACCESS_VIEW = ["superUser", "tech"];
export const ALL_ADMIN_VIEW = [
	"budgetHolder",
	"finance",
	"financeReviewer",
	"superUser",
	"userManager",
	"tech",
];

export const EMPTY_REQ_VALUES = {
	_id: "",
	accountName: "",
	accountNumber: "",
	amountInWords: "",
	approvedBy: {
		email: "",
		name: "",
		photoUrl: "",
		signatureUrl: "",
	},
	approvedDate: "",
	attentionTo: [],
	bankName: "",
	budgetLineItems: [
		{
			label: "",
			value: "",
			_id: "",
		},
	],
	checkedBy: {
		email: "",
		name: "",
		photoUrl: "",
		signatureUrl: "",
	},
	checkedDate: "",
	codes: "",
	countRef: 0,
	currency: "",
	date: "",
	hoderCheckDate: "",
	holderCheckDate: "",
	holderCheck: {
		email: "",
		name: "",
		signatureUrl: "",
	},
	id: "",
	includeTax: false,
	invoices: [
		{
			id: "",
			name: "",
			url: "",
			_id: "",
		},
		{
			id: "",
			name: "",
			url: "",
			_id: "",
		},
	],
	items: [
		{
			amount: 0,
			code: "",
			title: "",
			_id: "",
		},
	],
	name: "",
	projectChargedTo: {
		account: {
			accountName: "",
			accountNumber: "",
			balance: "",
			bankName: "",
			id: "",
		},
		funder: "",
		id: "",
		projectName: "",
	},
	projectId: "",
	projectName: "",
	pvNumber: 0,
	reviewDate: "",
	reviewedBy: {
		email: "",
		name: "",
		photoUrl: "",
		signatureUrl: "",
	},
	sourceAccountNumber: "",
	sourceBankName: "",
	status: "",
	step: 0,
	taxPercentage: "",
	taxable: "",
	time: "",
	title: "",
	total: "",
	type: "",
	user: {
		email: "",
		name: "",
		photoUrl: "",
		signatureUrl: "",
	},
	userId: "",
	paid: false,
	retired: false,
	updatedAt: "",
};
