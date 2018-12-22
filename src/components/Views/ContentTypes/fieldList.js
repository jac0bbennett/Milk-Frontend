import React, { Component } from "react";
import FieldItem from "./fieldItem";

class FieldList extends Component {
  render() {
    return (
      <React.Fragment>
        <h3>Fields</h3>
        {this.props.fields.length > 0 ? (
          this.props.fields.map(field => (
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
