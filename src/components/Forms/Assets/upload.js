import React, { useState, useCallback } from "react";
import { postRequest } from "../../../utils/requests";
import FormMsg from "../../UI/Misc/formMsg";
import { useDropzone } from "react-dropzone";

const UploadForm = props => {
  const [msg, setMsg] = useState("");
  const [uploading, setUploading] = useState(false);
  const [failedFiles, setFailedFiles] = useState([]);

  const uploadingMsg = (done, count) => {
    return "Uploading " + done + " / " + count;
  };

  const onDrop = useCallback(
    files => {
      setUploading(true);
      setFailedFiles([]);
      let uploadCount = 0;

      setMsg(uploadingMsg(uploadCount, files.length));

      files.map(async file => {
        const formData = new FormData();
        formData.append("file", file);

        const resp = await postRequest(
          "/api/panel/apps/" + props.session.state.selApp + "/assets",
          formData
        );

        uploadCount++;
        setMsg(uploadingMsg(uploadCount, files.length));

        if (resp.error) {
          let failedFilesCopy = [...failedFiles];
          failedFilesCopy.push(file.name);
          setFailedFiles(failedFilesCopy);
        }
        if (uploadCount === files.length) {
          setMsg("Finished uploading " + uploadCount + " assets!");
          setUploading(false);
          props.page.handleSetRefresh();
          if (failedFiles.length === 0) {
            props.page.handleCloseModal();
          }
        }
      });
    },
    [props.session.state.selApp]
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDrop,
    accept: "image/*",
    maxSize: 15728640
  });

  return (
    <div>
      <h2>New Asset</h2>
      <br />
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <FormMsg msg={msg} />
      </div>
      {uploading ? (
        <React.Fragment>
          <br />
          <br />
        </React.Fragment>
      ) : null}
      {failedFiles.length > 0
        ? failedFiles.map(f => <p className="redtext">{f} failed to upload!</p>)
        : null}
      {!uploading ? (
        <div
          {...getRootProps()}
          style={{
            display: "flex",
            height: "200px",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            border: "2px solid #3c81c8",
            borderRadius: "5px"
          }}
        >
          <input {...getInputProps()} />

          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Select files or drag n' drop</p>
          )}
        </div>
      ) : null}
      <br />
    </div>
  );
};

export default UploadForm;
