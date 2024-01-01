"use client";
/*
  path : client/src/components/main/Actions.tsx
*/
import { useState, useEffect } from "react";

import { useGetUsersQuery } from "../../redux/services/users";
import { User } from "../../redux/models/user.model";

import { useDispatch } from "react-redux";


import { setUser } from "../../redux/features/userSlice";

//loader spinner
import HashLoader from "react-spinners/HashLoader";

// components
import AddUserButton from "../../components/main/AddUserButton";
import SearchBar from "../../components/main/SearchBar";
import TableHead from "../../components/main/TableHead";
import Modal from "../../components/main/model/Modal";
import TableBody from "../..//components/main/TableBody";

const Page = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // fetch data from redux store
  const { data: users, isLoading, isError } = useGetUsersQuery();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(isLoading);
    }, 1000);
  }, [users]);

  const dispatch = useDispatch();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    dispatch(setUser({} as User));
  };

  return (
    <div className="relative overflow-x-auto p-2 shadow-lg sm:rounded-lg">
      <div className="flex items-center justify-between md:justify-around flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 p-4 bg-whiteColor rounded-t-lg min-w-[550px] ">
        <AddUserButton openModal={openModal} />
        <SearchBar />
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 min-w-[550px]">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <TableHead />
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan={6} className="py-4">
                <div className="flex justify-center items-center">
                  <HashLoader color="#142270" size={40} />
                </div>
              </td>
            </tr>
          )}
          {users && !loading && !isError &&
            users?.map((user: User) => (
              <TableBody key={user.id} openModal={openModal} user={user} />
            ))}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && <Modal closeModal={closeModal} />}
    </div>
  );
};

export default Page;
