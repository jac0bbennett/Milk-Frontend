import React, { useState, useEffect, useCallback } from "react";

const LoadingBar = props => {
  const [show, setShow] = useState(true);
  const [full, setFull] = useState("");
  const [width, setWidth] = useState(0);
  const [wait, setWait] = useState(false);
  const [myError, setMyError] = useState(false);

  const className = props.className;
  const id = props.id;

  useEffect(() => {
    setWidth(props.progress);
  }, [props.progress]);

  useEffect(() => {
    if (props.error) {
      setWidth(100);
      setMyError(true);
    }
  }, [props.error]);

  const isFull = useCallback(() => {
    const isFull = width === 100;

    if (isFull) {
      setWait(true);

      setTimeout(() => {
        setFull(true);
        setMyError(false);

        props.onErrorDone();

        setTimeout(() => {
          setShow(false);
          setWidth(0);
          setWait(false);

          setTimeout(() => {
            setFull("");
            setShow(true);

            props.onProgressDone();
          });
        }, 250);
      }, 700);
    }
  }, [props, width]);

  useEffect(() => {
    isFull();
  }, [isFull]);

  const styling = () => {
    if (!wait) {
      return { width: `${width}%` };
    } else {
      return { width: `100%` };
    }
  };

  return (
    <div>
      {show ? (
        <div
          id={id ? id : null}
          className={
            "LoadingBar " +
            (className ? className : "") +
            (myError ? "LoadingBar--error" : "") +
            (full ? "LoadingBar--full" : "")
          }
          style={styling()}
        >
          <div className="LoadingBar-glow" />
        </div>
      ) : null}
    </div>
  );
};

export default LoadingBar;
