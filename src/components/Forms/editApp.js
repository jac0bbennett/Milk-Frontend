import React, { Component } from "react";
import TextInput from "../UI/Inputs/txtInput";
import { patchRequest } from "../../utils/requests";
import FormMsg from "../UI/Misc/formMsg";
import SubmitButton from "../UI/Buttons/submitButton";

class EditAppForm extends Component {
  state = {
    form: { name: this.props.page.state.modalData.name },
    msg: ""
  };

  handleSubmit = async event => {
    event.preventDefault();

    this.props.loadbar.progressTo(15);

    const appname = this.state.form.name;

    const req = await patchRequest(
      "/api/panel/apps/" + this.props.page.state.modalData.uuid,
      { appname }
    );

    if (req.error) {
      const msg = req.error;
      let form = { ...this.state.form };
      form.msg = msg;
      this.setState({ form });
      this.props.loadbar.setToError(true);
    } else {
      this.props.loadbar.progressTo(100);
      this.props.page.handleCloseModal();
      this.props.page.handleSetRefresh(true);
    }
  };

  handleChange = event => {
    let form = { ...this.state.form };
    form.name = event.target.value;
    this.setState({ form });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Edit App</h2>
        <TextInput
          name="name"
          type="text"
          label="App Name"
          value={this.state.form.name}
          onChange={this.handleChange}
        />
        <br />
        <br />
        <FormMsg msg={this.state.msg} />
        <SubmitButton text="Submit" />
        <br />
        <br />
      </form>
    );
  }
}

export default EditAppForm;
