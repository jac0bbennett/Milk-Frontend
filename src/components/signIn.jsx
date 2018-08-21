import React, { Component } from "react";
import axios from "axios";
import TextInput from "./txtInput";
import FormMsg from "./formMsg";
import SubmitButton from "./submitButton";

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = { pseudo: "", key: "", msg: "" };
    props.setLoadBar(15);
    props.setPage("Sign In", "signIn");
  }

  componentDidMount = () => {
    this.props.setLoadBar(100);
  };

  handleSubmit = event => {
    event.preventDefault();

    this.props.setLoadBar(15);

    const pseudo = this.state.pseudo;
    const key = this.state.key;

    axios
      .post(`/api/panel/signin`, { pseudo, key })
      .then(res => {
        if (res.data.errors) {
          const msg = res.data.errors;
          this.setState({ msg });
          this.props.onError(true);
        } else {
          this.props.setLoadBar(100);
          this.props.onSignIn(res.data.signedIn);
        }
      })
      .catch(err => {
        const msg = "An error occurred!";
        this.setState({ msg });
        this.props.onError(true);
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
