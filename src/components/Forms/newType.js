import React, { Component } from "react";
import TextInput from "../UI/Inputs/txtInput";
import { postRequest } from "../../utils/requests";
import FormMsg from "../UI/Misc/formMsg";
import SubmitButton from "../UI/Buttons/submitButton";

class NewTypeForm extends Component {
  state = {
    form: { name: "", slug: "" },
    msg: ""
  };

  handleSubmit = async event => {
    event.preventDefault();

    this.props.loadbar.progressTo(15);
    this.setState({ msg: "creating..." });

    const typename = this.state.form.name;
    const typeslug = this.state.form.slug;

    const req = await postRequest(
      "/api/panel/apps/" + this.props.session.state.selApp + "/types",
      { typename, typeslug }
    );

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
    form[event.target.name] = event.target.value;
    this.setState({ form });
  };

  render() {
    return (
      <form
        className={this.props.focus ? "focused" : ""}
        onSubmit={this.handleSubmit}
        autoComplete="off"
      >
        <h2>New Content Type</h2>
        <TextInput
          name="name"
          type="text"
          label="Type Name"
          value={this.state.form.name}
          onChange={this.handleChange}
        />
        <br />
        <TextInput
          name="slug"
          type="text"
          label="Type Slug"
          value={this.state.form.slug}
          onChange={this.handleChange}
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

export default NewTypeForm;
