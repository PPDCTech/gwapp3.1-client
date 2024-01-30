// const API = "https://gwapp3-api.vercel.app/";
const API = "http://localhost:8080";

export const STATUS_COLOR_TYPE = {
  pending: "neutral",
  holderChecked: "secondary",
  checked: "primary",
  reviewed: "info",
  approved: "success",
  sentBack: "warning",
  cancelled: "error",
};

export const LOGIN_API_URL = `${API}/login`;
export const GET_USERS_URL = `${API}/users`;
export const GET_USER_REQUISITIONS = (email) => `${API}/requisitions/email/${email}`;
export const REQUISITION_URL = `${API}/requisitions`;
export const PROJECTS_URL = `${API}/projects`;
export const BUDGET_CODES_URL = `${API}/budget-codes`;
export const UPLOAD_FILE_URL = `${API}/upload-file`;
export const MESSAGES_URL = `${API}/messages`;
export const USERS_URL = `${API}/users`;

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
