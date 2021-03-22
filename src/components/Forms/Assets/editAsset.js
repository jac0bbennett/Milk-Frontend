import React, { useState, useEffect } from "react";
import TextInput from "../../UI/Inputs/txtInput";
import TextAreaInput from "../../UI/Inputs/txtArea";
import { patchRequest } from "../../../utils/requests";
import FormMsg from "../../UI/Misc/formMsg";
import SubmitButton from "../../UI/Buttons/submitButton";
import DeleteButton from "../../UI/Buttons/deleteButton";
import Moment from "react-moment";
import usePageStore from "../../../stores/usePageStore";
import useSessionStore from "../../../stores/useSessionStore";
import useLoadbarStore from "../../../stores/useLoadbarStore";

const EditAssetForm = props => {
  const modalData = usePageStore(state => state.modalData);
  const selApp = useSessionStore(state => state.selApp);
  const id = modalData.asset.id;
  const [form, setForm] = useState({
    name: "",
    description: ""
  });
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm({
      name: modalData.asset.name,
      description: modalData.asset.description || ""
    });
  }, [modalData.asset.name, modalData.asset.description]);

  const handleSubmit = async event => {
    event.preventDefault();

    useLoadbarStore.getState().progressTo(15);
    setSaving(true);

    const name = form.name;
    const description = form.description;

    const req = await patchRequest(
      "/api/panel/apps/" + selApp + "/assets/" + modalData.asset.slug,
      { name, description }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      useLoadbarStore.getState().setToError(true);
    } else {
      setMsg("");
      useLoadbarStore.getState().progressTo(100);
      const newAsset = {
        name: req.name,
        url: req.url,
        description: req.description
      };
      modalData.callback(newAsset);
      usePageStore.getState().handleCloseModal();
    }
    setSaving(false);
  };

  const handleDelete = async event => {
    const url = "/api/panel/apps/" + selApp + "/assets/" + modalData.asset.slug;

    usePageStore.getState().handleShowModal("confirmdeleteform", {
      deleteUrl: url,
      extraText:
        "This asset will be permanently deleted and unusable in contents!",
      callback: () =>
        usePageStore.getState().handleUpdateModalData({
          removedAsset: id
        })
    });
  };

  const handleChange = event => {
    let formCopy = { ...form };
    formCopy[event.target.name] = event.target.value;
    setForm(formCopy);
    setMsg("");
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <a
        href={modalData.asset.url}
        target="_blank"
        rel="noopener noreferrer"
        className="floatright"
      >
        Original
      </a>
      <h2>Edit Asset</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "15px"
        }}
      >
        <a href={modalData.asset.url} target="_blank" rel="noopener noreferrer">
          <img
            src={modalData.asset.url}
            style={{ maxWidth: "300px", maxHeight: "300px" }}
            alt={modalData.asset.description}
          />
        </a>
      </div>
      <span
        className="softtext floatright"
        style={{ fontSize: "11pt" }}
        title={new Date(modalData.asset.createdAt)}
      >
        <Moment fromNow>{modalData.asset.createdAt}</Moment>
      </span>
      <br />
      <TextInput
        name="name"
        type="text"
        label="Name"
        value={form.name}
        onChange={handleChange}
        required={true}
      />
      <TextAreaInput
        name="description"
        label="Description"
        value={form.description}
        onChange={handleChange}
        style={{ height: "150px" }}
      />
      <br />
      <br />
      <DeleteButton onClick={handleDelete}>Delete</DeleteButton>
      <SubmitButton disabled={saving ? true : false}>
        {!saving ? "Save" : "Saving..."}
      </SubmitButton>
      <br />
      <FormMsg msg={msg} />
    </form>
  );
};

export default EditAssetForm;
