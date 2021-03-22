import React, { useState } from "react";
import DropDownInput from "../../UI/Inputs/dropInput";
import { postRequest } from "../../../utils/requests";
import FormMsg from "../../UI/Misc/formMsg";
import SubmitButton from "../../UI/Buttons/submitButton";
import { Link } from "react-router-dom";
import history from "../../../utils/history";
import useSessionStore from "../../../stores/useSessionStore";
import usePageStore from "../../../stores/usePageStore";
import useLoadbarStore from "../../../stores/useLoadbarStore";

const NewContentForm = props => {
  const [form, setForm] = useState({ type: "" });
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selApp = useSessionStore(state => state.selApp);
  const modalData = usePageStore(state => state.modalData);

  const handleSubmit = async event => {
    event.preventDefault();

    useLoadbarStore.getState().progressTo(15);
    setSubmitting(true);

    const typeslug = form.type;

    const req = await postRequest("/api/panel/apps/" + selApp + "/content", {
      typeslug
    });

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      useLoadbarStore.getState().setToError(true);
    } else {
      setMsg("");
      setForm({ type: "" });
      useLoadbarStore.getState().progressTo(100);
      usePageStore.getState().handleCloseModal();
      history.push("/panel/apps/" + selApp + "/content/" + req.uuid);
    }
    setSubmitting(false);
  };

  const handleChange = event => {
    let formCopy = { ...form };
    formCopy[event.target.name] = event.target.value;
    setForm(formCopy);
    setMsg("");
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <h2>New Content</h2>
      {modalData.types.length > 0 ? (
        <div>
          <DropDownInput
            name="type"
            label="Content Type"
            onChange={handleChange}
            value={form.type}
            required={true}
          >
            {modalData.types.map(type => (
              <option key={type.id} value={type.slug}>
                {type.slug}
              </option>
            ))}
          </DropDownInput>
          <br />
          <br />
          <FormMsg msg={msg} />
          <SubmitButton disable={submitting ? true : false}>
            {!submitting ? "Create" : "Creating..."}
          </SubmitButton>
        </div>
      ) : (
        <span className="softtext">
          Create a{" "}
          <Link to={"/panel/apps/" + selApp + "/types"}>content type</Link>{" "}
          first!
        </span>
      )}
      <br />
      <br />
    </form>
  );
};

export default NewContentForm;
