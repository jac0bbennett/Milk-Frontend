import React, { useState, useEffect } from "react";
import { getRequest, postRequest } from "../../../utils/requests";
import { MiniHeader } from "../../UI/Misc/miniHeader";
import DeleteButton from "../../UI/Buttons/deleteButton";
import history from "../../../utils/history";
import ShortTextField from "./Fields/shortTextField";
import LongTextField from "./Fields/longTextField";
import NumberField from "./Fields/numberField";
import Timestamp from "react-timestamp";

const EditContent = props => {
  const [contentUuid, setContentUuid] = useState(
    props.match.params.contentuuid
  );
  const [contentData, setContentData] = useState({});
  const [pageTitle, setPageTitle] = useState("");
  const [fields, setFields] = useState([]);
  const [msg, setMsg] = useState("");
  const [contentLoaded, setContentLoaded] = useState(false);
  const [typeLoaded, setTypeLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [contentStatus, setContentStatus] = useState("draft");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isDraftDiscarded, setIsDraftDiscarded] = useState(false);

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
      handleUpdateTitle();
    } else if (contentLoaded || typeLoaded) {
      props.loadbar.progressTo(60);
    }
  }, [contentLoaded, typeLoaded]);

  useEffect(() => {
    if (
      props.page.state.showModal === false &&
      props.page.state.modalComp === "confirmdiscarddraftform"
    ) {
      setIsPublishing(false);
    }
  }, [props.page.state.showModal]);

  useEffect(() => {
    if (contentData.status === 0) {
      setContentStatus("draft");
    } else if (
      contentData.editedAt !== contentData.publishedAt &&
      contentData.editedAt !== contentData.updatedAt
    ) {
      setContentStatus("publishedChange");
    } else {
      setContentStatus("published");
    }
  }, [contentData.editedAt]);

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

  const handlePublish = async event => {
    event.preventDefault();

    props.loadbar.progressTo(15);
    setMsg("publishing...");

    setIsPublishing(true);

    const req = await postRequest(
      "/api/panel/apps/" +
        props.session.state.selApp +
        "/content/" +
        contentUuid,
      { action: "publish" }
    );

    if (req.error) {
      const reqMsg = req.error;
      setMsg(reqMsg);
      setIsPublishing(false);
      props.loadbar.setToError(true);
    } else {
      setMsg("");
      setContentData(req.data);
      setIsPublishing(false);
      props.loadbar.progressTo(100);
    }
  };

  const handleDrafting = bool => {
    setIsDrafting(bool);
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

  const discardCallback = data => {
    setContentData(data);
    setIsPublishing(false);
    setIsDraftDiscarded(true);
    handleUpdateTitle();
  };

  const handleDiscardDraft = () => {
    setIsPublishing(true);

    const url =
      "/api/panel/apps/" +
      props.session.state.selApp +
      "/content/" +
      contentUuid;

    props.page.handleShowModal("confirmdiscarddraftform", {
      discardUrl: url,
      callback: discardCallback,
      extraText: "This draft cannot be resurrected!"
    });
  };

  const getFieldValue = fieldSlug => {
    return contentData.content[fieldSlug]
      ? contentData.content[fieldSlug].draft || ""
      : "";
  };

  const handleUpdateTitle = (newTitle = false) => {
    if (!newTitle) {
      newTitle =
        getTitleShortText.length > 0 &&
        contentData.content.title &&
        contentData.content.title.draft.replace(/\s/g, "").length
          ? contentData.content.title.draft || "Untitled"
          : "Untitled";
    }

    setPageTitle(newTitle);
    props.page.handlePageChange(newTitle, "content");

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
    setIsDraftDiscarded(false);
  };

  const getStatus = () => {
    if (isDrafting) {
      return <span className="softtext">saving...</span>;
    } else if (contentStatus === "draft") {
      return <span className="softtext">Draft</span>;
    } else if (contentStatus === "publishedChange") {
      return (
        <React.Fragment>
          <span className="yellowtext">Published</span>
          <span className="softtext"> (Pending draft)</span>
        </React.Fragment>
      );
    } else {
      return <span className="greentext">Published</span>;
    }
  };

  const FieldInput = field => {
    const passProps = {
      contentUuid: contentUuid,
      dataId: field.id,
      key: field.slug,
      fieldType: field.fieldType,
      label: field.name,
      value: getFieldValue(field.slug),
      updateTitle: handleUpdateTitle,
      updateEditedTime: handleUpdateEditedTime,
      disabled: isPublishing,
      drafting: handleDrafting,
      contentStatus: contentStatus,
      isDraftDiscarded: isDraftDiscarded,
      session: props.session
    };

    switch (field.fieldType) {
      case "text_short":
        return <ShortTextField {...passProps} />;
      case "text_long":
        return <LongTextField {...passProps} />;
      case "number_int":
        return <NumberField {...passProps} />;
      case "number_float":
        return <NumberField {...passProps} />;
      default:
        return <ShortTextField {...passProps} />;
    }
  };

  return (
    <React.Fragment>
      <MiniHeader header={props.session.state.selAppName} />
      {isLoaded ? (
        <div className="gencontainer" style={{ marginBottom: "300px" }}>
          <div className="coloredbar" style={{ paddingBottom: "20px" }}>
            <span className="softtext">{contentData.typeName}</span>
            <span className="floatright" style={{ marginRight: "20px" }}>
              <span className="contentstatus">{getStatus()}</span>
            </span>
            <h1>{pageTitle}</h1>
            <span className="softtext">
              <Timestamp date={contentData.editedAt} />
            </span>
            <span
              className="floatright"
              style={{ marginTop: "-10px", marginRight: "15px" }}
            >
              <span style={{ fontSize: "11pt" }}>{msg}</span>
              <button
                onClick={handlePublish}
                className="raisedbut"
                style={{ marginLeft: "10px" }}
                disabled={isPublishing || isDrafting}
              >
                Publish
              </button>
            </span>
          </div>
          <br />
          {fields.map(field => FieldInput(field))}
          <div className="gencontainerfooter">
            <DeleteButton style={{ float: "right" }} onClick={handleDelete}>
              Delete
            </DeleteButton>

            {contentStatus === "draft" ||
            contentStatus === "publishedChange" ? (
              <button className="flatbut" onClick={handleDiscardDraft}>
                Discard Draft
              </button>
            ) : (
              <React.Fragment>
                <br />
                <br />
              </React.Fragment>
            )}
          </div>
        </div>
      ) : (
        <br />
      )}
    </React.Fragment>
  );
};

export default EditContent;
