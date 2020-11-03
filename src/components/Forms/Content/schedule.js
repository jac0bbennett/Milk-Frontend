import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { postRequest } from "../../../utils/requests";
import FormMsg from "../../UI/Misc/formMsg";
import SubmitButton from "../../UI/Buttons/submitButton";
import "react-datepicker/dist/react-datepicker.css";

const ScheduleForm = props => {
  const [datetime, setDatetime] = useState(new Date());
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async event => {
    event.preventDefault();

    props.loadbar.progressTo(15);
    setSubmitting(true);

    let schedTime = null;

    try {
      schedTime = new Date(datetime).toUTCString();
    } catch (err) {
      setMsg("Invalid Datetime!");
      props.loadbar.setToError(true);
      return false;
    }

    const req = await postRequest(
      "/api/panel/apps/" +
        props.session.state.selApp +
        "/content/" +
        props.page.state.modalData.uuid,
      { action: "schedule", schedTime: schedTime }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
    } else {
      setMsg("");
      setDatetime(new Date());
      props.loadbar.progressTo(100);
      props.page.handleCloseModal();
      props.page.state.modalData.callback(req.data);
    }
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <h2>Schedule Publish</h2>
      <div className="datepicker">
        <label htmlFor="datepicker">
          <i
            className="material-icons hoverblue"
            style={{ marginRight: "10px" }}
          >
            calendar_today
          </i>
        </label>
        <DatePicker
          id="datepicker"
          selected={datetime}
          showTimeSelect
          onChange={date => {
            setDatetime(date);
            setMsg("");
          }}
          dateFormat="M/d/yyyy h:mm aa"
          minDate={new Date()}
        />
        <br />
        <br />
        <br />
        <SubmitButton disabled={submitting ? true : false}>
          {!submitting ? "Schedule" : "Scheduling..."}
        </SubmitButton>
        <br />
        <FormMsg msg={msg} />
      </div>
      <br />
    </form>
  );
};

export default ScheduleForm;
