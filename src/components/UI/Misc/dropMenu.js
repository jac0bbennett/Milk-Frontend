import React, { useState, useEffect, useRef } from "react";

const DropMenu = props => {
  const [showMenu, setShowMenu] = useState(false);
  const moreOptions = useRef(null);

  const handleClickOutsideMore = event => {
    if (moreOptions && !moreOptions.current.contains(event.target)) {
      setShowMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideMore);
    return () => document.removeEventListener("click", handleClickOutsideMore);
  }, []);

  return (
    <div ref={moreOptions}>
      <button
        className="flatbut darkflatbutton"
        onClick={event => {
          event.preventDefault();
          setShowMenu(!showMenu);
        }}
        style={{
          padding: "0px",
          width: "30px",
          marginLeft: "5px"
        }}
      >
        <i className="material-icons" style={{ fontSize: "21px" }}>
          more_vert
        </i>
      </button>
      {showMenu ? (
        <div className="dropmenuoptions">
          <ul>{props.children}</ul>
        </div>
      ) : null}
    </div>
  );
};

export default DropMenu;
