import React, { Component } from "react";
import FieldItem from "./fieldItem";

class FieldList extends Component {
  constructor(props) {
    super();
    this.state = { fields: props.fields };
  }
  render() {
    return (
      <React.Fragment>
        <h3>Fields</h3>
        {this.state.fields.length > 0 ? (
          this.state.fields.map(field => (
            <FieldItem key={field.slug} field={field} />
          ))
        ) : (
          <center>
            <span className="softtext">No Fields</span>
          </center>
        )}
      </React.Fragment>
    );
  }
}

export default FieldList;
