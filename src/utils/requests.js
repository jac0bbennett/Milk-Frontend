import axios from "axios";
import history from "./history";
import { useReducer } from "react";

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

const prefix = "useReq/";

const FETCHING = `${prefix}FETCHING`;
const SUCCESS = `${prefix}SUCCESS`;
const ERROR = `${prefix}ERROR`;

const fetching = () => ({ type: FETCHING });
const success = resp => ({ type: SUCCESS, resp });
const error = resp => ({ type: ERROR, resp });

const initialReqState = {
  status: null,
  resp: null
};

const reqReducer = (state = initialReqState, { type, resp } = {}) => {
  switch (type) {
    case FETCHING:
      return { ...initialReqState, status: FETCHING };
    case SUCCESS:
      return { ...state, status: SUCCESS, resp };
    case ERROR:
      return { ...state, status: ERROR, resp };
    default:
      return state;
  }
};

const useReq = (endpoint, { verb = "get", params = {} } = {}) => {
  const [state, dispatch] = useReducer(reqReducer, initialReqState);

  const makeRequest = async () => {
    dispatch(fetching());

    const matchReq = verb => {
      switch (verb) {
        case "get":
          return getRequest(endpoint);
        case "post":
          return postRequest(endpoint, params);
        case "patch":
          return patchRequest(endpoint, params);
        case "delete":
          return deleteRequest(endpoint, params);
        default:
          return getRequest(endpoint);
      }
    };

    const resp = await matchReq(verb);

    if (resp.error) {
      dispatch(error(resp.error));
    } else {
      dispatch(success(resp));
    }
  };

  return [state, makeRequest];
};

export {
  useReq,
  getRequest,
  postRequest,
  patchRequest,
  deleteRequest,
  FETCHING,
  SUCCESS,
  ERROR
};
