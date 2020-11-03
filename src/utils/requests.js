import axios from "axios";
import history from "./history";

const baseApiUrl = () => {
  return !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:5100"
    : "https://milkcms.com";
};

const api = axios.create({
  withCredentials: true
});

const retError = err => {
  console.log(err);
  return { error: "" + err };
};

const handleReq = req => {
  if (req.data.error) {
    if (req.data.type === "no_login") {
      history.push("/panel/signout");
    }
    console.log(req.data.error);
  }
  return req.data;
};

const getRequest = async url => {
  try {
    const req = await api.get(baseApiUrl() + url);
    return handleReq(req);
  } catch (err) {
    return retError(err);
  }
};

const postRequest = async (url, params, external = false) => {
  try {
    const req = await api.post(!external ? baseApiUrl() + url : url, params);
    return handleReq(req);
  } catch (err) {
    return retError(err);
  }
};

const patchRequest = async (url, params) => {
  try {
    const req = await api.patch(baseApiUrl() + url, params);
    return handleReq(req);
  } catch (err) {
    return retError(err);
  }
};

const deleteRequest = async url => {
  try {
    const req = await api.delete(baseApiUrl() + url);
    return handleReq(req);
  } catch (err) {
    return retError(err);
  }
};

export { getRequest, postRequest, patchRequest, deleteRequest, baseApiUrl };
