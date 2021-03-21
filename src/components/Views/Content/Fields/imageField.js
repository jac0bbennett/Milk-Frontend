import React, { useState, useEffect, useCallback, useRef } from "react";
import TextInput from "../../../UI/Inputs/txtInput";
import { patchRequest } from "../../../../utils/requests";
import FieldMsg from "./fieldMsg";
import useSessionStore from "../../../../stores/useSessionStore";
import usePageStore from "../../../../stores/usePageStore";

const ImageField = props => {
  const [content, setContent] = useState(props.value);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [changeCount, setChangeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const selApp = useSessionStore(state => state.selApp);

  const input = useRef(null);

  const charLimit = 2000;

  const { drafting, disablePublish, updateEditedTime, updateTitle } = props;

  const autoSave = useCallback(
    async newVal => {
      const fieldcontentid = props.dataId;

      const req = await patchRequest(
        "/api/panel/apps/" + selApp + "/content/" + props.contentUuid,
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
      props.contentUuid,
      props.fieldOptions,
      drafting,
      disablePublish,
      updateEditedTime,
      updateTitle,
      selApp
    ]
  );

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

  const selectCallback = asset => {
    input.current.focus();
    document.execCommand("selectAll", false, null);
    document.execCommand("insertText", false, asset.url);
    usePageStore.getState().handleUpdatePersistentModalData({});
  };

  return (
    <div>
      <h4
        style={{ marginTop: "5px", marginBottom: "5px" }}
        className={isFocused ? "bluetext" : ""}
      >
        <span className="icolab">{props.label}</span>{" "}
        <i
          className={
            !props.disabled
              ? "material-icons changeimage"
              : "material-icons changeimage softtext"
          }
          style={{ fontSize: "27px" }}
          onClick={() => {
            if (!props.disabled) {
              usePageStore
                .getState()
                .handleShowModal("selectassetform", undefined, {
                  callback: selectCallback
                });
            }
          }}
        >
          add_photo_alternate
        </i>
      </h4>
      <div
        style={{
          marginBottom: "10px",
          marginTop: "10px",
          border: "1px solid gray",
          padding: "5px",
          borderRadius: "5px"
        }}
      >
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src={content}
            alt=""
            style={{ maxWidth: "100%", maxHeight: "300px", cursor: "pointer" }}
            onClick={() =>
              usePageStore
                .getState()
                .handleShowModal("selectassetform", undefined, {
                  callback: selectCallback
                })
            }
          />
        </div>
        {!content ? (
          <p className="softtext" style={{ fontSize: "11pt" }}>
            Select Image from Assets or Enter Image Url
          </p>
        ) : null}
        <TextInput
          dataId={props.dataId}
          name={props.slug}
          type="url"
          label="Image Url"
          value={content}
          onChange={handleChange}
          required={false}
          autoComplete="off"
          disabled={props.disabled}
          wide={true}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          setRef={input}
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
    </div>
  );
};

export default ImageField;
