import React from "react";
import EditAppForm from "../../Forms/Apps/editApp";
import NewAppForm from "../../Forms/Apps/newApp";
import NewApiKeyForm from "../../Forms/Apps/newApiKey";
import EditApiKeyForm from "../../Forms/Apps/editApiKey";
import NewTypeForm from "../../Forms/ContentTypes/newType";
import NewFieldForm from "../../Forms/Fields/newField";
import EditFieldForm from "../../Forms/Fields/editField";
import NewContentForm from "../../Forms/Content/newContent";
import ScheduleForm from "../../Forms/Content/schedule";
import ConfirmDeleteForm from "../../Forms/confirmDelete";
import ConfirmActionForm from "../../Forms/confirmAction";
import EditFieldOptionValuesForm from "../../Forms/Fields/editOptionValues";
import MsgAlert from "../../Forms/msgAlert";
import { ResetPasswordForm } from "../../Forms/resetPassword";
import UploadAssetForm from "../../Forms/Assets/upload";
import EditAssetForm from "../../Forms/Assets/editAsset";
import SelectAssetForm from "../../Forms/Assets/selectAsset";
import shallow from "zustand/shallow";
import usePageStore from "../../../stores/usePageStore";

const Content = props => {
  const modalComp = usePageStore(state => state.modalComp);
  switch (modalComp) {
    case "newappform":
      return <NewAppForm {...props} />;
    case "editappform":
      return <EditAppForm {...props} />;
    case "newapikeyform":
      return <NewApiKeyForm {...props} />;
    case "editapikeyform":
      return <EditApiKeyForm {...props} />;
    case "newtypeform":
      return <NewTypeForm {...props} />;
    case "newfieldform":
      return <NewFieldForm {...props} />;
    case "editfieldform":
      return <EditFieldForm {...props} />;
    case "newcontentform":
      return <NewContentForm {...props} />;
    case "scheduleform":
      return <ScheduleForm {...props} />;
    case "confirmdeleteform":
      return <ConfirmDeleteForm {...props} />;
    case "confirmactionform":
      return <ConfirmActionForm {...props} />;
    case "editfieldoptionvaluesform":
      return <EditFieldOptionValuesForm {...props} />;
    case "msgalert":
      return <MsgAlert {...props} />;
    case "resetpasswordform":
      return <ResetPasswordForm {...props} />;
    case "uploadassetform":
      return <UploadAssetForm {...props} />;
    case "editassetform":
      return <EditAssetForm {...props} />;
    case "selectassetform":
      return <SelectAssetForm {...props} />;
    default:
      return <h2>Form</h2>;
  }
};

const Modal = props => {
  const [isShow, handleCloseModal] = usePageStore(
    state => [state.showModal, state.handleCloseModal],
    shallow
  );
  const showStyle = {
    opacity: 100,
    top: "50px"
  };
  const style = isShow ? showStyle : {};

  return (
    <div id="modal" style={style}>
      <i onClick={handleCloseModal} id="hidformexit" className="material-icons">
        clear
      </i>
      <br />
      <Content />
    </div>
  );
};

export { Modal, Content };
