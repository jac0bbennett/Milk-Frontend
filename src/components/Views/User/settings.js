import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TextInput from "../../UI/Inputs/txtInput";
import {
  getRequest,
  patchRequest,
  postRequest,
  statuses
} from "../../../utils/requests";
import SubmitButton from "../../UI/Buttons/submitButton";
import { loadStripe } from "@stripe/stripe-js";
import FormMsg from "../../UI/Misc/formMsg";
import Moment from "react-moment";
import usePageStore from "../../../stores/usePageStore";
import useLoadbarStore from "../../../stores/useLoadbarStore";
import useViewApiCall from "../../../utils/useViewApiCall";
import useSessionStore from "../../../stores/useSessionStore";

const stripeKey =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "pk_test_svt9kHnnF0BPyTyburB41jGk00tgA3voSN"
    : "pk_live_WqmVyyZjnO3RZX6a3iTlude000XLBPPaDG";

const priceId =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "price_1HibwaEYCBWGMzyna9DIoUh6"
    : "price_1I9ga1EYCBWGMzyn2ZYV8A64";

const UserSettings = props => {
  const [name, setName] = useState("");
  const [curPass, setCurPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [isLoaded, setIsLoaded] = useState("");
  const [settingsMsg, setSettingsMsg] = useState("");
  const [changePassMsg, setChangePassMsg] = useState("");
  const [email, setEmail] = useState("");
  const [savingInfo, setSavingInfo] = useState(false);
  const [updatingPass, setUpdatingPass] = useState(false);
  const [sub, setSub] = useState({});
  const [subMsg, setSubMsg] = useState("");
  const [subbing, setSubbing] = useState(false);

  const [theme, setTheme] = useState(localStorage.getItem("theme"));

  const [respData, respStatus] = useViewApiCall("/api/panel/account");

  useEffect(() => {
    usePageStore.getState().handlePageChange("Account", "account");
    if (respStatus === statuses.SUCCESS) {
      setName(respData.user.name);
      setEmail(respData.user.email);
      setSub(respData.user.subscription);
      setIsLoaded(true);
    }
  }, [respData, respStatus]);

  const handleChange = event => {
    const newValue = event.target.value;
    switch (event.target.name) {
      case "name":
        setName(newValue);
        setSettingsMsg("");
        break;
      case "curPass":
        setCurPass(newValue);
        setChangePassMsg("");
        break;
      case "newPass":
        setNewPass(newValue);
        setChangePassMsg("");
        break;
      default:
        break;
    }
  };

  const handleUpdateSettings = async event => {
    event.preventDefault();
    document.activeElement.blur();
    setSavingInfo(true);
    setSettingsMsg("");

    const resp = await patchRequest("/api/panel/account", {
      name: name
    });

    if (resp.error) {
      useLoadbarStore.getState().setToError(true);
      setSettingsMsg(resp.error);
    } else {
      useLoadbarStore.getState().progressTo(100);
      setSettingsMsg("Saved!");
    }

    setSavingInfo(false);
  };

  const handleChangePass = async event => {
    event.preventDefault();
    document.activeElement.blur();
    setUpdatingPass(true);
    setChangePassMsg("");

    const resp = await patchRequest("/api/panel/account", {
      curPass: curPass,
      newPass: newPass
    });

    if (resp.error) {
      useLoadbarStore.getState().setToError(true);
      setChangePassMsg(resp.error);
    } else {
      useLoadbarStore.getState().progressTo(100);
      setChangePassMsg("Updated!");
      setCurPass("");
      setNewPass("");
    }

    setUpdatingPass(false);
  };

  const handleThemeChange = value => {
    useSessionStore.getState().handleSetTheme(value);
    setTheme(value);
  };

  const handleCreateSubscription = async event => {
    event.preventDefault();

    setSubbing(true);
    setSubMsg("");

    const stripe = await loadStripe(stripeKey);

    const resp = await postRequest("/api/billing/new-checkout-session", {
      priceId: priceId
    });

    if (resp.error) {
      useLoadbarStore.getState().setToError(true);
      setSubbing(false);
      setSubMsg(resp.error);
    } else {
      stripe.redirectToCheckout({ sessionId: resp.sessionId });
    }
  };

  const handleUpdateSubscription = async event => {
    event.preventDefault();

    setSubbing(true);
    setSubMsg("");

    const resp = await getRequest("/api/billing/new-customer-portal");

    if (resp.error) {
      useLoadbarStore.getState().setToError(true);
      setSubMsg(resp.error);
      setSubbing(false);
    } else {
      window.location.href = resp.url;
    }
  };

  const subscriptionOptions = () => {
    switch (sub.status) {
      case "free":
      case "canceled":
        return (
          <React.Fragment>
            <div className="softtext">
              <p>You are currently on Free Plan.</p>
              <p>
                Upgrade to increase your{" "}
                <a href="/#pricing">limits and functionality</a>.
              </p>
            </div>
            <br />
            <button
              className="raisedbut"
              onClick={handleCreateSubscription}
              disabled={!subbing ? false : true}
            >
              {!subbing ? "Upgrade ($20)" : "Redirecting..."}
            </button>
          </React.Fragment>
        );
      case "active":
      case "past_due":
        return (
          <React.Fragment>
            <div className="softtext">
              {sub.status === "past_due" ? (
                <p className="redtext">
                  Your latest subscription payment is past due and at risk of
                  being canceled! Please verify your payment method.
                </p>
              ) : null}
              <p>
                You are currently subscribed to the{" "}
                <span className="greentext semibold">Premium Plan</span>
              </p>
              <p>
                Renewing:{" "}
                <span className="semibold">
                  {sub.renew ? "Yes" : <span className="redtext">No</span>}
                </span>
              </p>
              <p>
                Monthly Cost: <span className="semibold">$20</span>
              </p>
              <p>
                End of billing period:{" "}
                <span className="semibold">
                  <Moment format="MMM, Do, YYYY" unix>
                    {new Date(sub.end)}
                  </Moment>
                </span>
              </p>
            </div>
            <br />
            <button
              className="raisedbut"
              onClick={handleUpdateSubscription}
              disabled={!subbing ? false : true}
            >
              {!subbing ? "Update Subscription" : "Redirecting..."}
            </button>
          </React.Fragment>
        );
      case "unlimited":
        return <div className="softtext">You have an unlimited plan!</div>;
      default:
        return (
          <div className="softtext">Your subscription couldn't be loaded</div>
        );
    }
  };

  return (
    <React.Fragment>
      {isLoaded ? (
        <div className="gencontainer">
          <h1>
            <i className="material-icons" style={{ fontSize: "24pt" }}>
              account_circle
            </i>
            <span className="icolab" style={{ fontSize: "18pt" }}>
              {" "}
              Account
            </span>
            <Link
              to="/panel/signout"
              style={{
                borderBottom: "none",
                textTransform: "uppercase",
                fontWeight: "500",
                fontSize: "16px",
                marginLeft: "20px"
              }}
            >
              Sign out
            </Link>
          </h1>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <div className="settingsection">
              <form onSubmit={handleUpdateSettings} autoComplete="off">
                <h3>Basic Info</h3>
                <TextInput
                  name="name"
                  type="text"
                  label="Your Name"
                  value={name}
                  onChange={handleChange}
                  required={true}
                />
                <TextInput
                  name="email"
                  type="email"
                  label="Email"
                  autoComplete="email"
                  value={email}
                  disabled={true}
                />
                <br />
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center"
                  }}
                >
                  <FormMsg msg={settingsMsg} />
                  <SubmitButton disabled={!savingInfo ? false : true}>
                    {!savingInfo ? "Save" : "Saving..."}
                  </SubmitButton>
                </div>
              </form>
            </div>
            <div className="settingsection">
              <h3>Update Password</h3>
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
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center"
                  }}
                >
                  <FormMsg msg={changePassMsg} />
                  <SubmitButton disabled={updatingPass ? true : false}>
                    {!updatingPass ? "Update" : "Updating..."}
                  </SubmitButton>
                </div>
              </form>
            </div>
            <div className="settingsection">
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
                  <i className="icolab">
                    {" "}
                    <span className="material-icons">light_mode</span>
                  </i>
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
                  <i className="icolab">
                    {" "}
                    <span className="material-icons">nights_stay</span>
                  </i>
                </div>
              </div>
            </div>
            <div className="settingsection">
              <h3>Subscription</h3>
              <span>{subMsg}</span>
              {subscriptionOptions()}
            </div>
            <div className="settingsection">
              <h3>Account Management</h3>
              <button
                className="flatbut redtext"
                onClick={() =>
                  usePageStore
                    .getState()
                    .handleShowModal("confirmdestroyaccountform")
                }
              >
                Destroy Account
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </React.Fragment>
  );
};

export default UserSettings;
