export const getGreeting = () => {
  const currentTime = new Date().getHours();

  if (currentTime >= 5 && currentTime < 12) {
    return "Good morning";
  } else if (currentTime >= 12 && currentTime < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
};
