import React, { useState, useEffect, useCallback } from "react";
import TextInput from "../../../UI/Inputs/txtInput";
import { patchRequest } from "../../../../utils/requests";
import FieldMsg from "./fieldMsg";
import ListFieldList from "./listFieldList";
import arrayMove from "array-move";
import useSessionStore from "../../../../stores/useSessionStore";

const ListField = props => {
  const [list, setList] = useState(props.value || []);
  const [content, setContent] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState("");

  const selApp = useSessionStore(state => state.selApp);

  const unallowedValue = useCallback(
    (allowedValues = props.fieldOptions.values) => {
      let allowedValuesMsg = "";
      for (let v = 0; v < allowedValues.length; v++) {
        if (v + 1 === allowedValues.length) {
          allowedValuesMsg = allowedValuesMsg + allowedValues[v];
        } else {
          allowedValuesMsg = allowedValuesMsg + allowedValues[v] + ", ";
        }
        setMsg("Allowed values: " + allowedValuesMsg);
      }
    },
    [props.fieldOptions.values]
  );

  useEffect(() => {
    for (let v = 0; v < list.length; v++) {
      if (
        props.fieldOptions.values &&
        !props.fieldOptions.values.includes(list[v])
      ) {
        unallowedValue();
        break;
      }
    }
  }, [list, props.fieldOptions.values, unallowedValue]);

  useEffect(() => {
    if (saved) {
      setMsg("Saved to draft");
    }
  }, [saved]);

  const updateDraft = async newValue => {
    const fieldcontentid = props.dataId;

    props.drafting(true);

    const req = await patchRequest(
      "/api/panel/apps/" + selApp + "/content/" + props.contentUuid,
      { [fieldcontentid]: newValue }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.drafting(false);
      props.disablePublish(true);
    } else {
      props.drafting(false);
      props.disablePublish(false);
      props.updateEditedTime(req.editedAt);
      setSaved(true);
    }
  };

  const handleSubmit = event => {
    event.preventDefault();

    setMsg("saving...");

    const newValue = content.replace(/\s+/g, " ").trim();

    const allowedValues = props.fieldOptions.values;

    if (
      allowedValues &&
      allowedValues.length > 0 &&
      !allowedValues.includes(newValue)
    ) {
      unallowedValue();
    } else {
      const newList = [...list, newValue];
      setList(newList);

      setContent("");
      setCharCount(0);

      updateDraft(newValue);
    }
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

    updateDraft(listCopy);
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
    if (props.contentStatus === "published" && saved) {
      setMsg("");
    }
  }, [props.contentStatus, saved]);

  useEffect(() => {
    if (props.isDraftDiscarded) {
      setContent("");
      setMsg("");
      setList(props.value);
    }
  }, [props.isDraftDiscarded, props.value]);

  return (
    <div>
      <h4 style={{ marginBottom: "5px" }}>{props.label}</h4>
      <div
        style={{
          marginTop: "10px",
          marginBottom: "10px",
          border: "1px solid gray",
          padding: "5px",
          borderRadius: "5px"
        }}
      >
        <form onSubmit={handleSubmit} autoComplete="off">
          <TextInput
            dataId={props.dataId}
            name={props.slug}
            type="list"
            list="validOptions"
            label="New Value"
            value={content}
            onChange={handleChange}
            required={false}
            autoComplete="off"
            disabled={props.disabled}
            wide={true}
          />
          {props.fieldOptions.values && props.fieldOptions.values.length > 0 ? (
            <datalist id="validOptions">
              {props.fieldOptions.values.map(v => (
                <option value={v} />
              ))}
            </datalist>
          ) : null}

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
    </div>
  );
};

export default ListField;
