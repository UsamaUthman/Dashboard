/*
  path : client/src/components/main/model/SubmitButton.tsx
*/
import { useSelector } from "react-redux";

// selectActionType is a function returns the state "Add" or "Edit"
import { selectActionType } from "../../../redux/features/ActionTypeSlice";

// userAddMutation is a function that takes an object as an argument
import { useAddUserMutation } from "../../../redux/services/users";

// user model
import { User } from "../../../redux/models/user.model";

import { toast } from "react-hot-toast";

//spinner icon
import { FaSpinner } from "react-icons/fa";

type Props = {
  inputs: User;
  closeModal: () => void;
  formState: any;
};

const SubmitButton = ({ closeModal, inputs, formState }: Props) => {
  const actionType = useSelector(selectActionType);

  // distructure the mutation function
  const [addUser, { isLoading }] = useAddUserMutation();

  console.log(formState.isValid);

  const handleEditUser = async () => {
    // Edit user using RTK query
    toast.success("User updated successfully");
    closeModal();
  };

  const handleAddUser = async () => {
    // Add user using RTK query
    try {
      const res = await addUser(inputs);
      console.log(res);
      if (res && !isLoading) {
        toast.success("User added successfully");
        closeModal();
      }
    } catch (err) {
      console.log(err);
    } finally {
      closeModal();
    }
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
      {isLoading ? (
        <FaSpinner className="animate-spin" />
      ) : actionType === "Add" ? (
        "Add user"
      ) : (
        "Edit user"
      )}{" "}
    </button>
  );
};

export default SubmitButton;
