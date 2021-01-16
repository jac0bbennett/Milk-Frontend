import React, { useState, useCallback } from "react";
import { postRequest, patchRequest } from "../../../utils/requests";
import FormMsg from "../../UI/Misc/formMsg";
import { useDropzone } from "react-dropzone";

const UploadForm = props => {
  const [msg, setMsg] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [failedFiles, setFailedFiles] = useState([]);
  const [rejectedFiles, setRejectedFiles] = useState([]);

  const uploadingMsg = (done, count) => {
    return "Uploading " + done + " / " + count;
  };

  const onDrop = useCallback(
    async files => {
      if (files.length > 0) {
        if (files.length <= 10) {
          setIsUploading(true);
          setFailedFiles([]);
          setRejectedFiles([]);
          let uploadCount = 0;

          setMsg(uploadingMsg(uploadCount, files.length));

          const uploadData = await postRequest(
            "/api/panel/apps/" +
              props.session.state.selApp +
              "/assets/genupload",
            { names: Array.from(files, f => f.name) }
          );

          if (uploadData.error) {
            setMsg(uploadData.error);
            setIsUploading(false);
          } else {
            files.map(async file => {
              const formData = new FormData();

              for (const [k, v] of Object.entries(
                uploadData[file.name]["fields"]
              )) {
                formData.append(k, v);
              }

              formData.append("file", file);

              const resp = await postRequest(
                uploadData[file.name]["url"],
                formData,
                true
              );

              const newFileName = uploadData[file.name]["fields"]["key"].split(
                "/"
              )[1];

              let newAsset = {};

              if (resp.error) {
                let failedFilesCopy = [...failedFiles];
                failedFilesCopy.push(file.name);
                setFailedFiles(failedFilesCopy);
              } else {
                const completeUpload = await patchRequest(
                  "/api/panel/apps/" +
                    props.session.state.selApp +
                    "/assets/" +
                    newFileName,
                  { status: "complete" }
                );

                if (completeUpload.error) {
                  alert("There was an error completing the upload!");
                } else {
                  newAsset = completeUpload;
                  if (!props.page.state.modalData.callbackOnLast) {
                    props.page.state.modalData.callback(newAsset);
                  }
                }
              }

              uploadCount++;
              setMsg(uploadingMsg(uploadCount, files.length));

              if (uploadCount === files.length) {
                setMsg("Finished uploading " + uploadCount + "!");
                setIsUploading(false);
                if (props.page.state.modalData.callbackOnLast) {
                  props.page.state.modalData.callback(newAsset);
                }
              }
            });
          }
        } else {
          setMsg("Upload is limited to 10 files at a time!");
        }
      }
    },
    [props.session.state.selApp, failedFiles, props.page]
  );

  const rejectFiles = files => {
    let rejectedFilesCopy = [...rejectedFiles];
    files.map(f => rejectedFilesCopy.push(f.file.name));
    setRejectedFiles(rejectedFilesCopy);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDrop,
    accept: "image/*",
    maxSize: 5242880,
    onDropRejected: f => rejectFiles(f),
    preventDropOnDocument: true
  });

  return (
    <div>
      <h2>Upload Asset</h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <FormMsg msg={msg} />
        </div>
        {isUploading ? (
          <React.Fragment>
            <br />
            <div className="loadingicon" />
            <br />
          </React.Fragment>
        ) : null}
        {rejectedFiles.length > 0
          ? rejectedFiles.map(f => (
              <p className="redtext" key={f}>
                {f} too large! Must be {"<"} 5mb.
              </p>
            ))
          : null}
        {failedFiles.length > 0
          ? failedFiles.map(f => (
              <p key={f} className="redtext">
                {f} failed to upload!
              </p>
            ))
          : null}
      </div>
      {!isUploading ? (
        <div
          {...getRootProps()}
          style={{
            display: "flex",
            height: "200px",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "1px dotted #3c81c8",
            borderRadius: "5px",
            flexDirection: "column"
          }}
        >
          <input {...getInputProps()} />
          <i
            className="material-icons"
            style={{
              fontSize: "48px",
              color: isDragActive ? "#3c81c8" : "#fff"
            }}
          >
            file_copy
          </i>
          <span style={{ opacity: "0.6" }}>
            {isDragActive ? (
              <p>Drop here to upload</p>
            ) : (
              <p>Select files or drag 'n' drop</p>
            )}
          </span>
        </div>
      ) : null}
      <br />
      <br />
      {!isUploading ? (
        <button
          className="raisedbut floatright"
          onClick={() => props.page.handleCloseModal()}
        >
          Done
        </button>
      ) : null}
    </div>
  );
};

export default UploadForm;
