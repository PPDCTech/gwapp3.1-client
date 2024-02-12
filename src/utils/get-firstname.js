export const getFirstName = (fullName) => {
  if (fullName) {
    const parts = fullName.split(" ");
    return parts[0];
  }
};
