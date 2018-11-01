import React, { Component } from "react";
import TextInput from "../UI/Inputs/txtInput";
import { patchRequest } from "../../utils/requests";
import FormMsg from "../UI/Misc/formMsg";
import SubmitButton from "../UI/Buttons/submitButton";

class EditAppForm extends Component {
  state = {
    form: { name: "test" },
    msg: ""
  };

  componentWillMount = () => {
    console.log(this.props);
  };

  handleSubmit = async event => {
    event.preventDefault();

    this.props.loadbar.progressTo(15);

    const appname = this.state.form.name;

    const req = await patchRequest(
      "/api/panel/apps/" + this.props.session.selApp,
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
    }
  };

  handleChange = event => {
    let form = { ...this.state.form };
    form.name = event.target.name;
    this.setState({ form: event.target.value });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <h2>Edit App</h2>
        <TextInput
          name="appname"
          type="text"
          label="App Name"
          onChange={e => this.handleChange(e)}
          value={this.props.page.state.modalData.name}
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
