import dayjs from "dayjs";
import { toast } from "react-toastify";

export const getDateForPrint = (timestamp) => {
  return dayjs(Math.abs(Number(timestamp))).format("DD/MM/YYYY");
};

export const getDateForPrintSpace = (timestamp) => {
  return dayjs(timestamp).format("DD MMM YYYY");
  // return dayjs(Math.abs(Number(timestamp))).format("DD MMM YYYY");
};

export const getDateForPrintHyphen = (timestamp) => {
  return dayjs(Math.abs(Number(timestamp))).format("DD-MM-YY");
};

export const getDateMDY = (date) => {
  if (dayjs(date).isValid()) {
    return dayjs(date).format("MMM D, YYYY");
  }

  return "Invalid Date";
};

export const getCurrentDateTimeString = () => {
  const currentDate = new Date();
  const dateTimeString = currentDate.toISOString().split(".")[0];
  return dateTimeString;
};

export const currentDate = new Date().toLocaleString("en-NG", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

export const getDateYearMonthDay = (dateString) => {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return "N/A";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export const tobase64 = (url) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    let img = document.createElement("img");
    let ctx = canvas.getContext("2d");

    img.setAttribute("src", url);
    img.crossOrigin = "anonymous";

    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      let dataUrl = canvas.toDataURL("image/png");
      resolve(dataUrl);
    };

    img.onerror = function (e) {
      console.info("error: ", e.message);
      reject(e.message);
    };
  });
};

export const capitalizeFirstLetter = (str) => {
  if (!str) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// CURRENCY
export const currencyCodes = {
  NGN: "₦",
  USD: "$",
};

export const currencyWord = {
  NGN: "Naira",
  USD: "Dollars",
};
export const currencySubWord = {
  NGN: "Kobo",
  USD: "Cents",
};

export const formatNaira = (amount) => {
  if (amount !== null && amount !== undefined) {
    return amount.toLocaleString("en-NG");
  }
  return null;
};

export const formatAmount = (amount) => {
  if (amount < 1000000) {
    return `${amount.toLocaleString()}`;
  } else if (amount >= 1000000 && amount < 1000000000) {
    return `${(amount / 1000000).toFixed(2)}M`;
  } else if (amount >= 1000000000 && amount < 1000000000000) {
    return `${(amount / 1000000000).toFixed(2)}B`;
  } else {
    return `${(amount / 1000000000000).toFixed(2)}T`;
  }
};

export const amountToWords = (currency, amount) => {
  if (!currencyCodes[currency]) {
    throw new Error("Invalid currency code");
  }

  Number(amount);

  const currencyWordCap = currencyWord[currency];
  const currencyWordLow = currencyWord[currency].toLowerCase();
  const currencySubWordCap = currencySubWord[currency];
  const currencySubWordLow = currencySubWord[currency].toLowerCase();

  const units = ["", "Thousand", "Million", "Billion", "Trillion"];

  const convertLessThanThousand = (num) => {
    let current = num;
    let wordsArr = [];

    if (current % 100 < 20) {
      wordsArr.push(currencyWordCap + " " + currencySubWordCap + "s");
      current %= 100;
    } else {
      wordsArr.push(currencyWordCap + "s");
      current /= 100;
      current = Math.floor(current);
      current %= 10;
    }

    if (current) {
      wordsArr.unshift(units[current]);
    }

    return wordsArr.join(" ");
  };

  const convert = (num) => {
    let current = num;
    let wordsArr = [];

    for (let i = 0; current > 0; i++) {
      let chunk = current % 1000;
      if (chunk) {
        if (i === 0) {
          wordsArr.push(convertLessThanThousand(chunk));
        } else {
          wordsArr.unshift(convertLessThanThousand(chunk) + " " + units[i]);
        }
      }
      current = Math.floor(current / 1000);
    }

    return wordsArr.join(" ");
  };

  if (amount === 0) {
    return `Zero ${currencyWordCap}s`;
  }

  const integerPart = Math.floor(amount);
  const decimalPart = Math.round((amount - integerPart) * 100);

  const result = `${convert(integerPart)} ${currencyWordLow}s`;

  if (decimalPart > 0) {
    const subUnitWords = convertLessThanThousand(decimalPart);
    return `${result} and ${subUnitWords} ${currencySubWordLow}s`;
  }

  return result;
};

export const showNetworkToast = (message, type) => {
  return toast(message, {
    position: "bottom-left",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "dark",
    type: type || "default",
  });
};
