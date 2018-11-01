import React, { Component } from "react";
import { postRequest } from "../../../utils/requests";
import SignInForm from "../../Forms/signIn.js";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = { pseudo: "", key: "", msg: "" };
    props.loadbar.progressTo(15);
    props.page.handlePageChange("Sign In", "signIn");
  }

  componentDidMount = () => {
    this.props.loadbar.progressTo(100);
  };

  handleSubmit = async event => {
    event.preventDefault();

    this.props.loadbar.progressTo(15);

    const pseudo = this.state.pseudo;
    const key = this.state.key;

    const req = await postRequest("/api/panel/signin", { pseudo, key });

    if (req.error) {
      const msg = req.error;
      this.setState({ msg });
      this.props.loadbar.setToError(true);
    } else {
      this.props.loadbar.progressTo(100);
      this.props.session.handleSignIn(req.userId);
    }
  };

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  render() {
    return (
      <SignInForm
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        msg={this.state.msg}
      />
    );
  }
}

export default SignIn;
