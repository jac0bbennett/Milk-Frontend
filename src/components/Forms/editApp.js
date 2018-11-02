import React, { Component } from "react";
import TextInput from "../UI/Inputs/txtInput";
import { patchRequest, deleteRequest } from "../../utils/requests";
import FormMsg from "../UI/Misc/formMsg";
import SubmitButton from "../UI/Buttons/submitButton";
import DeleteButton from "../UI/Buttons/deleteButton";

class EditAppForm extends Component {
  state = {
    form: { name: this.props.page.state.modalData.name },
    msg: ""
  };

  handleSubmit = async event => {
    event.preventDefault();

    this.props.loadbar.progressTo(15);
    this.setState({ msg: "submitting..." });

    const appname = this.state.form.name;

    const req = await patchRequest(
      "/api/panel/apps/" + this.props.page.state.modalData.uuid,
      { appname }
    );

    if (req.error) {
      const msg = req.error;
      this.setState({ msg });
      this.props.loadbar.setToError(true);
    } else {
      this.setState({ msg: "" });
      this.props.loadbar.progressTo(100);
      this.props.page.handleCloseModal();
      this.props.page.handleSetRefresh(true);
    }
  };

  handleDelete = async event => {
    this.props.loadbar.progressTo(15);
    this.setState({ msg: "deleting..." });

    const req = await deleteRequest(
      "/api/panel/apps/" + this.props.page.state.modalData.uuid
    );

    if (req.error) {
      const msg = req.error;
      this.setState({ msg });
      this.props.loadbar.setToError(true);
    } else {
      this.setState({ msg: "" });

      if (
        this.props.session.state.selApp == this.props.page.state.modalData.uuid
      ) {
        this.props.session.handleSession(undefined, "0");
      }

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
      <form onSubmit={this.handleSubmit} autoComplete="off">
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
        <DeleteButton onClick={this.handleDelete}>Delete</DeleteButton>
        <SubmitButton>Submit</SubmitButton>
        <br />
        <br />
        <FormMsg msg={this.state.msg} />
      </form>
    );
  }
}

export default EditAppForm;
