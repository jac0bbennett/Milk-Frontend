import React, { useEffect } from "react";
import usePageStore from "../../../stores/usePageStore";
import useSessionStore from "../../../stores/useSessionStore";

const SignOut = () => {
  useEffect(() => {
    usePageStore.getState().handlePageChange("Signing Out", "signOut");
    useSessionStore.getState().handleSignOut();
  }, []);

  return <h2>Signing Out...</h2>;
};

export default SignOut;
