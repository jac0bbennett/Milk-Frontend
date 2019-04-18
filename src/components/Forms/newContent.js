import React, { Component } from "react";
import DropDownInput from "../UI/Inputs/dropInput";
import { postRequest } from "../../utils/requests";
import FormMsg from "../UI/Misc/formMsg";
import SubmitButton from "../UI/Buttons/submitButton";

class NewContentForm extends Component {
  state = {
    form: { type: "" },
    msg: ""
  };

  handleSubmit = async event => {
    event.preventDefault();

    this.props.loadbar.progressTo(15);
    this.setState({ msg: "creating..." });

    const typeslug = this.state.form.type;

    const req = await postRequest(
      "/api/panel/apps/" + this.props.session.state.selApp + "/content",
      { typeslug }
    );

    if (req.error) {
      const msg = req.error;
      this.setState({ msg });
      this.props.loadbar.setToError(true);
    } else {
      this.setState({ msg: "", form: { type: "" } });
      this.props.loadbar.progressTo(100);
      this.props.page.handleCloseModal();
      this.props.page.handleSetRefresh(true);
    }
  };

  handleChange = event => {
    let form = { ...this.state.form };
    form[event.target.name] = event.target.value;
    this.setState({ form, msg: "" });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} autoComplete="off">
        <h2>New Content</h2>
        <DropDownInput
          name="type"
          label="Content Type"
          onChange={this.handleChange}
          value={this.state.form.type}
          required={true}
        >
          {this.props.page.state.modalData.types.length > 0
            ? this.props.page.state.modalData.types.map(type => (
                <option key={type.id} value={type.slug}>
                  {type.slug}
                </option>
              ))
            : null}
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

export default NewContentForm;
