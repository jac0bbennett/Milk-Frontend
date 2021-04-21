import React, { useState } from "react";
import { postRequest } from "../../utils/requests";
import DeleteButton from "../UI/Buttons/deleteButton";
import usePageStore from "../../stores/usePageStore";
import useLoadbarStore from "../../stores/useLoadbarStore";
import TextInput from "../../components/UI/Inputs/txtInput";
import history from "../../utils/history";

const ConfirmDestroyAccountForm = () => {
  const [msg, setMsg] = useState("");
  const [password, setPassword] = useState("");
  const [deleteConf, setDeleteConf] = useState("");
  const [isActing, setIsActing] = useState(false);

  const handleAction = async () => {
    useLoadbarStore.getState().progressTo(15);
    setMsg("");

    setIsActing(true);

    const req = await postRequest("/api/panel/destroyaccount", { password });

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      useLoadbarStore.getState().setToError(true);
      setIsActing(false);
    } else {
      setMsg("");
      setIsActing(false);
      useLoadbarStore.getState().progressTo(100);
      usePageStore.getState().handleCloseModal();
      history.push("/panel/signout");
      setPassword("");
      setDeleteConf("");
    }
  };

  const handleCancel = () => {
    usePageStore.getState().handleCloseModal();
  };

  return (
    <div className="smallmodal">
      <h3>Destroy Your Account</h3>
      <div className="redtext" style={{ width: "100%" }}>
        Confirming this will delete your account along with all data associated
        with it!
      </div>
      <br />
      <TextInput
        name="password"
        type="password"
        label="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required={true}
      />
      <br />
      <TextInput
        name="deleteconf"
        type="text"
        label='Type "deleteeverything"'
        value={deleteConf}
        onChange={e => setDeleteConf(e.target.value)}
        required={true}
      />
      <br />
      <br />
      <button onClick={handleCancel} className="flatbut">
        Cancel
      </button>
      {password !== "" && deleteConf === "deleteeverything" ? (
        <DeleteButton style={{ float: "right" }} onClick={handleAction}>
          {!isActing ? "Confirm" : "destroying..."}
        </DeleteButton>
      ) : null}

      <span className="msg floatright">{msg}</span>
    </div>
  );
};

export default ConfirmDestroyAccountForm;
