import { IoMdPersonAdd } from "react-icons/io";

// to dispatch action to set it to "Add"
import { useDispatch } from "react-redux";

// setActionType is a function that takes an object as an argument
import { setActionType } from "../../redux/features/ActionTypeSlice";

type Props = {
  openModal: () => void;
};

const AddUserButton = ({ openModal }: Props) => {
  const dispatch = useDispatch();

  return (
    <div className="self-end">
      <button
        className="addUserBtn"
        onClick={() => {
          openModal();
          dispatch(
            setActionType({
              value: "Add",
            })
          );
        }}
        data-testid="add-user-btn"
      >
        <IoMdPersonAdd size={21} className="text-black" />
        <span className="ps-2 text-black">Add user</span>
      </button>
    </div>
  );
};

export default AddUserButton;
