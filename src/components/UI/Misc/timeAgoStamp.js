import React, { useEffect, useState } from "react";
import ago from "s-ago";

const TimeAgoStamp = props => {
  const [timestamp, setTimestamp] = useState(new Date(props.children));
  const [agoStamp, setAgoStamp] = useState(ago(timestamp));

  useEffect(() => {
    setTimestamp(new Date(props.children));
    setAgoStamp(ago(new Date(props.children)));
  }, [props.children]);

  useEffect(() => {
    const interval = setInterval(() => setAgoStamp(ago(timestamp)), 60000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <span style={props.style} className={props.className}>
      {agoStamp}
    </span>
  );
};

export default TimeAgoStamp;
