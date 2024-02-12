import * as React from "react";
import { showNetworkToast } from "src/services/helpers";

const getOnLineStatus = () =>
  typeof navigator !== "undefined" && typeof navigator.onLine === "boolean"
    ? navigator.onLine
    : true;

const useNavigatorOnLine = () => {
  const [status, setStatus] = React.useState(getOnLineStatus());

  const setOnline = () => setStatus(true);
  const setOffline = () => setStatus(false);

  React.useEffect(() => {
    window.addEventListener("online", setOnline);
    window.addEventListener("offline", setOffline);

    return () => {
      window.removeEventListener("online", setOnline);
      window.removeEventListener("offline", setOffline);
    };
  }, []);

  return status;
};

export const NetworkStatusIndicator = () => {
  const isOnline = useNavigatorOnLine();

  React.useEffect(() => {
    isOnline
      ? showNetworkToast("Back online!", "success")
      : showNetworkToast("Poor network detected", "warning");
  }, [isOnline]);

  return null;
};
