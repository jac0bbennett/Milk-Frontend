import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { postRequest } from "../../../utils/requests";
import FormMsg from "../../UI/Misc/formMsg";
import SubmitButton from "../../UI/Buttons/submitButton";
import "react-datepicker/dist/react-datepicker.css";
import useLoadbarStore from "../../../stores/useLoadbarStore";
import usePageStore from "../../../stores/usePageStore";
import useSessionStore from "../../../stores/useSessionStore";

const ScheduleForm = props => {
  const [datetime, setDatetime] = useState(new Date());
  const [msg, setMsg] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selApp = useSessionStore(state => state.selApp);
  const modalData = usePageStore(state => state.modalData);

  const handleSubmit = async event => {
    event.preventDefault();

    useLoadbarStore.getState().progressTo(15);
    setSubmitting(true);

    let schedTime = null;

    try {
      schedTime = new Date(datetime).toUTCString();
    } catch (err) {
      setMsg("Invalid Datetime!");
      useLoadbarStore.getState().setToError(true);
      return false;
    }

    const req = await postRequest(
      "/api/panel/apps/" + selApp + "/content/" + modalData.uuid,
      { action: "schedule", schedTime: schedTime }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      useLoadbarStore.getState().setToError(true);
    } else {
      setMsg("");
      setDatetime(new Date());
      useLoadbarStore.getState().progressTo(100);
      usePageStore.getState().handleCloseModal();
      modalData.callback(req.data);
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
