import React, { Component } from "react";
import TextInput from "../UI/Inputs/txtInput";
import DropDownInput from "../UI/Inputs/dropInput";
import { postRequest } from "../../utils/requests";
import FormMsg from "../UI/Misc/formMsg";
import SubmitButton from "../UI/Buttons/submitButton";
import { generateSlug } from "../../utils/text";

class NewFieldForm extends Component {
  state = {
    form: { name: "", slug: "", fieldtype: "" },
    msg: "",
    changedSlug: false
  };

  handleSubmit = async event => {
    event.preventDefault();

    this.props.loadbar.progressTo(15);
    this.setState({ msg: "adding..." });

    const fieldname = this.state.form.name;
    const fieldslug = this.state.form.slug;
    const fieldtype = this.state.form.fieldtype;

    const req = await postRequest(
      "/api/panel/apps/" +
        this.props.session.state.selApp +
        "/types/" +
        this.props.page.state.modalData.slug +
        "/addfield",
      { fieldname, fieldslug, fieldtype }
    );

    if (req.error) {
      const msg = req.error;
      this.setState({ msg });
      this.props.loadbar.setToError(true);
    } else {
      this.setState({ msg: "", form: { name: "", slug: "", fieldtype: "" } });
      this.props.loadbar.progressTo(100);
      this.props.page.handleCloseModal();
      this.props.page.handleSetRefresh(true);
    }
  };

  handleChange = event => {
    let form = { ...this.state.form };
    if (event.target.name === "name" && !this.state.changedSlug) {
      form.slug = generateSlug(event.target.value, this.state.changedSlug);
      form.name = event.target.value;
    } else if (event.target.name === "slug") {
      this.setState({ changedSlug: true });
      form.slug = generateSlug(event.target.value, this.state.changedSlug);
    } else {
      form[event.target.name] = event.target.value;
    }
    this.setState({ form, msg: "" });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} autoComplete="off">
        <h2>New Field</h2>
        <TextInput
          name="name"
          type="text"
          label="Name"
          value={this.state.form.name}
          onChange={this.handleChange}
          required={true}
        />
        <br />
        <TextInput
          name="slug"
          type="text"
          label="Slug"
          value={this.state.form.slug}
          onChange={this.handleChange}
          required={true}
        />
        <br />
        <DropDownInput
          name="fieldtype"
          label="Type"
          onChange={this.handleChange}
          value={this.state.form.fieldtype}
          required={true}
        >
          <option value="text_short">Short Text</option>
          <option value="text_long">Long Text</option>
        </DropDownInput>
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

export default NewFieldForm;
