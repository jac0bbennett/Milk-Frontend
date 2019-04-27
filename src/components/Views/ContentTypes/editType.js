import React, { useState, useEffect } from "react";
import TextInput from "../../UI/Inputs/txtInput";
import {
  getRequest,
  patchRequest,
  deleteRequest
} from "../../../utils/requests";
import { MiniHeader } from "../../UI/Misc/miniHeader";
import SubmitButton from "../../UI/Buttons/submitButton";
import DeleteButton from "../../UI/Buttons/deleteButton";
import FormMsg from "../../UI/Misc/formMsg";
import FAB from "../../UI/Buttons/fab";
import FieldList from "./fieldList";
import { arrayMove } from "react-sortable-hoc";
import history from "../../../utils/history";

const EditContentType = props => {
  const [form, setForm] = useState({ name: "", slug: "" });
  const [fields, setFields] = useState([]);
  const [msg, setMsg] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    props.loadbar.progressTo(15);
    props.page.handlePageChange("", "type");
    props.session.handleSession(undefined, props.match.params.appuuid);

    getType(props.match.params.appuuid, props.match.params.typeslug);
  }, []);

  useEffect(() => {
    if (props.page.state.refreshView === true) {
      getType();
      props.page.handleSetRefresh(false);
    }
  }, [props.page.state.refreshView]);

  const getType = async (
    uuid = props.session.state.selApp,
    typeslug = form.slug
  ) => {
    const resp = await getRequest(
      "/api/panel/apps/" + uuid + "/types/" + typeslug
    );
    if (resp.error) {
      props.loadbar.setToError(true);
    } else {
      const userId = resp.meta.userId;
      const respName = resp.data.name;
      const respSlug = resp.data.slug;
      const respFields = resp.data.fields;
      const selApp = resp.meta.appUUID;
      setForm({ name: respName, slug: respSlug });
      setFields(respFields);
      setIsLoaded(true);
      props.session.handleSession(userId, selApp);
      props.page.handlePageChange(respName, "type");
      props.loadbar.progressTo(100);
    }
  };

  const handleChange = event => {
    let formCopy = { ...form };
    const target = event.target.name;
    formCopy[target] = event.target.value;
    setForm(formCopy);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    props.loadbar.progressTo(15);
    setMsg("saving...");

    const typename = form.name;

    const req = await patchRequest(
      "/api/panel/apps/" + props.session.state.selApp + "/types/" + form.slug,
      { name: typename, fields: fields }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
    } else {
      setMsg("");
      props.loadbar.progressTo(100);
      props.page.handleSetRefresh(true);
      props.page.handleCloseModal();
    }
  };

  const handleDelete = async event => {
    props.loadbar.progressTo(15);
    setMsg("deleting...");

    const req = await deleteRequest(
      "/api/panel/apps/" + props.session.state.selApp + "/types/" + form.slug
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
    } else {
      setMsg("");
      props.loadbar.progressTo(100);
      history.push("/panel/apps/" + props.session.state.selApp + "/types");
    }
  };

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    const rearange = [...arrayMove(fields, oldIndex, newIndex)];

    setFields(rearange);

    const newOrder = { ...rearange };

    const req = await patchRequest(
      "/api/panel/apps/" +
        props.session.state.selApp +
        "/types/" +
        form.slug +
        "/reorderfields",
      { newOrder: newOrder }
    );

    if (req.error) {
      alert("Fields could not be reordered!");
    }
  };

  return (
    <React.Fragment>
      <FAB
        page={props.page}
        modalComp="newfieldform"
        modalData={{ slug: form.slug }}
      >
        <i className="material-icons">add</i>
      </FAB>
      <MiniHeader header={props.session.state.selAppName} />
      {isLoaded ? (
        <div className="gencontainer">
          <h2>Edit Type</h2>
          <form onSubmit={handleSubmit} autoComplete="off">
            <TextInput
              name="name"
              type="text"
              label="Name"
              value={form.name}
              onChange={handleChange}
              required={true}
            />
            <TextInput
              name="slug"
              type="text"
              label="Slug"
              value={form.slug}
              disabled={true}
            />
            <div style={{ float: "right" }}>
              <FormMsg msg={msg} />
              <SubmitButton>Save</SubmitButton>
            </div>
          </form>

          <br />
          <hr />
          <h3>Fields</h3>
          {fields.length > 0 ? (
            <FieldList
              page={props.page}
              fields={fields}
              onSortEnd={onSortEnd}
              useDragHandle={true}
              useWindowAsScrollContainer={true}
              typeSlug={form.slug}
            />
          ) : (
            <center>
              <span className="softtext">No Fields</span>
            </center>
          )}
          <DeleteButton style={{ float: "right" }} onClick={handleDelete}>
            Delete
          </DeleteButton>
          <br />
          <br />
        </div>
      ) : (
        <br />
      )}
    </React.Fragment>
  );
};

export default EditContentType;
