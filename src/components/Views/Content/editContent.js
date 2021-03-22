import React, { useState, useEffect, useCallback } from "react";
import { getRequest, postRequest, statuses } from "../../../utils/requests";
import history from "../../../utils/history";
import ShortTextField from "./Fields/shortTextField";
import LongTextField from "./Fields/longTextField";
import NumberField from "./Fields/numberField";
import BooleanField from "./Fields/booleanField";
import DropdownField from "./Fields/dropdownField";
import ImageField from "./Fields/imageField";
import ListField from "./Fields/listField";
import DropMenu from "../../UI/Misc/dropMenu";
import Moment from "react-moment";
import moment from "moment";
import usePageStore from "../../../stores/usePageStore";
import useLoadbarStore from "../../../stores/useLoadbarStore";
import useViewApiCall from "../../../utils/useViewApiCall";

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
  const [fieldsDisabled, setFieldsDisabled] = useState(false);
  const [isDraftDiscarded, setIsDraftDiscarded] = useState(false);
  const [publishDisabled, setPublishDisabled] = useState(false);

  const [contentResp, contentRespStatus] = useViewApiCall(
    "/api/panel/apps/" +
      props.match.params.appuuid +
      "/content/" +
      props.match.params.contentuuid,
    true
  );

  const handleUpdateTitle = useCallback((newTitle = "") => {
    setPageTitle(newTitle);

    usePageStore.getState().handlePageChange(newTitle || "Untitled", "content");
  }, []);

  const getType = useCallback(
    async typeslug => {
      const resp = await getRequest(
        "/api/panel/apps/" + props.match.params.appuuid + "/types/" + typeslug
      );
      if (resp.error) {
        useLoadbarStore.getState().setToError(true);
      } else {
        const respFields = resp.data.fields;
        setFields(respFields);
        setTypeLoaded(true);
      }
    },
    [props.match.params.appuuid]
  );

  useEffect(() => {
    usePageStore.getState().handlePageChange("", "content");
    useLoadbarStore.getState().progressTo(15);
    if (contentRespStatus === statuses.SUCCESS) {
      setContentData(contentResp);
      setContentLoaded(true);
      handleUpdateTitle();

      getType(contentResp.typeSlug);
    }
  }, [contentResp, contentRespStatus, handleUpdateTitle, getType]);

  useEffect(() => {
    if (contentLoaded && typeLoaded) {
      useLoadbarStore.getState().progressTo(100);
      setIsLoaded(true);

      const getTitleShortText = fields.filter((v, i) => {
        return v.slug === "title" && v.fieldType === "text_short";
      });

      const newTitle =
        getTitleShortText.length > 0 &&
        contentData.fields.title &&
        contentData.fields.title.draft &&
        contentData.fields.title.draft.replace(/\s/g, "").length
          ? contentData.fields.title.draft || ""
          : "";

      handleUpdateTitle(newTitle);
    } else if (contentLoaded || typeLoaded) {
      useLoadbarStore.getState().progressTo(60);
    }
  }, [
    contentLoaded,
    typeLoaded,
    contentData.fields,
    handleUpdateTitle,
    fields
  ]);

  useEffect(() => {
    if (
      usePageStore.getState().showModal === false &&
      usePageStore.getState().modalComp === "confirmdiscarddraftform"
    ) {
      setIsPublishing(false);
    }
  }, []);

  useEffect(() => {
    const editedAt = new Date(contentData.editedAt);
    const publishedAt = new Date(contentData.publishedAt);
    if (contentData.status === 0) {
      setContentStatus("draft");
      setFieldsDisabled(false);
    } else if (
      editedAt > publishedAt &&
      contentData.editedAt !== contentData.updatedAt
    ) {
      setContentStatus("publishedChange");
      setFieldsDisabled(false);
    } else if (publishedAt > editedAt && publishedAt > new Date()) {
      setContentStatus("scheduled");
      setFieldsDisabled(true);
    } else {
      setContentStatus("published");
      setFieldsDisabled(false);
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
      useLoadbarStore.getState().progressTo(15);
      setMsg("publishing...");

      setIsPublishing(true);

      const req = await postRequest(
        "/api/panel/apps/" +
          props.match.params.appuuid +
          "/content/" +
          props.match.params.contentuuid,
        { action: "publish" }
      );

      if (req.error) {
        const reqMsg = req.error;
        setMsg(reqMsg);
        setIsPublishing(false);
        useLoadbarStore.getState().setToError(true);
      } else {
        setMsg("");
        setContentData(req.data);
        setIsPublishing(false);
        useLoadbarStore.getState().progressTo(100);
      }
    }
  };

  const handleDrafting = bool => {
    setIsDrafting(bool);
  };

  const deleteCallback = () => {
    history.push("/panel/apps/" + props.match.params.appuuid + "/content");
  };

  const handleDelete = async () => {
    const url =
      "/api/panel/apps/" +
      props.match.params.appuuid +
      "/content/" +
      props.match.params.contentuuid;

    usePageStore.getState().handleShowModal("confirmdeleteform", {
      deleteUrl: url,
      callback: deleteCallback,
      extraText: "All content stored here will be permanently deleted!",
      noRefresh: true
    });
  };

  const discardCallback = data => {
    if (data) {
      setContentData(data);
      setIsPublishing(false);
      setIsDraftDiscarded(true);
    } else {
      setIsPublishing(false);
    }
  };

  const handleDiscardDraft = () => {
    const url =
      "/api/panel/apps/" +
      props.match.params.appuuid +
      "/content/" +
      props.match.params.contentuuid;

    usePageStore.getState().handleShowModal("confirmactionform", {
      discardUrl: url,
      action: "discardDraft",
      callback: discardCallback,
      titleText: "Are you sure you want to discard this draft?",
      extraText: "This draft cannot be resurrected!",
      msgText: "discarding..."
    });
  };

  const unpublishCallback = data => {
    if (data) {
      setContentData(data);
    }
  };

  const handleUnpublish = () => {
    const url =
      "/api/panel/apps/" +
      props.match.params.appuuid +
      "/content/" +
      props.match.params.contentuuid;

    usePageStore.getState().handleShowModal("confirmactionform", {
      discardUrl: url,
      action: "unpublish",
      callback: unpublishCallback,
      titleText: "Are you sure you want to unpublish this?",
      extraText: "It will no longer be available through the API!",
      msgText: "unpublishing..."
    });
  };

  const handleUnschedule = () => {
    const url =
      "/api/panel/apps/" +
      props.match.params.appuuid +
      "/content/" +
      props.match.params.contentuuid;

    usePageStore.getState().handleShowModal("confirmactionform", {
      discardUrl: url,
      action: "unpublish",
      callback: unpublishCallback,
      titleText: "Are you sure you want to unschedule this?",
      extraText:
        "It will not be made available through the API at the scheduled time!",
      msgText: "unscheduling..."
    });
  };

  const scheduleCallback = data => {
    if (data) {
      setContentData(data);
    }
  };

  const getFieldValue = fieldSlug => {
    return contentData.fields[fieldSlug]
      ? contentData.fields[fieldSlug].draft || ""
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
          <span
            className="yellowtext"
            title={new Date(contentData.publishedAt)}
          >
            Published
          </span>
          <span className="softtext"> (Pending draft)</span>
        </React.Fragment>
      );
    } else if (contentStatus === "scheduled") {
      return (
        <span>
          <span className="bluetext" title={new Date(contentData.publishedAt)}>
            {moment().diff(contentData.publishedAt, "months") >= 10 ? (
              <Moment format="MMM Do YYYY, h:mma">
                {contentData.publishedAt}
              </Moment>
            ) : (
              <Moment format="MMM Do, h:mma">{contentData.publishedAt}</Moment>
            )}
          </span>
        </span>
      );
    } else {
      return (
        <span className="greentext" title={new Date(contentData.publishedAt)}>
          Published
        </span>
      );
    }
  };

  const FieldInput = field => {
    const passProps = {
      contentUuid: props.match.params.contentuuid,
      dataId: field.id,
      key: field.slug,
      slug: field.slug,
      fieldType: field.fieldType,
      fieldOptions: field.options,
      label: field.name,
      value: getFieldValue(field.slug),
      updateTitle: handleUpdateTitle,
      pageTitle: pageTitle,
      updateEditedTime: handleUpdateEditedTime,
      disabled: fieldsDisabled || isPublishing,
      drafting: handleDrafting,
      contentStatus: contentStatus,
      isDraftDiscarded: isDraftDiscarded,
      disablePublish: setPublishDisabled
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
      case "dropdown":
        return <DropdownField {...passProps} />;
      case "list":
        return <ListField {...passProps} />;
      case "image_single":
        return <ImageField {...passProps} />;
      default:
        return <ShortTextField {...passProps} />;
    }
  };

  return (
    <React.Fragment>
      {isLoaded ? (
        <div className="gencontainer" style={{ marginBottom: "300px" }}>
          <div
            className="coloredbar"
            style={{
              paddingBottom: "20px",
              marginTop: "-5px",
              marginLeft: "-15px",
              paddingLeft: "25px",
              paddingRight: "5px",
              alignItems: "flex-start",
              flexDirection: "column"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%"
              }}
            >
              <span className="softtext">{contentData.typeName}</span>
              <span className="contentstatus" style={{ marginRight: "15px" }}>
                {getStatus()}
              </span>
            </div>
            <h1>{pageTitle || "Untitled"}</h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%"
              }}
            >
              <span className="softtext">
                {moment().diff(contentData.editedAt, "months") >= 10 ? (
                  <Moment format="MMM Do YYYY, h:mma">
                    {contentData.editedAt}
                  </Moment>
                ) : (
                  <Moment format="MMM Do, h:mma">{contentData.editedAt}</Moment>
                )}
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "-10px",
                  marginRight: "15px"
                }}
              >
                <span style={{ fontSize: "11pt" }}>{msg}</span>
                <button
                  onClick={handlePublish}
                  className="raisedbut"
                  disabled={isPublishing || isDrafting || publishDisabled}
                >
                  {contentStatus === "draft" || contentStatus === "scheduled"
                    ? "Publish"
                    : "Update"}
                </button>
                <DropMenu>
                  {contentStatus === "draft" ? (
                    <li
                      onClick={() => {
                        usePageStore
                          .getState()
                          .handleShowModal("scheduleform", {
                            uuid: props.match.params.contentuuid,
                            callback: scheduleCallback
                          });
                      }}
                    >
                      Schedule
                    </li>
                  ) : null}
                  {contentStatus === "published" ||
                  contentStatus === "publishedChange" ? (
                    <li onClick={handleUnpublish}>Unpublish</li>
                  ) : null}
                  {contentStatus === "scheduled" ? (
                    <li onClick={handleUnschedule}>Unschedule</li>
                  ) : null}
                  {contentStatus === "publishedChange" ? (
                    <li onClick={handleDiscardDraft}>Discard Draft</li>
                  ) : null}
                  <li
                    onClick={handleDelete}
                    className="redtext dropmenusection"
                  >
                    Delete
                  </li>
                </DropMenu>
              </div>
            </div>
          </div>
          <br />
          {contentStatus === "scheduled" ? (
            <React.Fragment>
              <span className="softtext">
                Scheduled content cannot be edited.
              </span>
              <br />
              <br />
            </React.Fragment>
          ) : null}
          {fields.map(field => FieldInput(field))}
        </div>
      ) : (
        <br />
      )}
    </React.Fragment>
  );
};

export default EditContent;
