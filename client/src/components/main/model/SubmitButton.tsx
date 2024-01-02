/*
  path : client/src/components/main/model/SubmitButton.tsx
*/
import { useSelector } from "react-redux";

// selectActionType is a function returns the state "Add" or "Edit"
import { selectActionType } from "../../../redux/features/ActionTypeSlice";

// userAddMutation is a function that takes an object as an argument
import {
  useAddUserMutation,
  useUpdateUserMutation,
} from "../../../redux/services/users";

// custom hook to handle form inputs
import { useGetChangedFields } from "../../hooks/useChangedFields";

// user model
import { User } from "../../../redux/models/user.model";

import { toast } from "react-hot-toast";

//spinner icon
import { FaSpinner } from "react-icons/fa";
import { useEffect, useState } from "react";

type Props = {
  inputs: User;
  closeModal: () => void;
  formState: any;
};

const SubmitButton = ({ closeModal, inputs, formState }: Props) => {
  // Local state to track the form validity
  const [isFormValid, setIsFormValid] = useState(formState.isValid);

  useEffect(() => {
    setIsFormValid(formState.isValid);
  }, [formState.isValid]);

  const actionType = useSelector(selectActionType);

  // distructure the mutation function
  const [addUser, { isLoading, error, isError }] = useAddUserMutation();
  const [updateUser, { isLoading: isEditLoading, status }] =
    useUpdateUserMutation();

  // function to return jsut the changed fields
  const getChangedFields = useGetChangedFields();

  const handleEditUser = async () => {
    // Edit user using RTK query
    const changedFields = getChangedFields(inputs);
    try {
      const res: any = await updateUser({
        id: inputs.id,
        body: changedFields,
      });
      console.log(res);
      if (res.data?.status === "204" && !isEditLoading) {
        toast.success("User updated successfully");
        closeModal();
      } else if (res.error === 409 && !isEditLoading) {
        toast.error("User already exists");
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    }
  };

  const handleAddUser = async () => {
    // Add user using RTK query
    try {
      const res: any = await addUser(inputs);
      console.log(res.error === 409);
      if (res.data?.status === "201" && !isLoading) {
        toast.success("User added successfully");
        closeModal();
      } else if (res.error === 409) {
        toast.error("User already exists");
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const submitFunction = actionType === "Add" ? handleAddUser : handleEditUser;

  return (
    <button
      type="submit"
      className="formBtn"
      onClick={() => {
        if (isFormValid) submitFunction();
        else toast.error("Please fill all the fields");
      }}
    >
      {isLoading || isEditLoading ? (
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
