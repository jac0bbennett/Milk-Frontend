import React, { Component } from "react";
import axios from "axios";
import TextInput from "./txtInput";
import FormMsg from "./formMsg";
import SubmitButton from "./submitButton";

class SignIn extends Component {
  state = { pseudo: "", key: "", msg: "" };

  handleSubmit = event => {
    event.preventDefault();

    this.props.setLoadBar("15%");

    const pseudo = this.state.pseudo;
    const key = this.state.key;

    axios
      .post(`http://localhost:5100/panel/signin`, { pseudo, key })
      .then(res => {
        if (res.data.errors) {
          const msg = res.data.errors;
          this.setState({ msg });
        } else {
          this.props.setLoadBar("101%");
          this.props.onSignIn();
          this.props.history.push("/");
        }
      });
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
