import React, { useState, useEffect, useRef } from "react";
import { patchRequest } from "../../../../utils/requests";
import FieldMsg from "./fieldMsg";
import ReactMarkdown from "react-markdown/with-html";

const LongTextField = props => {
  const [content, setContent] = useState(props.value);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [changeCount, setChangeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [view, setView] = useState("edit");
  const input = useRef(null);

  const charLimit = 50000;

  useEffect(() => {
    if (!isTyping && saved) {
      setMsg("Saved to draft");
    }
  }, [isTyping, saved]);

  const autoSave = async newVal => {
    const fieldcontentid = props.dataId;

    const req = await patchRequest(
      "/api/panel/apps/" +
        props.session.state.selApp +
        "/content/" +
        props.contentUuid,
      { [fieldcontentid]: newVal }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.disablePublish(true);
      props.drafting(false);
    } else {
      props.disablePublish(false);
      props.drafting(false);
      props.updateEditedTime(req.editedAt);
      if (props.name === "title") {
        props.updateTitle(newVal);
      }
      setSaved(true);
    }
  };

  const handleKeyPress = event => {
    if (event.keyCode === 9) {
      event.preventDefault();
      document.execCommand("insertText", false, "    ");
    }
  };

  const handleChange = event => {
    const newValue = event.target.value;
    setContent(newValue);
    setIsTyping(true);
    setSaved(false);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    setChangeCount(changeCount + 1);

    if (changeCount > 20) {
      setMsg("saving...");
      autoSave(newValue);
      setChangeCount(0);
    }

    if (newValue.length > charLimit) {
      setMsg(props.label + " too long!");
      props.disablePublish(true);
    } else {
      setMsg("saving...");
      props.disablePublish(false);
      props.drafting(true);
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

  const getViewLinkClasses = link => {
    if (link === view) {
      return "bluetext";
    } else {
      return "";
    }
  };

  const ContentCount = () => {
    const contentLength = content
      .replace(/# |- |[0-9]. /g, "")
      .trim()
      .split(/\s+/).length;

    return (
      <span
        className="softtext"
        style={{ fontSize: "9pt", marginRight: "15px" }}
      >
        <span title="Characters">
          {content.length} / {charLimit}
        </span>{" "}
        (
        <span title="Words">
          {/\S/.test(content) ? contentLength : contentLength - 1})
        </span>
      </span>
    );
  };

  const selectAssetCallback = (asset, caret) => {
    input.current.focus();
    input.current.selectionStart = input.current.selectionEnd = caret;
    const addedText = "![" + (asset.description || "") + "](" + asset.url + ")";
    document.execCommand("insertText", false, addedText);
    props.page.handleUpdatePersistentModalData({});
  };

  const selectAsset = event => {
    event.preventDefault();

    props.page.handleShowModal("selectassetform", undefined, {
      callback: selectAssetCallback,
      callbackData: input.current.selectionStart
    });
  };

  return (
    <div className="longtxtinp" style={{ marginBottom: "30px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <h4
          style={{ marginBottom: "5px" }}
          className={isFocused ? "bluetext" : ""}
        >
          {props.label}
        </h4>
        <i
          className="material-icons changeimage"
          title="Insert Asset"
          style={{
            fontSize: "27px",
            marginLeft: "auto",
            marginBottom: "-10px"
          }}
          onClick={e => selectAsset(e)}
        >
          add_photo_alternate
        </i>
      </div>
      {view === "edit" ? (
        <React.Fragment>
          <textarea
            name={props.name}
            value={content}
            onChange={handleChange}
            disabled={props.disabled}
            onKeyDown={handleKeyPress}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            ref={input}
          />
          <br />
          <ContentCount />
          <FieldMsg msg={msg} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <ReactMarkdown
            className="minimarkdownprev"
            source={content}
            escapeHtml={false}
          />
          <ContentCount />
        </React.Fragment>
      )}
      <span
        className="floatright viewchangelinks softtext"
        style={{ fontSize: "11pt" }}
      >
        <span
          className={getViewLinkClasses("edit")}
          onClick={() => setView("edit")}
        >
          Edit
        </span>{" "}
        |{" "}
        <span
          className={getViewLinkClasses("preview")}
          onClick={() => setView("preview")}
        >
          Preview
        </span>
      </span>
    </div>
  );
};

export default LongTextField;
