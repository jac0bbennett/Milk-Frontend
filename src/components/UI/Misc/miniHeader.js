import React from "react";
import { Truncate } from "../../../utils/text";

const MiniHeader = ({ header }) => {
  return <h2 className="miniheader">{Truncate(header, 24)}</h2>;
};

export { MiniHeader };
