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

  const handleThemeChange = event => {
    props.session.handleSetTheme(event.target.value);
    setTheme(event.target.value);
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
          <h1>Settings</h1>
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
              value={curKey}
              onChange={handleChange}
              required={true}
            />
            <TextInput
              name="newKey"
              type="password"
              label="New Key"
              value={newKey}
              onChange={handleChange}
              required={true}
            />
            <TextInput
              name="confirmKey"
              type="password"
              label="Confirm New Key"
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

          <input
            id="theme_light"
            name="theme_light"
            type="radio"
            value="light"
            checked={theme === "light" || theme === "null"}
            onChange={handleThemeChange}
          />
          <label htmlFor="theme_light">
            <i> Light</i>
          </label>
          <br />

          <input
            id="theme_dark"
            name="theme_dark"
            type="radio"
            value="dark"
            checked={theme === "dark"}
            onChange={handleThemeChange}
          />
          <label htmlFor="theme_dark">
            <i> Dark</i>
          </label>
          <br />
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default UserSettings;
