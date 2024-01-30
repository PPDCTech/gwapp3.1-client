import dayjs from "dayjs";

export const formatDate = (date) => {
  if (new Date(date).toString() === "Invalid Date") {
    return "N/A";
  }

  return new Date(date).toLocaleDateString(undefined, {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
};

export const formatDateHyphen = (timestamp) => {
  return dayjs(timestamp).format("DD-MM-YY");
};

export const formatDateSpace = (timestamp) => {
    return dayjs(timestamp).format("DD MMM YYYY");
  };
  