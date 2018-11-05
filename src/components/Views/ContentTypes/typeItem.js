import React from "react";

const TypeItem = props => {
  return (
    <div className={""}>
      <h2 className="cmsappname">{props.type.name}</h2>
      <button
        className="flatbut cmsappmanage"
        style={{
          float: "right",
          padding: "5px",
          marginBottom: "5px"
        }}
        onClick={() => {
          props.page.handleShowModal("editappform", props.type);
        }}
      />
    </div>
  );
};

export default TypeItem;
