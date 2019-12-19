import React, { useState, useEffect, useRef } from "react";
import { patchRequest } from "../../../../utils/requests";
import FieldMsg from "./fieldMsg";
import ReactMarkdown from "react-markdown";

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
  const [oldCaret, setOldCaret] = useState(0);
  const [tabKeyPress, setTabKeyPress] = useState(false);

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
      props.updateEditedTime(req.edited);
      if (props.name === "title") {
        props.updateTitle(newVal);
      }
      setSaved(true);
    }
  };

  useEffect(() => {
    if (tabKeyPress === true) {
      input.current.selectionStart = input.current.selectionEnd = oldCaret + 4;
      setTabKeyPress(false);
    }
  }, [tabKeyPress, oldCaret]);

  const handleKeyPress = event => {
    if (event.keyCode === 9) {
      event.preventDefault();
      const val = content;
      const start = event.target.selectionStart;
      const end = event.target.selectionEnd;
      const newContent = val.substring(0, start) + "    " + val.substring(end);
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
        <span title="Characters">{content.length} / 50000</span> (
        <span title="Words">
          {/\S/.test(content) ? contentLength : contentLength - 1})
        </span>
      </span>
    );
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
          <ContentCount />
          <FieldMsg msg={msg} />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <ReactMarkdown className="minimarkdownprev" source={content} />
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
