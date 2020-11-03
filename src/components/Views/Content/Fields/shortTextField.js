import React, { useState, useEffect, useCallback } from "react";
import TextInput from "../../../UI/Inputs/txtInput";
import { patchRequest } from "../../../../utils/requests";
import FieldMsg from "./fieldMsg";

const ShortTextField = props => {
  const [content, setContent] = useState(props.value);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [changeCount, setChangeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState("");

  const charLimit = 500;

  const genSlug = title => {
    const maxLength = 75;

    const slug = title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9_ ]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    if (slug.length > maxLength) {
      const truncSlug = slug.substr(0, maxLength);

      return truncSlug.substr(0, truncSlug.lastIndexOf("-"));
    } else {
      return slug;
    }
  };

  const checkSlugChanged = () => {
    if (props.fieldOptions && props.fieldOptions.autoSlug) {
      if (genSlug(props.pageTitle) === props.value) {
        return false;
      } else if (!props.value && props.contentStatus === "draft") {
        return false;
      } else if (!props.value && props.contentStatus !== "draft") {
        return true;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };
  const [slugChanged, setSlugChanged] = useState(checkSlugChanged());

  const { drafting, disablePublish, updateEditedTime, updateTitle } = props;

  const autoSave = useCallback(
    async newVal => {
      const fieldcontentid = props.dataId;

      const req = await patchRequest(
        "/api/panel/apps/" +
          props.session.state.selApp +
          "/content/" +
          props.contentUuid,
        { [fieldcontentid]: newVal }
      );

      if (req.error) {
        const reqMsg = !req.otherField
          ? req.error
          : req.error + " | Conflicting: " + req.otherField;
        setMsg(reqMsg);
        drafting(false);
        disablePublish(true);
      } else {
        drafting(false);
        disablePublish(false);
        updateEditedTime(req.editedAt);
        if (props.fieldOptions && props.fieldOptions.title) {
          updateTitle(newVal);
        }
        setSaved(true);
      }
    },
    [
      props.dataId,
      props.session.state.selApp,
      props.contentUuid,
      props.fieldOptions,
      drafting,
      disablePublish,
      updateEditedTime,
      updateTitle
    ]
  );

  useEffect(() => {
    if (!slugChanged) {
      const newSlug = genSlug(props.pageTitle);
      if (
        newSlug !== content ||
        (!content &&
          props.pageTitle &&
          !props.pageTitle.match(/[^a-zA-Z0-9_ ]/g))
      ) {
        setSaved(false);
        setMsg("saving...");
        setContent(newSlug);
        autoSave(newSlug);
      }
    }
  }, [props.fieldOptions, props.pageTitle, slugChanged, content, autoSave]);

  useEffect(() => {
    if (!isTyping && saved) {
      setMsg("Saved to draft");
    }
  }, [isTyping, saved]);

  const handleChange = event => {
    const newValue = event.target.value;
    setContent(newValue);
    setIsTyping(true);
    setSaved(false);
    setSlugChanged(true);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setChangeCount(changeCount + 1);

    if (changeCount > 10) {
      setMsg("saving...");
      autoSave(newValue);
      setChangeCount(0);
    }

    if (newValue.length > charLimit) {
      setMsg(props.label + " too long!");
      disablePublish(true);
    } else {
      setMsg("saving...");
      disablePublish(false);
      drafting(true);
      setTypingTimeout(
        setTimeout(function () {
          setIsTyping(false);
          autoSave(newValue);
          setChangeCount(0);
        }, 700)
      );
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeout);
    };
  }, [typingTimeout]);

  useEffect(() => {
    if (props.contentStatus === "published") {
      setMsg("");
    }
  }, [props.contentStatus]);

  useEffect(() => {
    if (props.isDraftDiscarded) {
      setContent(props.value);
      setMsg("");
    }
  }, [props.isDraftDiscarded, props.value]);

  return (
    <div style={{ marginBottom: "10px" }}>
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
        {content.length} / {charLimit}
      </span>
      <FieldMsg msg={msg} />
    </div>
  );
};

export default ShortTextField;
