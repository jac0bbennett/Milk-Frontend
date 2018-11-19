import React, { Component } from "react";
import TextInput from "../UI/Inputs/txtInput";
import { postRequest } from "../../utils/requests";
import FormMsg from "../UI/Misc/formMsg";
import SubmitButton from "../UI/Buttons/submitButton";

class NewAppForm extends Component {
  state = {
    form: { name: "" },
    msg: ""
  };

  handleSubmit = async event => {
    event.preventDefault();

    this.props.loadbar.progressTo(15);
    this.setState({ msg: "creating..." });

    const appname = this.state.form.name;

    const req = await postRequest("/api/panel/apps", { appname });

    if (req.error) {
      const msg = req.error;
      this.setState({ msg });
      this.props.loadbar.setToError(true);
    } else {
      this.setState({ msg: "", form: { name: "" } });
      this.props.loadbar.progressTo(100);
      this.props.page.handleCloseModal();
      this.props.page.handleSetRefresh(true);
    }
  };

  handleChange = event => {
    let form = { ...this.state.form };
    form.name = event.target.value;
    this.setState({ form, msg: "" });
  };

  render() {
    return (
      <form
        className={this.props.focus ? "focused" : ""}
        onSubmit={this.handleSubmit}
        autoComplete="off"
      >
        <h2>New App</h2>
        <TextInput
          name="name"
          type="text"
          label="App Name"
          value={this.state.form.name}
          onChange={this.handleChange}
          required={true}
        />
        <br />
        <br />
        <FormMsg msg={this.state.msg} />
        <SubmitButton>Submit</SubmitButton>
        <br />
        <br />
      </form>
    );
  }
}

export default NewAppForm;
