import React, { useState } from "react";
import DropDownInput from "../UI/Inputs/dropInput";
import { postRequest } from "../../utils/requests";
import FormMsg from "../UI/Misc/formMsg";
import SubmitButton from "../UI/Buttons/submitButton";
import { Link } from "react-router-dom";
import history from "../../utils/history";

const NewContentForm = props => {
  const [form, setForm] = useState({ type: "" });
  const [msg, setMsg] = useState("");

  const handleSubmit = async event => {
    event.preventDefault();

    props.loadbar.progressTo(15);
    setMsg("creating...");

    const typeslug = form.type;

    const req = await postRequest(
      "/api/panel/apps/" + props.session.state.selApp + "/content",
      { typeslug }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
    } else {
      setMsg("");
      setForm({ type: "" });
      props.loadbar.progressTo(100);
      props.page.handleCloseModal();
      history.push(
        "/panel/apps/" + props.session.state.selApp + "/content/" + req.uuid
      );
    }
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
      {props.page.state.modalData.types.length > 0 ? (
        <div>
          <DropDownInput
            name="type"
            label="Content Type"
            onChange={handleChange}
            value={form.type}
            required={true}
          >
            {props.page.state.modalData.types.map(type => (
              <option key={type.id} value={type.slug}>
                {type.slug}
              </option>
            ))}
          </DropDownInput>
          <br />
          <br />
          <FormMsg msg={msg} />
          <SubmitButton>Submit</SubmitButton>{" "}
        </div>
      ) : (
        <span className="graytext">
          Create a{" "}
          <Link to={"/panel/apps/" + props.session.state.selApp + "/types"}>
            content type
          </Link>{" "}
          first!
        </span>
      )}
      <br />
      <br />
    </form>
  );
};

export default NewContentForm;
