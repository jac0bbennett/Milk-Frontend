import React, { useState, useEffect, useCallback } from "react";
import { getRequest, postRequest } from "../../../utils/requests";
import { MiniHeader } from "../../UI/Misc/miniHeader";
import DeleteButton from "../../UI/Buttons/deleteButton";
import history from "../../../utils/history";
import ShortTextField from "./Fields/shortTextField";
import LongTextField from "./Fields/longTextField";
import NumberField from "./Fields/numberField";
import BooleanField from "./Fields/booleanField";
import Timestamp from "react-timestamp";

const EditContent = props => {
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
  const [publishDisabled, setPublishDisabled] = useState(false);

  const handleUpdateTitle = useCallback(
    (newTitle = "") => {
      setPageTitle(newTitle);

      if (newTitle === "") {
        newTitle = "Untitled";
      }

      props.page.handlePageChange(newTitle, "content");
    },
    [props.page]
  );

  const getType = useCallback(
    async typeslug => {
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
    },
    [props.loadbar, props.session]
  );

  const getContent = useCallback(async () => {
    const resp = await getRequest(
      "/api/panel/apps/" +
        props.match.params.appuuid +
        "/content/" +
        props.match.params.contentuuid
    );
    if (resp.error) {
      props.loadbar.setToError(true);
    } else {
      const userId = resp.meta.userId;
      const selApp = resp.meta.appUUID;
      const selAppName = resp.meta.appName;
      setContentData(resp.data);
      setContentLoaded(true);
      props.session.handleSession(userId, selApp, selAppName);
      handleUpdateTitle();
      getType(resp.data.typeSlug);
    }
  }, [
    props.loadbar,
    props.session,
    getType,
    props.match.params.appuuid,
    props.match.params.contentuuid,
    handleUpdateTitle
  ]);

  useEffect(() => {
    props.loadbar.progressTo(15);
    props.page.handlePageChange("", "content");
    props.session.handleSession(undefined, props.match.params.appuuid);
    getContent();
  }, [
    props.loadbar,
    props.page,
    props.session,
    props.match.params.contentuuid,
    props.match.params.appuuid,
    getContent,
    props.page.state.refreshView,
    handleUpdateTitle
  ]);

  useEffect(() => {
    if (contentLoaded && typeLoaded) {
      props.loadbar.progressTo(100);
      setIsLoaded(true);

      const getTitleShortText = fields.filter((v, i) => {
        return v.slug === "title" && v.fieldType === "text_short";
      });

      const newTitle =
        getTitleShortText.length > 0 &&
        contentData.content.title &&
        contentData.content.title.draft &&
        contentData.content.title.draft.replace(/\s/g, "").length
          ? contentData.content.title.draft || "Untitled"
          : "Untitled";

      handleUpdateTitle(newTitle);
    } else if (contentLoaded || typeLoaded) {
      props.loadbar.progressTo(60);
    }
  }, [
    contentLoaded,
    typeLoaded,
    props.loadbar,
    contentData.content,
    handleUpdateTitle,
    fields
  ]);

  useEffect(() => {
    if (
      props.page.state.showModal === false &&
      props.page.state.modalComp === "confirmdiscarddraftform"
    ) {
      setIsPublishing(false);
    }
  }, [props.page.state.showModal, props.page.state.modalComp]);

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
  }, [
    contentData.editedAt,
    contentData.status,
    contentData.publishedAt,
    contentData.updatedAt
  ]);

  const handlePublish = async event => {
    event.preventDefault();

    if (!isDrafting && !isPublishing && !publishDisabled) {
      props.loadbar.progressTo(15);
      setMsg("publishing...");

      setIsPublishing(true);

      const req = await postRequest(
        "/api/panel/apps/" +
          props.session.state.selApp +
          "/content/" +
          props.match.params.contentuuid,
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
      props.match.params.contentuuid;

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
  };

  const handleDiscardDraft = () => {
    setIsPublishing(true);

    const url =
      "/api/panel/apps/" +
      props.session.state.selApp +
      "/content/" +
      props.match.params.contentuuid;

    props.page.handleShowModal("confirmactionform", {
      discardUrl: url,
      action: "discardDraft",
      callback: discardCallback,
      titleText: "Are you sure you want to discard this draft?",
      extraText: "This draft cannot be resurrected!"
    });
  };

  const unpublishCallback = data => {
    setContentData(data);
  };

  const handleUnpublish = () => {
    const url =
      "/api/panel/apps/" +
      props.session.state.selApp +
      "/content/" +
      props.match.params.contentuuid;

    props.page.handleShowModal("confirmactionform", {
      discardUrl: url,
      action: "unpublish",
      callback: unpublishCallback,
      titleText: "Are you sure you want to unpublish this?",
      extraText: "It will no longer be available through the API!"
    });
  };

  const getFieldValue = fieldSlug => {
    return contentData.content[fieldSlug]
      ? contentData.content[fieldSlug].draft || ""
      : "";
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
      contentUuid: props.match.params.contentuuid,
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
      disablePublish: setPublishDisabled,
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
      case "boolean":
        return <BooleanField {...passProps} />;
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
                disabled={isPublishing || isDrafting || publishDisabled}
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
            ) : null}
            {contentStatus === "published" ||
            contentStatus === "publishedChange" ? (
              <button className="flatbut bluetext" onClick={handleUnpublish}>
                Unpublish
              </button>
            ) : null}
          </div>
        </div>
      ) : (
        <br />
      )}
    </React.Fragment>
  );
};

export default EditContent;
