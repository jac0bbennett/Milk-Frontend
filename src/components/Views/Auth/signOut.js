import React, { useEffect } from "react";

const SignOut = props => {
  useEffect(() => {
    props.page.handlePageChange("Signing Out", "signOut");
    props.session.handleSignOut();
  }, [props.page, props.session]);

  return <h2>Signing Out...</h2>;
};

export default SignOut;
