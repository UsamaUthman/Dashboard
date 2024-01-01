/*
  path : client/src/components/main/Actions.tsx
*/

// icons
import { AiFillDelete } from "react-icons/ai";
import { FaUserEdit } from "react-icons/fa";

// to dispatch action to set it to "Edit"
import { useDispatch, useSelector } from "react-redux";

// setActionType is a function that takes an object as an argument
import { setActionType } from "../../redux/features/ActionTypeSlice";

// selectUser is a function that takes the state as an argument
import { selectUser, setUser } from "../../redux/features/userSlice";

// delete user mutation
import { useDeleteUserMutation } from "../../redux/services/users";

// user model
import { User } from "../../redux/models/user.model";

// react hot toast
import toast from "react-hot-toast";

type Props = {
  user: User;
  openModal: () => void;
};

const Actions = ({ openModal, user }: Props) => {
  const dispatch = useDispatch();

  // distructure the mutation function
  const [deleteUser, { isLoading }] = useDeleteUserMutation();
  const handleDeleteUser = async () => {
    try {
      const res = await deleteUser(user);
      if (res && !isLoading) {
        toast.success("User deleted successfully");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex gap-6">
      <FaUserEdit
        size={21}
        className="text-blue-600 hover:underline cursor-pointer"
        onClick={() => {
          openModal();
          dispatch(
            setActionType({
              // dispatch action to set it to "Edit"
              value: "Edit",
            })
          );
          dispatch(setUser(user)); // dispatch action to set the current user to the user that we want to edit
        }}
      />
      <AiFillDelete
        size={21}
        className="text-red-600 hover:underline cursor-pointer"
        onClick={() => {
          handleDeleteUser();
        }}
      />
    </div>
  );
};

export default Actions;
