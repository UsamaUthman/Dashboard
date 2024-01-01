/*
  path : client/src/components/main/model/SubmitButton.tsx
*/
import { useSelector } from "react-redux";

// selectActionType is a function returns the state "Add" or "Edit"
import { selectActionType } from "../../../redux/features/ActionTypeSlice";

// user model
import { User } from "../../../redux/models/user.model";

import { toast } from "react-hot-toast";

type Props = {
  inputs: User;
  closeModal: () => void;
  formState: any;
};

const SubmitButton = ({ closeModal, inputs, formState }: Props) => {
  const actionType = useSelector(selectActionType);

  console.log(formState.isValid);

  const handleEditUser = async () => {
    // Edit user using RTK query
    toast.success("User updated successfully");
    closeModal();
  };

  const handleAddUser = async () => {
    // Add user using RTK query
    toast.success("User added successfully");
    closeModal();
  };

  const submitFunction = actionType === "Add" ? handleAddUser : handleEditUser;

  return (
    <button
      type="submit"
      className="formBtn"
      onClick={() => {
        if (formState.isValid) submitFunction();
        else toast.error("Please fill all the fields");
      }}
    >
      {actionType === "Add" ? "Add user" : "Edit user"}
    </button>
  );
};

export default SubmitButton;
