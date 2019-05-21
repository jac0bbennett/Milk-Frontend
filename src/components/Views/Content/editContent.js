import React, { useState, useEffect } from "react";
import TextInput from "../../UI/Inputs/txtInput";
import {
  getRequest,
  patchRequest,
  deleteRequest
} from "../../../utils/requests";
import { MiniHeader } from "../../UI/Misc/miniHeader";
import SubmitButton from "../../UI/Buttons/submitButton";
import DeleteButton from "../../UI/Buttons/deleteButton";
import history from "../../../utils/history";
import ShortTextField from "./Fields/shortTextField";
import LongTextField from "./Fields/longTextField";
import Timestamp from "react-timestamp";

const EditContent = props => {
  const [contentUuid, setContentUuid] = useState(
    props.match.params.contentuuid
  );
  const [contentData, setContentData] = useState({});
  const [pageTitle, setPageTitle] = useState("");
  const [form, setForm] = useState({});
  const [fields, setFields] = useState([]);
  const [msg, setMsg] = useState("");
  const [contentLoaded, setContentLoaded] = useState(false);
  const [typeLoaded, setTypeLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    props.loadbar.progressTo(15);
    props.page.handlePageChange("", "content");
    props.session.handleSession(undefined, props.match.params.appuuid);

    getContent(props.match.params.appuuid);
  }, []);

  useEffect(() => {
    if (props.page.state.refreshView === true) {
      getContent();
      props.page.handleSetRefresh(false);
    }
  }, [props.page.state.refreshView]);

  const getTitleShortText = fields.filter((v, i) => {
    return v.slug === "title" && v.fieldType === "text_short";
  });

  useEffect(() => {
    if (contentLoaded && typeLoaded) {
      props.loadbar.progressTo(100);
      setIsLoaded(true);
      const title =
        getTitleShortText.length > 0 &&
        contentData.content.title &&
        contentData.content.title.draft.replace(/\s/g, "").length
          ? contentData.content.title.draft || "Untitled"
          : "Untitled";

      setPageTitle(title);
      props.page.handlePageChange(title, "content");
    } else if (contentLoaded || typeLoaded) {
      props.loadbar.progressTo(60);
    }
  }, [contentLoaded, typeLoaded]);

  const getContent = async (uuid = props.session.state.selApp) => {
    const resp = await getRequest(
      "/api/panel/apps/" + uuid + "/content/" + contentUuid
    );
    if (resp.error) {
      props.loadbar.setToError(true);
    } else {
      const userId = resp.meta.userId;
      const selApp = resp.meta.appUUID;
      setContentData(resp.data);
      setContentLoaded(true);
      props.session.handleSession(userId, selApp);

      getType(resp.data.typeSlug);
    }
  };

  const getType = async typeslug => {
    const resp = await getRequest(
      "/api/panel/apps/" + props.session.state.selApp + "/types/" + typeslug
    );
    if (resp.error) {
      props.loadbar.setToError(true);
    } else {
      const respFields = resp.data.fields;
      setFields(respFields);
      setTypeLoaded(true);
    }
  };

  const handleChange = event => {
    let contentCopy = { ...contentData };

    const target = event.target.name;

    contentCopy.content[target] = event.target.value;

    setContentData(contentCopy);
  };

  const handleSubmit = async event => {
    event.preventDefault();

    props.loadbar.progressTo(15);
    setMsg("saving...");

    const typename = form.name;

    const req = await patchRequest(
      "/api/panel/apps/" + props.session.state.selApp + "/types/" + form.slug,
      { name: typename, fields: fields }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      props.loadbar.setToError(true);
    } else {
      setMsg("");
      props.loadbar.progressTo(100);
      props.page.handleSetRefresh(true);
      props.page.handleCloseModal();
    }
  };

  const deleteCallback = () => {
    history.push("/panel/apps/" + props.session.state.selApp + "/content");
  };

  const handleDelete = async event => {
    const url =
      "/api/panel/apps/" +
      props.session.state.selApp +
      "/content/" +
      contentUuid;

    props.page.handleShowModal("confirmdeleteform", {
      deleteUrl: url,
      callback: deleteCallback,
      extraText: "All content stored here will be permanently deleted!"
    });
  };

  const getFieldValue = fieldSlug => {
    return contentData.content[fieldSlug]
      ? contentData.content[fieldSlug].draft || ""
      : "";
  };

  const handleUpdateTitle = newTitle => {
    if (newTitle === "") {
      newTitle = "Untitled";
    }

    setPageTitle(newTitle);
    props.page.handlePageChange(newTitle, "content");
  };

  const handleUpdateEditedTime = timestamp => {
    const contentCopy = { ...contentData };
    contentCopy.editedAt = timestamp;
    setContentData(contentCopy);
  };

  return (
    <React.Fragment>
      <MiniHeader header={props.session.state.selAppName} />
      {isLoaded ? (
        <div className="gencontainer">
          <div className="coloredbar" style={{ paddingBottom: "20px" }}>
            <span
              className="floatright"
              style={{ marginRight: "20px", marginTop: "-15px" }}
            >
              <h4>
                {contentData.status === 0 ||
                (contentData.editedAt !== contentData.publishedAt ||
                  contentData.editedAt !== contentData.updatedAt) ? (
                  <span className="softtext">Draft</span>
                ) : (
                  <span className="greentext">Published</span>
                )}
              </h4>
            </span>
            <h1>{pageTitle}</h1>
            <Timestamp date={contentData.editedAt} />
            <button
              className="raisedbut floatright"
              style={{ marginTop: "-10px", marginRight: "15px" }}
            >
              Publish
            </button>
          </div>
          <br />
          {fields.map(field =>
            field.fieldType === "text_short" ? (
              <ShortTextField
                contentUuid={contentUuid}
                dataId={field.id}
                key={field.slug}
                name={field.slug}
                label={field.name}
                value={getFieldValue(field.slug)}
                updateTitle={handleUpdateTitle}
                updateEditedTime={handleUpdateEditedTime}
                session={props.session}
              />
            ) : (
              <LongTextField
                contentUuid={contentUuid}
                dataId={field.id}
                key={field.slug}
                name={field.slug}
                label={field.name}
                value={getFieldValue(field.slug)}
                updateTitle={handleUpdateTitle}
                updateEditedTime={handleUpdateEditedTime}
                session={props.session}
              />
            )
          )}
          <DeleteButton style={{ float: "right" }} onClick={handleDelete}>
            Delete
          </DeleteButton>
          <br />
          <br />
        </div>
      ) : (
        <br />
      )}
    </React.Fragment>
  );
};

export default EditContent;
