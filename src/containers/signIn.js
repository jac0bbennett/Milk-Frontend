import React, { Component } from "react";
import axios from "axios";
import { postRequest } from "../utils/requests";
import TextInput from "../components/txtInput";
import FormMsg from "../components/formMsg";
import SubmitButton from "../components/submitButton";

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
      <form id="signin" onSubmit={this.handleSubmit}>
        <h1>Sign In</h1>
        <TextInput
          name="pseudo"
          onChange={e => this.handleChange(e)}
          type="text"
          label="Pseudonym"
        />
        <TextInput
          name="key"
          onChange={e => this.handleChange(e)}
          type="password"
          label="Key"
        />
        <br />
        <br />
        <FormMsg msg={this.state.msg} />
        <SubmitButton text="Sign In" />
        <br />
        <br />
      </form>
    );
  }
}

export default SignIn;
