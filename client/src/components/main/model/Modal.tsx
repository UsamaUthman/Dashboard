"use client";
/* 
  path : client/src/components/main/model/Modal.tsx
*/
import { useSelector } from "react-redux"; // hooks from react-redux
import { selectActionType } from "../../../redux/features/ActionTypeSlice"; // action type slice

// components
import ModalForm from "./ModalForm";

// user model interface
import { User } from "@/redux/models/user.model";

// icons
import { AiOutlineClose } from "react-icons/ai";

type Props = {
  closeModal: () => void;
};

const Modal = ({ closeModal }: Props) => {
  const actionType = useSelector(selectActionType);

  return (
    <div
      className="fixed bg-black bg-opacity-60 top-0 left-0 right-0 bottom-0 z-50 flex justify-center items-center"
      onClick={closeModal}
    >
      <div
        onClick={(event) => event.stopPropagation()}
        className="w-[600px] max-w-full min-h-[400px] bg-whiteColor rounded-xl p-4 flex flex-col relative"
      >
        <AiOutlineClose
          className="absolute right-6 top-6 text-3xl text-red-600 cursor-pointer"
          onClick={closeModal}
        />
        {actionType === "" ? (
          <div className="w-full h-[300px] flex justify-center items-center">
            <h1 className="h1Error ">
              Please select an action to add or edit user
            </h1>
          </div>
        ) : (
          <>
            {/* modal title  */}
            <h1 className="text-2xl font-bold ">
              {actionType === "Add" ? "Add new user" : "Edit user"}
            </h1>
            {/*  Modal body */}
            <ModalForm closeModal={closeModal} />
          </>
        )}
      </div>
    </div>
  );
};

export default Modal;
