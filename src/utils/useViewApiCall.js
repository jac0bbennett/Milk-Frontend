import { useState, useEffect } from "react";
import { getRequest, statuses } from "./requests";
import usePageStore from "../stores/usePageStore";

const useViewApiCall = endpoint => {
  const [data, setData] = useState({});
  const [meta, setMeta] = useState({});
  const [status, setStatus] = useState(statuses.LOADING);

  const refreshView = usePageStore(state => state.refreshView);

  useEffect(() => {
    setStatus(statuses.LOADING);
    const req = async () => {
      const resp = await getRequest(endpoint);
      if (resp.error) {
        console.log("error");
        setStatus(statuses.ERROR);
        //   props.loadbar.setToError(true);
      } else {
        // props.session.handleSession(userId, selApp, undefined);
        // props.loadbar.progressTo(100);
        setData(resp.data);
        setMeta(resp.meta);
        setStatus(statuses.SUCCESS);
      }
    };

    req();
  }, [endpoint, refreshView]);

  return [data, meta, status];
};

export default useViewApiCall;
