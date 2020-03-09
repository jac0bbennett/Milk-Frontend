import React, { useState, useEffect } from "react";
import TextInput from "../../../UI/Inputs/txtInput";
import { patchRequest } from "../../../../utils/requests";
import FieldMsg from "./fieldMsg";
import ListFieldList from "./listFieldList";
import arrayMove from "array-move";

const ListField = props => {
  const [list, setList] = useState(props.value || []);
  const [content, setContent] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (saved) {
      setMsg("Saved to draft");
    }
  }, [saved]);

  const updateDraft = async newList => {
    const fieldcontentid = props.dataId;

    props.drafting(true);

    const req = await patchRequest(
      "/api/panel/apps/" +
        props.session.state.selApp +
        "/content/" +
        props.contentUuid,
      { [fieldcontentid]: newList }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.drafting(false);
      props.disablePublish(true);
    } else {
      props.drafting(false);
      props.disablePublish(false);
      props.updateEditedTime(req.edited);
      setSaved(true);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();

    setMsg("saving...");

    const newValue = content.replace(/\s+/g, " ").trim();

    const newList = [...list, newValue];
    setList(newList);

    setContent("");
    setCharCount(0);

    updateDraft(newList);
  };

  const handleDeleteValue = index => {
    setMsg("saving...");
    setSaved(false);

    let listCopy = [...list];
    listCopy.splice(index, 1);

    setList(listCopy);

    updateDraft(listCopy);
  };

  const onDropdownSortEnd = async ({ oldIndex, newIndex }) => {
    let listCopy = [...list];
    const rearange = [...arrayMove(listCopy, oldIndex, newIndex)];
    listCopy = rearange;

    setList(listCopy);
  };

  const handleChange = event => {
    const newValue = event.target.value;
    setContent(newValue);
    setSaved(false);

    setCharCount(newValue.length);

    if (newValue.length > 80) {
      setMsg(props.label + " too long!");
    }
  };

  useEffect(() => {
    if (props.contentStatus === "published") {
      setMsg("");
    }
  }, [props.contentStatus]);

  useEffect(() => {
    if (props.isDraftDiscarded) {
      setContent("");
      setMsg("");
    }
  }, [props.isDraftDiscarded]);

  return (
    <div style={{ marginBottom: "10px" }}>
      <form onSubmit={handleSubmit} autoComplete="off">
        <TextInput
          dataId={props.dataId}
          name={props.slug}
          type="text"
          label={props.label}
          value={content}
          onChange={handleChange}
          required={false}
          autoComplete="off"
          disabled={props.disabled}
          wide={true}
        />

        <span
          title="Characters"
          className="softtext"
          style={{ fontSize: "9pt", marginRight: "15px" }}
        >
          {charCount} / 80
        </span>

        <FieldMsg msg={msg} />
      </form>
      {list && list.length > 0 ? (
        <ListFieldList
          values={list}
          page={props.page}
          fieldSlug={props.slug}
          deleteValue={handleDeleteValue}
          useDragHandle={true}
          onSortEnd={onDropdownSortEnd}
          axis={"xy"}
        />
      ) : (
        <div className="softtext">No values set</div>
      )}
    </div>
  );
};

export default ListField;
