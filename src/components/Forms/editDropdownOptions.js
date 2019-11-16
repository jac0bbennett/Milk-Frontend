import React, { useState, useEffect } from "react";
import TextInput from "../UI/Inputs/txtInput";
import FormMsg from "../UI/Misc/formMsg";
import { patchRequest } from "../../utils/requests";
import SubmitButton from "../UI/Buttons/submitButton";
import DropdownOptions from "../Forms/dropdownOptions";
import arrayMove from "array-move";

const EditDropdownOptionsForm = props => {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    options: {},
    newValue: ""
  });
  const [msg, setMsg] = useState("");
  const [valuesMsg, setValuesMsg] = useState("");

  useEffect(() => {
    const field = { ...props.page.state.modalData.field };
    setForm({
      name: field.name,
      slug: field.slug,
      options: { ...field.options } || {},
      newValue: ""
    });
    setMsg("");
  }, [props.page.state.modalData.field]);

  const handleSubmit = async event => {
    event.preventDefault();

    props.loadbar.progressTo(15);
    setMsg("saving...");

    const fieldid = props.page.state.modalData.field.id;
    const fieldoptions = JSON.stringify(form.options);

    const req = await patchRequest(
      "/api/panel/apps/" +
        props.session.state.selApp +
        "/types/" +
        props.page.state.modalData.typeSlug +
        "/fields/" +
        fieldid,
      { fieldoptions }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
    } else {
      setMsg("");
      props.loadbar.progressTo(100);
      props.page.handleCloseModal();
      props.page.handleSetRefresh();
    }
  };

  const handleSubmitValue = event => {
    event.preventDefault();

    let formCopy = { ...form };
    const newValue = formCopy.newValue.trim();

    if (newValue !== "") {
      if (formCopy.options.values) {
        if (!formCopy.options.values.includes(newValue)) {
          formCopy.options.values.unshift(newValue);
        } else {
          setValuesMsg("Value already in list!");
        }
      } else {
        formCopy.options.values = [newValue];
      }
      formCopy.newValue = "";
    } else {
      setValuesMsg("Value can't be blank!");
    }

    setForm(formCopy);
  };

  const handleChange = event => {
    let formCopy = { ...form };
    const target = event.target.name;
    formCopy[target] = event.target.value;

    setForm(formCopy);
    setValuesMsg("");
  };

  const onDropdownSortEnd = async ({ oldIndex, newIndex }) => {
    let formCopy = { ...form };
    const rearange = [
      ...arrayMove(formCopy.options.values, oldIndex, newIndex)
    ];
    formCopy.options.values = rearange;

    setForm(formCopy);
  };

  const handleDeleteValue = index => {
    let formCopy = { ...form };
    formCopy.options.values.splice(index, 1);

    setForm(formCopy);
  };

  return (
    <React.Fragment>
      <button
        className="flatbut modalBack"
        onClick={() => {
          props.page.handleShowModal("editfieldform");
        }}
      >
        <i className="material-icons">keyboard_arrow_left</i>
        <span className="icolab">Back</span>
      </button>
      <form onSubmit={handleSubmitValue} autoComplete="off">
        <h2>{form.name} Values</h2>
        <TextInput
          name="newValue"
          type="text"
          label="New Value"
          value={form.newValue}
          onChange={handleChange}
        />
        <SubmitButton>Add</SubmitButton>
        <FormMsg msg={valuesMsg} />
      </form>
      <br />
      <br />
      {form.options.values && form.options.values.length > 0 ? (
        <DropdownOptions
          values={form.options.values}
          page={props.page}
          fieldSlug={form.slug}
          deleteValue={handleDeleteValue}
          useDragHandle={true}
          onSortEnd={onDropdownSortEnd}
          helperClass="modalSortable"
        />
      ) : (
        <div className="midmsgHigh softtext">No values set</div>
      )}

      <br />
      <br />
      <button
        className="flatbut"
        onClick={() => {
          props.page.handleCloseModal();
        }}
      >
        Cancel
      </button>
      <button onClick={handleSubmit} className="raisedbut floatright">
        Save
      </button>
      <br />
      <br />
      <FormMsg msg={msg} />
    </React.Fragment>
  );
};

export default EditDropdownOptionsForm;
