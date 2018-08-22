import React, { Component } from "react";
import axios from "axios";
import history from "../history";
import SelectButton from "./selectButton";

class AppItem extends Component {
  constructor(props) {
    super(props);
    this.state = { selApp: props.selApp };
  }

  selectApp = uuid => {
    console.log("selapp item ", uuid);
    this.setState({ selApp: uuid });
    this.props.onSelectApp(undefined, uuid);
    axios
      .get(`/api/panel/apps/select/` + uuid)
      .then(res => {
        if (res.data.errors) {
          const msg = res.data.errors;
          console.log(msg);
        } else {
          const userId = res.data.signedIn;
          if (userId === 0) {
            history.push("/panel/signout");
          } else {
            console.log("Selected App ", uuid);
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const menuStyle = {
      float: "right",
      padding: "5px",
      marginBottom: "5px"
    };

    const uuidStyle = { fontSize: "9pt" };

    return (
      <div className={this.getClassNames(this.props.app.uuid)}>
        <SelectButton
          selectItem={() => {
            this.selectApp(this.props.app.uuid);
          }}
          sel={this.state.selApp === this.props.app.uuid}
        />
        <h2 className="cmsappname">{this.props.app.name}</h2>
        <button className="flatbut cmsappmanage" style={menuStyle}>
          <i className="material-icons">more_horiz</i>
        </button>
        <span style={uuidStyle}>UUID:</span>{" "}
        <span className="cmsappuuid">{this.props.app.uuid}</span>
      </div>
    );
  }

  getClassNames = uuid => {
    const selApp = this.state.selApp;
    return selApp === uuid ? "cmsappitem selappdiv" : "cmsappitem";
  };
}

export default AppItem;
