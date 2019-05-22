import React, { useState, useEffect, useRef } from "react";
import { patchRequest } from "../../../../utils/requests";
import FieldMsg from "./fieldMsg";
import ReactMarkdown from "react-markdown";

const LongTextField = props => {
  const [content, setContent] = useState(props.value);
  const [isTyping, setIsTyping] = useState(false);
  const [editedTime, setEditedTime] = useState(0);
  const [typingTimeout, setTypingTimeout] = useState(0);
  const [changeCount, setChangeCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [msg, setMsg] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [view, setView] = useState("edit");
  const input = useRef(null);
  const [oldCaret, setOldCaret] = useState(0);
  const [tabKeyPress, setTabKeyPress] = useState(false);

  useEffect(() => {
    if (!isTyping && saved) {
      setMsg("Saved to draft");
      props.updateEditedTime(editedTime);
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
      props.drafting(false);
    } else {
      setEditedTime(req.editedAt);
      if (props.name === "title") {
        props.updateTitle(newVal);
      }
      setSaved(true);
    }
  };

  useEffect(() => {
    if (tabKeyPress) {
      input.current.selectionStart = input.current.selectionEnd = oldCaret + 1;
      setTabKeyPress(false);
    }
  });

  const handleKeyPress = event => {
    if (event.keyCode === 9) {
      event.preventDefault();
      const val = content;
      const start = event.target.selectionStart;
      const end = event.target.selectionEnd;
      const newContent = val.substring(0, start) + "\t" + val.substring(end);
      setContent(newContent);
      setOldCaret(start);
      setTabKeyPress(true);
      event.target.value = newContent;
      handleChange(event);
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

    if (newValue.length > 50000) {
      setMsg(props.label + " too long!");
    } else {
      setMsg("saving...");
      props.drafting(true);
      setTypingTimeout(
        setTimeout(function() {
          setIsTyping(false);
          autoSave(newValue);
          setChangeCount(0);
          props.drafting(false);
        }, 700)
      );
    }
  };

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeout);
    };
  }, []);

  useEffect(() => {
    if (props.contentStatus === "published") {
      setMsg("");
    }
  }, [props.contentStatus]);

  useEffect(() => {
    if (props.isDraftDiscarded) {
      setContent(props.value);
    }
  }, [props.isDraftDiscarded]);

  const getViewLinkClasses = link => {
    if (link === view) {
      return "bluetext";
    } else {
      return "";
    }
  };

  return (
    <div className="longtxtinp" style={{ marginBottom: "30px" }}>
      <h4
        style={{ marginBottom: "5px" }}
        className={isFocused ? "bluetext" : ""}
      >
        {props.label}
      </h4>
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
          <span
            className="softtext"
            style={{ fontSize: "11pt", marginRight: "15px" }}
          >
            {content.length} / 50000 (
            {/\S/.test(content) && !content.startsWith(" ")
              ? content.replace("# ", "").split(/\s+/).length
              : content.replace("# ", "").split(/\s+/).length - 1}
            )
          </span>
          <FieldMsg msg={msg} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <ReactMarkdown className="minimarkdownprev" source={content} />
          <span
            className="softtext"
            style={{ fontSize: "11pt", marginRight: "15px" }}
          >
            {content.length} / 50000 (
            {/\S/.test(content) && !content.startsWith(" ")
              ? content.replace("# ", "").split(/\s+/).length
              : content.replace("# ", "").split(/\s+/).length - 1}
            )
          </span>
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
