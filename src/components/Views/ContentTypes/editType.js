import React, { useState, useEffect } from "react";
import TextInput from "../../UI/Inputs/txtInput";
import { patchRequest, statuses } from "../../../utils/requests";
import SubmitButton from "../../UI/Buttons/submitButton";
import FormMsg from "../../UI/Misc/formMsg";
import FAB from "../../UI/Buttons/fab";
import FieldList from "./fieldList";
import history from "../../../utils/history";
import DropMenu from "../../UI/Misc/dropMenu";
import Moment from "react-moment";
import arrayMove from "array-move";
import usePageStore from "../../../stores/usePageStore";
import useLoadbarStore from "../../../stores/useLoadbarStore";
import useViewApiCall from "../../../utils/useViewApiCall";

const EditContentType = props => {
  const [msg, setMsg] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [typeData, setTypeData] = useState({});
  const [saving, setSaving] = useState(false);

  const [respData, respStatus] = useViewApiCall(
    "/api/panel/apps/" +
      props.match.params.appuuid +
      "/types/" +
      props.match.params.typeslug
  );

  useEffect(() => {
    usePageStore.getState().handlePageChange("", "type");
    if (respStatus === statuses.SUCCESS) {
      setTypeData(respData);
      setIsLoaded(true);
      usePageStore.getState().handlePageChange(respData.name, "type");
    }
  }, [props.match.params.appuuid, respData, respStatus]);

  const handleChange = event => {
    setMsg("");
    let typeCopy = { ...typeData };
    const target = event.target.name;
    typeCopy[target] = event.target.value;
    setTypeData(typeCopy);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    useLoadbarStore.getState().progressTo(15);
    setSaving(true);

    const typename = typeData.name;

    const req = await patchRequest(
      "/api/panel/apps/" +
        props.match.params.appuuid +
        "/types/" +
        typeData.slug,
      { name: typename }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      useLoadbarStore.getState().setToError(true);
    } else {
      setMsg("Saved!");
      useLoadbarStore.getState().progressTo(100);
      usePageStore.getState().handleSetRefresh();
    }
    setSaving(false);
  };

  const deleteCallback = () => {
    history.push("/panel/apps/" + props.match.params.appuuid + "/types");
  };

  const handleDelete = async () => {
    const url =
      "/api/panel/apps/" +
      props.match.params.appuuid +
      "/types/" +
      typeData.slug;

    usePageStore.getState().handleShowModal("confirmdeleteform", {
      deleteUrl: url,
      callback: deleteCallback,
      extraText: "This type cannot be resurrected!",
      noRefresh: true
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
        props.match.params.appuuid +
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
      <FAB modalComp="newfieldform" modalData={{ slug: typeData.slug }}>
        <i className="material-icons">add</i>
      </FAB>
      {isLoaded ? (
        <div className="gencontainer">
          <span
            className="softtext floatright"
            title={new Date(typeData.editedAt)}
          >
            <Moment fromNow>{typeData.editedAt}</Moment>
          </span>
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
            <div
              style={{ display: "flex", alignItems: "center", float: "right" }}
            >
              <FormMsg msg={msg} />
              <SubmitButton disabled={saving ? true : false}>
                {!saving ? "Save" : "Saving..."}
              </SubmitButton>
              <DropMenu>
                <li onClick={handleDelete} className="redtext">
                  Delete
                </li>
              </DropMenu>
            </div>
          </form>

          <br />
          <hr />
          <h3>Fields</h3>
          {typeData.fields.length > 0 ? (
            <FieldList
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
        </div>
      ) : (
        <br />
      )}
    </React.Fragment>
  );
};

export default EditContentType;
