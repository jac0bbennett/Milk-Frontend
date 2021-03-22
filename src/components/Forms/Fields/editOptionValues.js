import React, { useState, useEffect } from "react";
import TextInput from "../../UI/Inputs/txtInput";
import FormMsg from "../../UI/Misc/formMsg";
import { patchRequest } from "../../../utils/requests";
import SubmitButton from "../../UI/Buttons/submitButton";
import FieldOptionValues from "./fieldOptionValues";
import arrayMove from "array-move";
import usePageStore from "../../../stores/usePageStore";
import useLoadbarStore from "../../../stores/useLoadbarStore";
import useSessionStore from "../../../stores/useSessionStore";

const EditFieldOptionValuesForm = () => {
  const [form, setForm] = useState({
    name: "",
    slug: "",
    options: {},
    newValue: ""
  });
  const [msg, setMsg] = useState("");
  const [valuesMsg, setValuesMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const persistentModalData = usePageStore(state => state.persistentModalData);
  const selApp = useSessionStore(state => state.selApp);

  useEffect(() => {
    const field = { ...persistentModalData.field };
    setForm({
      name: field.name,
      slug: field.slug,
      options: { ...field.options } || {},
      newValue: ""
    });
    setMsg("");
  }, [persistentModalData.field]);

  const handleSubmit = async event => {
    event.preventDefault();

    useLoadbarStore.getState().progressTo(15);
    setSaving(true);

    const fieldid = persistentModalData.field.id;
    const fieldoptions = JSON.stringify(form.options);

    const req = await patchRequest(
      "/api/panel/apps/" +
        selApp +
        "/types/" +
        persistentModalData.typeSlug +
        "/fields/" +
        fieldid,
      { fieldoptions }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      useLoadbarStore.getState().setToError(true);
    } else {
      setMsg("");
      useLoadbarStore.getState().progressTo(100);
      usePageStore.getState().handleCloseModal();
      usePageStore.getState().handleSetRefresh();
    }
    setSaving(false);
  };

  const handleSubmitValue = event => {
    event.preventDefault();

    let formCopy = { ...form };
    const newValue = formCopy.newValue.trim();

    if (newValue !== "") {
      if (!formCopy.options.values || formCopy.options.values.length <= 50) {
        if (newValue.length <= 80) {
          if (formCopy.options.values) {
            if (!formCopy.options.values.includes(newValue)) {
              formCopy.options.values = [newValue, ...formCopy.options.values];
            } else {
              setValuesMsg("Value already in list!");
            }
          } else {
            formCopy.options.values = [newValue];
          }
          formCopy.newValue = "";
        } else {
          setValuesMsg("Value must be < 80 characters!");
        }
      } else {
        setValuesMsg("Exceeding max of 50 values!");
      }
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
          usePageStore.getState().handleShowModal("editfieldform");
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
        <FieldOptionValues
          values={form.options.values}
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
          usePageStore.getState().handleCloseModal();
        }}
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        disabled={saving ? true : false}
        className="raisedbut floatright"
      >
        {!saving ? "Save" : "Saving..."}
      </button>
      <br />
      <br />
      <FormMsg msg={msg} />
    </React.Fragment>
  );
};

export default EditFieldOptionValuesForm;
