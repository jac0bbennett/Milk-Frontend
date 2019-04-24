import React, { useEffect } from "react";

const SignOut = props => {
  useEffect(() => {
    props.page.handlePageChange("Signing Out", "signOut");
    props.onSignOut();
  }, []);

  return <h2>Signing Out...</h2>;
};

export default SignOut;
