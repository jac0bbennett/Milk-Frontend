import React, { Component } from "react";

class AppItem extends Component {
  render() {
    const selectStyle = { float: "right" };
    const menuStyle = {
      float: "right",
      padding: "5px",
      marginBottom: "5px"
    };

    const uuidStyle = { fontSize: "9pt" };

    return (
      <div className="cmsappitem">
        <button className="cmsappselect flatbut" style={selectStyle}>
          Select
        </button>
        <h2 className="cmsappname">{this.props.app.name}</h2>
        <button className="flatbut cmsappmanage" style={menuStyle}>
          <i className="material-icons">more_horiz</i>
        </button>
        <span style={uuidStyle}>UUID:</span>{" "}
        <span className="cmsappuuid">{this.props.app.uuid}</span>
      </div>
    );
  }
}

export default AppItem;
