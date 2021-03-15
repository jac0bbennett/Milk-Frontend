import { useState, useEffect } from "react";
import { getRequest, statuses } from "./requests";
import usePageStore from "../stores/usePageStore";
import useSessionStore from "../stores/useSessionStore";
import useLoadbarStore from "../stores/useLoadbarStore";

const useApiCall = endpoint => {
  const [data, setData] = useState({});
  const [status, setStatus] = useState(statuses.LOADING);

  const refreshView = usePageStore(state => state.refreshView);

  useEffect(() => {
    setStatus(statuses.LOADING);
    useLoadbarStore.getState().progressTo(15);
    const req = async () => {
      const resp = await getRequest(endpoint);
      if (resp.error) {
        console.log("error");
        setStatus(statuses.ERROR);
        useLoadbarStore.getState().setToError(true);
      } else {
        useLoadbarStore.getState().progressTo(100);
        if (resp.meta) {
          useSessionStore
            .getState()
            .handleSession(
              resp.meta.userId,
              resp.meta.appUUID,
              resp.meta.appName
            );
        }
        setData(resp.data);
        setStatus(statuses.SUCCESS);
      }
    };

    req();
  }, [endpoint, refreshView]);

  return [data, status];
};

export default useApiCall;
