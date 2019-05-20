import React, { useState, useEffect } from "react";
import TextInput from "../../UI/Inputs/txtInput";
import { getRequest, patchRequest } from "../../../utils/requests";
import { MiniHeader } from "../../UI/Misc/miniHeader";
import SubmitButton from "../../UI/Buttons/submitButton";
import DeleteButton from "../../UI/Buttons/deleteButton";
import FormMsg from "../../UI/Misc/formMsg";
import FAB from "../../UI/Buttons/fab";
import FieldList from "./fieldList";
import { arrayMove } from "react-sortable-hoc";
import history from "../../../utils/history";
import TimeAgoStamp from "../../UI/Misc/timeAgoStamp";

const EditContentType = props => {
  const [msg, setMsg] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [typeData, setTypeData] = useState({});

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
    typeslug = typeData.slug
  ) => {
    const resp = await getRequest(
      "/api/panel/apps/" + uuid + "/types/" + typeslug
    );
    if (resp.error) {
      props.loadbar.setToError(true);
    } else {
      const userId = resp.meta.userId;
      const selApp = resp.meta.appUUID;
      setTypeData(resp.data);
      setIsLoaded(true);
      props.session.handleSession(userId, selApp);
      props.page.handlePageChange(resp.data.name, "type");
      props.loadbar.progressTo(100);
    }
  };

  const handleChange = event => {
    let typeCopy = { ...typeData };
    const target = event.target.name;
    typeCopy[target] = event.target.value;
    setTypeData(typeCopy);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    props.loadbar.progressTo(15);
    setMsg("saving...");

    const typename = typeData.name;

    const req = await patchRequest(
      "/api/panel/apps/" +
        props.session.state.selApp +
        "/types/" +
        typeData.slug,
      { name: typename }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
    } else {
      setMsg("");
      props.loadbar.progressTo(100);
      props.page.handleSetRefresh(true);
    }
  };

  const deleteCallback = () => {
    history.push("/panel/apps/" + props.session.state.selApp + "/types");
  };

  const handleDelete = async event => {
    const url =
      "/api/panel/apps/" +
      props.session.state.selApp +
      "/types/" +
      typeData.slug;

    props.page.handleShowModal("confirmdeleteform", {
      deleteUrl: url,
      callback: deleteCallback,
      extraText: "This type cannot be resurrected!"
    });
  };

  const onSortEnd = async ({ oldIndex, newIndex }) => {
    let typeCopy = { ...typeData };
    const rearange = [...arrayMove(typeData.fields, oldIndex, newIndex)];
    typeCopy.fields = rearange;

    setTypeData(typeCopy);

    const newOrder = { ...rearange };

    const req = await patchRequest(
      "/api/panel/apps/" +
        props.session.state.selApp +
        "/types/" +
        typeData.slug +
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
        modalData={{ slug: typeData.slug }}
      >
        <i className="material-icons">add</i>
      </FAB>
      <MiniHeader header={props.session.state.selAppName} />
      {isLoaded ? (
        <div className="gencontainer">
          <TimeAgoStamp className="softtext floatright">
            {typeData.editedAt}
          </TimeAgoStamp>
          <h2>Edit Type</h2>
          <form onSubmit={handleSubmit} autoComplete="off">
            <TextInput
              name="name"
              type="text"
              label="Name"
              value={typeData.name}
              onChange={handleChange}
              required={true}
            />
            <TextInput
              name="slug"
              type="text"
              label="Slug"
              value={typeData.slug}
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
          {typeData.fields.length > 0 ? (
            <FieldList
              page={props.page}
              fields={typeData.fields}
              onSortEnd={onSortEnd}
              useDragHandle={true}
              useWindowAsScrollContainer={true}
              typeSlug={typeData.slug}
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
