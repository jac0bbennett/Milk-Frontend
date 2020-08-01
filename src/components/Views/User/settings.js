import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TextInput from "../../UI/Inputs/txtInput";
import { getRequest, patchRequest } from "../../../utils/requests";
import SubmitButton from "../../UI/Buttons/submitButton";

const UserSettings = props => {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [isLoaded, setIsLoaded] = useState("");
  const [settingsMsg, setSettingsMsg] = useState("");
  const [changePassMsg, setChangePassMsg] = useState("");
  const [email, setEmail] = useState("");

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
        setUsername(resp.data.user.username);
        setEmail(resp.data.user.email);
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
      case "username":
        setUsername(event.target.value);
        setSettingsMsg("");
        break;
      case "curPass":
        setCurPass(event.target.value);
        setChangePassMsg("");
        break;
      case "newPass":
        setNewPass(event.target.value);
        setChangePassMsg("");
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
      username: username
    });

    if (resp.error) {
      props.loadbar.setToError(true);
      setSettingsMsg(resp.error);
    } else {
      props.loadbar.progressTo(100);
      setSettingsMsg("");
    }
  };

  const handleChangePass = async event => {
    event.preventDefault();
    document.activeElement.blur();

    setChangePassMsg("updating...");

    const resp = await patchRequest("/api/panel/settings", {
      curPass: curPass,
      newPass: newPass
    });

    if (resp.error) {
      props.loadbar.setToError(true);
      setChangePassMsg(resp.error);
    } else {
      props.loadbar.progressTo(100);
      setChangePassMsg("Updated!");
      setCurPass("");
      setNewPass("");
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
              name="username"
              type="text"
              label="Username"
              value={username}
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
          <TextInput
            name="email"
            type="email"
            label="Email"
            autoComplete="email"
            value={email}
            disabled={true}
          />
          <hr />
          <h3>Change Password</h3>
          <form onSubmit={handleChangePass} autoComplete="off">
            <TextInput
              name="curPass"
              type="password"
              label="Current Password"
              autoComplete="current-password"
              value={curPass}
              onChange={handleChange}
              required={true}
            />
            <TextInput
              name="newPass"
              type="password"
              label="New Password"
              autoComplete="new-password"
              value={newPass}
              onChange={handleChange}
              required={true}
            />
            <br />
            <span className="floatright">
              <span>{changePassMsg}</span>
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
