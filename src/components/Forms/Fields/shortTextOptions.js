import React from "react";

const ShortTextOptions = props => {
  return (
    <div>
      <div
        style={{ cursor: "pointer" }}
        onClick={() =>
          props.handleChange({
            target: {
              name: "options_unique",
              value: !props.form.options.unique
            }
          })
        }
      >
        <span className="icolab">Unique </span>
        <i className="material-icons">
          {props.form.options.unique ? "check_box" : "check_box_outline_blank"}
        </i>
      </div>
      <br />
      {!props.form.options.autoSlug ? (
        <React.Fragment>
          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              props.handleChange({
                target: {
                  name: "options_title",
                  value: !props.form.options.title
                }
              })
            }
          >
            <span className="icolab">Content Title </span>
            <i className="material-icons">
              {props.form.options.title
                ? "check_box"
                : "check_box_outline_blank"}
            </i>
          </div>
          <br />
        </React.Fragment>
      ) : null}
      {!props.form.options.title ? (
        <React.Fragment>
          <div
            style={{ cursor: "pointer" }}
            onClick={() =>
              props.handleChange({
                target: {
                  name: "options_autoSlug",
                  value: !props.form.options.autoSlug
                }
              })
            }
          >
            <span className="icolab">Slug </span>
            <i className="material-icons">
              {props.form.options.autoSlug
                ? "check_box"
                : "check_box_outline_blank"}
            </i>
          </div>
          <br />
        </React.Fragment>
      ) : null}
    </div>
  );
};

export default ShortTextOptions;
