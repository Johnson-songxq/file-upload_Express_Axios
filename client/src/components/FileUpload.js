import React, { Fragment, useState } from "react";
import Message from "./Message";
import Progress from "./Progress";
import axios from "../request/axios";

const FileUpload = () => {
  const [file, setFile] = useState("");
  // const [filename, setfilename] = useState("Choose File");
  const [message, setMessage] = useState("");
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const [uploadedFile, setUploadedFile] = useState({});
  const onChange = (e) => {
    console.log("e", e.target.files);
    console.log("--------");
    console.log("e", e.target.files[0]);
    setFile(e.target.files[0]);
    // setfilename(e.target.files[0].name);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await axios.post("/upload", formData, {
        onUploadProgress: (ProgressEvent) => {
          setUploadPercentage(
            parseInt(
              Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)
            )
          );
        },
      });

      //clear percentage after 10s
      setTimeout(() => setUploadPercentage(0), 10000);
      const { fileName, filePath } = res.data;
      setUploadedFile({ fileName, filePath });
      setMessage("File Uploaded");
    } catch (err) {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 400) {
          setMessage(`Bad Request: ${data.error}`);
        } else if (status === 500) {
          setMessage(`Server Error: ${data.error}`);
        } else {
          setMessage(`Unknown Error: ${data.error}`);
        }
      } else {
        setMessage("An unexpected error occurred. Please tyr again later");
      }

      setUploadPercentage(0);
    }
  };
  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
        <div className="input-group mb-3">
          <input type="file" className="form-control" onChange={onChange} />
        </div>
        <Progress percentage={uploadPercentage} />
        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block mt-4"
        />
      </form>
      {/* this is to be fixed since uploadedFile is a object */}
      {uploadedFile ? (
        <div className="row mt-5">
          {/* column middle grid 6 */}
          <div className="col-md-6 m-auto">
            <h3 className="text-center">{uploadedFile.fileName}</h3>
            <img alt="" style={{ width: "100%" }} src={uploadedFile.filePath} />
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default FileUpload;
