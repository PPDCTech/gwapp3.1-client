export const shortenString = (str, maxLength) => {
	// Check if the string is undefined, null, or empty
	if (!str || str.trim() === "") {
		return "";
	}
	if (str.length <= maxLength) {
		return str;
	}
	return str.substring(0, maxLength - 3) + "...";
};
