import React, { Component } from "react";
import TextInput from "../UI/Inputs/txtInput";
import FormMsg from "../UI/Misc/formMsg";
import SubmitButton from "../UI/Buttons/submitButton";
import DeleteButton from "../UI/Buttons/deleteButton";

class EditFieldForm extends Component {
  state = {
    form: {
      name: this.props.page.state.modalData.field.name,
      slug: this.props.page.state.modalData.field.slug
    },
    msg: ""
  };

  handleSubmit = event => {
    this.setState({ msg: "saving..." });

    this.props.page.state.modalData.saveField(
      event,
      this.props.page.state.modalData.index,
      this.state.form.name,
      this.state.form.slug
    );
  };

  handleDelete = event => {
    this.setState({ msg: "deleting..." });
    this.props.page.state.modalData.deleteField(
      event,
      this.props.page.state.modalData.index
    );
  };

  handleChange = event => {
    let form = { ...this.state.form };
    const target = event.target.name;
    form[target] = event.target.value;
    this.setState({ form, msg: "" });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} autoComplete="off">
        <h2>Edit Field</h2>
        <TextInput
          name="name"
          type="text"
          label="Field Name"
          value={this.state.form.name}
          onChange={this.handleChange}
          required={true}
        />
        <br />
        <TextInput
          name="slug"
          type="text"
          label="Field Slug"
          value={this.state.form.slug}
          onChange={this.handleChange}
          required={true}
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

export default EditFieldForm;
