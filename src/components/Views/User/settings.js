import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TextInput from "../../UI/Inputs/txtInput";
import { getRequest, patchRequest } from "../../../utils/requests";
import SubmitButton from "../../UI/Buttons/submitButton";

const UserSettings = props => {
  const [name, setName] = useState("");
  const [pseudo, setPseudo] = useState("");
  const [curKey, setCurKey] = useState("");
  const [newKey, setNewKey] = useState("");
  const [confirmKey, setConfirmKey] = useState("");
  const [isLoaded, setIsLoaded] = useState("");
  const [settingsMsg, setSettingsMsg] = useState("");
  const [changeKeyMsg, setChangeKeyMsg] = useState("");

  const [theme, setTheme] = useState(localStorage.getItem("theme"));

  useEffect(() => {
    props.page.handlePageChange("Settings", "settings");
    const req = async () => {
      const resp = await getRequest("/api/panel/settings");

      if (resp.error) {
        props.loadbar.setToError(true);
      } else {
        const userId = resp.meta.userId;
        const selApp = resp.meta.appUUID;
        setName(resp.data.user.name);
        setPseudo(resp.data.user.pseudonym);
        setIsLoaded(true);
        props.session.handleSession(userId, selApp);
        props.loadbar.progressTo(100);
      }
    };
    props.loadbar.progressTo(15);
    req();
  }, [props.page.state.refreshView, props.loadbar, props.session, props.page]);

  const handleChange = event => {
    switch (event.target.name) {
      case "name":
        setName(event.target.value);
        setSettingsMsg("");
        break;
      case "pseudo":
        setPseudo(event.target.value);
        setSettingsMsg("");
        break;
      case "curKey":
        setCurKey(event.target.value);
        setChangeKeyMsg("");
        break;
      case "newKey":
        setNewKey(event.target.value);
        setChangeKeyMsg("");
        break;
      case "confirmKey":
        setConfirmKey(event.target.value);
        setChangeKeyMsg("");
        break;
      default:
        break;
    }
  };

  const handleUpdateSettings = async event => {
    event.preventDefault();
    document.activeElement.blur();
    setSettingsMsg("saving...");

    const resp = await patchRequest("/api/panel/settings", {
      name: name,
      pseudo: pseudo
    });

    if (resp.error) {
      props.loadbar.setToError(true);
      setSettingsMsg(resp.error);
    } else {
      props.loadbar.progressTo(100);
      setSettingsMsg("");
    }
  };

  const handleChangeKey = async event => {
    event.preventDefault();
    document.activeElement.blur();

    setChangeKeyMsg("updating...");

    const resp = await patchRequest("/api/panel/settings", {
      curKey: curKey,
      newKey: newKey,
      confirmKey: confirmKey
    });

    if (resp.error) {
      props.loadbar.setToError(true);
      setChangeKeyMsg(resp.error);
    } else {
      props.loadbar.progressTo(100);
      setChangeKeyMsg("Updated!");
      setCurKey("");
      setNewKey("");
      setConfirmKey("");
    }
  };

  const handleThemeChange = value => {
    props.session.handleSetTheme(value);
    setTheme(value);
  };

  return (
    <React.Fragment>
      {isLoaded ? (
        <div className="gencontainer narrowcontainer">
          <Link
            to="/panel/signout"
            className="floatright"
            style={{ borderBottom: "none" }}
          >
            Sign out
          </Link>
          <h1>
            <i className="material-icons" style={{ fontSize: "24pt" }}>
              account_circle
            </i>
            <span className="icolab" style={{ fontSize: "18pt" }}>
              {" "}
              Settings
            </span>
          </h1>
          <form onSubmit={handleUpdateSettings} autoComplete="off">
            <TextInput
              name="name"
              type="text"
              label="Your Name"
              value={name}
              onChange={handleChange}
              required={true}
            />
            <TextInput
              name="pseudo"
              type="text"
              label="Pseudonym"
              value={pseudo}
              onChange={handleChange}
              required={true}
            />
            <span className="floatright">
              <span>{settingsMsg}</span>
              <SubmitButton>Save</SubmitButton>
            </span>
          </form>
          <br />
          <hr />
          <h3>Change Key</h3>
          <form onSubmit={handleChangeKey} autoComplete="off">
            <TextInput
              name="curKey"
              type="password"
              label="Current Key"
              autoComplete="current-password"
              value={curKey}
              onChange={handleChange}
              required={true}
            />
            <TextInput
              name="newKey"
              type="password"
              label="New Key"
              autoComplete="new-password"
              value={newKey}
              onChange={handleChange}
              required={true}
            />
            <TextInput
              name="confirmKey"
              type="password"
              label="Confirm New Key"
              autoComplete="new-password"
              value={confirmKey}
              onChange={handleChange}
              required={true}
            />
            <br />
            <span className="floatright">
              <span>{changeKeyMsg}</span>
              <SubmitButton>Change</SubmitButton>
            </span>
          </form>
          <br />
          <hr />
          <h3>Theme</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              fontSize: "12pt"
            }}
          >
            <div
              style={{ cursor: "pointer" }}
              onClick={() => handleThemeChange("light")}
            >
              <i className="material-icons">
                {theme === "light" || theme === null
                  ? "radio_button_checked"
                  : "radio_button_unchecked"}
              </i>
              <i className="icolab"> Light</i>
            </div>
            <div
              style={{ cursor: "pointer" }}
              onClick={() => handleThemeChange("dark")}
            >
              <i className="material-icons">
                {theme === "dark"
                  ? "radio_button_checked"
                  : "radio_button_unchecked"}
              </i>
              <i className="icolab"> Dark</i>
            </div>
          </div>
          <br />
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default UserSettings;
