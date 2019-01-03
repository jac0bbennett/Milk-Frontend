import React, { Component } from "react";
import TextInput from "../../UI/Inputs/txtInput";
import { getRequest, patchRequest } from "../../../utils/requests";
import { MiniHeader } from "../../UI/Misc/miniHeader";
import SubmitButton from "../../UI/Buttons/submitButton";
import FormMsg from "../../UI/Misc/formMsg";
import FAB from "../../UI/Buttons/fab";
import FieldList from "./fieldList";
import { arrayMove } from "react-sortable-hoc";

class EditContentType extends Component {
  constructor(props) {
    super(props);
    props.loadbar.progressTo(15);
    props.page.handlePageChange("", "type");
    props.session.handleSession(undefined, this.props.match.params.appuuid);
    this.state = { name: "", slug: "", fields: [], msg: "", isLoaded: false };
  }

  componentWillUpdate = () => {
    console.log(this.state);
    if (this.props.page.state.refreshView === true) {
      this.getType();
      this.props.page.handleSetRefresh(false);
    }
  };

  getType = async (
    uuid = this.props.session.state.selApp,
    typeslug = this.state.slug
  ) => {
    const resp = await getRequest(
      "/api/panel/apps/" + uuid + "/types/" + typeslug
    );
    if (resp.error) {
      this.props.loadbar.setToError(true);
    } else {
      const userId = resp.meta.userId;
      const name = resp.data.name;
      const slug = resp.data.slug;
      const fields = resp.data.fields;
      const selApp = resp.meta.appUUID;
      this.setState({ name, fields, slug, isLoaded: true });
      this.props.session.handleSession(userId, selApp);
      this.props.page.handlePageChange(name, "type");
      this.props.loadbar.progressTo(100);
    }
  };

  componentDidMount = () => {
    this.getType(
      this.props.match.params.appuuid,
      this.props.match.params.typeslug
    );
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleSubmit = async event => {
    event.preventDefault();

    this.props.loadbar.progressTo(15);
    this.setState({ msg: "saving..." });

    const typename = this.state.name;

    const req = await patchRequest(
      "/api/panel/apps/" +
        this.props.session.state.selApp +
        "/types/" +
        this.state.slug,
      { name: typename }
    );

    if (req.error) {
      const msg = req.error;
      this.setState({ msg });
      this.props.loadbar.setToError(true);
    } else {
      this.setState({ msg: "" });
      this.props.loadbar.progressTo(100);
      this.props.page.handleSetRefresh(true);
    }
  };

  onSortEnd = async ({ oldIndex, newIndex }) => {
    this.setState({
      fields: arrayMove(this.state.fields, oldIndex, newIndex)
    });

    const req = await patchRequest(
      "/api/panel/apps/" +
        this.props.session.state.selApp +
        "/types/" +
        this.state.slug,
      { fields: this.state.fields }
    );

    if (req.error) {
      alert("Fields could not be reordered!");
    }
  };

  render() {
    return (
      <React.Fragment>
        <FAB
          page={this.props.page}
          modalComp="newfieldform"
          modalData={{ slug: this.state.slug }}
        >
          <i className="material-icons">add</i>
        </FAB>
        <MiniHeader header={this.props.session.state.selAppName} />
        {this.state.isLoaded ? (
          <div className="gencontainer">
            <h2>Edit Type</h2>
            <form onSubmit={this.handleSubmit} autoComplete="off">
              <TextInput
                name="name"
                type="text"
                label="Name"
                value={this.state.name}
                onChange={this.handleChange}
                required={true}
              />
              <TextInput
                name="slug"
                type="text"
                label="Slug"
                value={this.state.slug}
                disabled={true}
              />
              <div style={{ float: "right" }}>
                <FormMsg msg={this.state.msg} />
                <SubmitButton>Save</SubmitButton>
              </div>
            </form>

            <br />
            <hr />
            <h3>Fields</h3>
            {this.state.fields.length > 0 ? (
              <FieldList
                fields={this.state.fields}
                onSortEnd={this.onSortEnd}
                useDragHandle={true}
                useWindowAsScrollContainer={true}
              />
            ) : (
              <center>
                <span className="softtext">No Fields</span>
              </center>
            )}
          </div>
        ) : (
          <br />
        )}
      </React.Fragment>
    );
  }
}

export default EditContentType;
