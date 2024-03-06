import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useAuthContext } from "src/contexts/auth-context";
import GwappLoading from "src/components/gwappload/GwappLoading";

export const AuthGuard = (props) => {
  const { children } = props;
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  
  // const ignore = useRef(false);
  // const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    // Prevent from calling twice in development mode with React.StrictMode enabled
    // if (ignore.current) {
    //   return;
    // }

    // ignore.current = true;

    if (!isAuthenticated) {
      console.log("Not authenticated, redirecting");
      router
        .replace({
          pathname: "/auth/login",
          query: router.asPath !== "/" ? { continueUrl: router.asPath } : undefined,
        })
        .catch(console.error);
    } 
    // else {
    //   setChecked(true);
    // }
  }, [isAuthenticated, router, router.isReady]);

  // if (!checked) {
  //   return <GwappLoading />;
  // }

  // return children;
  return isAuthenticated ? children : <GwappLoading />
};

AuthGuard.propTypes = {
  children: PropTypes.node,
};
