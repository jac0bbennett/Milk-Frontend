import axios from "axios";
import history from "./history";

let baseApiUrl = "";

if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
  baseApiUrl = "http://localhost:5100";
} else {
  baseApiUrl = "https://milk.jwb.cloud";
}

const api = axios.create({
  withCredentials: true
});

const retError = err => {
  console.log(err);
  return { error: "" + err };
};

const getRequest = async url => {
  try {
    const req = await api.get(baseApiUrl + url);
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
    const req = await api.post(baseApiUrl + url, params);
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
    const req = await api.patch(baseApiUrl + url, params);
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
    const req = await api.delete(baseApiUrl + url);
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
