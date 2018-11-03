import axios from "axios";
import history from "./history";

const retError = err => {
  console.log(err);
  return { error: "" + err };
};

const getRequest = async url => {
  try {
    const req = await axios.get(url);
    if (req.data.error) {
      if (req.data.type === "no_login") {
        history.push("/panel/signout");
      }
      console.log(req.data.error);
    }
    return req.data;
  } catch (err) {
    return retError(err);
  }
};

const postRequest = async (url, params) => {
  try {
    const req = await axios.post(url, params);
    if (req.data.error) {
      if (req.data.type === "no_login") {
        history.push("/panel/signout");
      }
      console.log(req.data.error);
    }
    return req.data;
  } catch (err) {
    return retError(err);
  }
};

const patchRequest = async (url, params) => {
  try {
    const req = await axios.patch(url, params);
    if (req.data.error) {
      if (req.data.type === "no_login") {
        history.push("/panel/signout");
      }
      console.log(req.data.error);
    }
    return req.data;
  } catch (err) {
    return retError(err);
  }
};

const deleteRequest = async url => {
  try {
    const req = await axios.delete(url);
    if (req.data.error) {
      if (req.data.type === "no_login") {
        history.push("/panel/signout");
      }
      console.log(req.data.error);
    }
    return req.data;
  } catch (err) {
    return retError(err);
  }
};

export { getRequest, postRequest, patchRequest, deleteRequest };
