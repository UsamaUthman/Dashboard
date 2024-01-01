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
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filterCriteria, setFilterCriteria] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[] | undefined>([]); // filtered users we get from search bar

  // fetch data from redux store
  const { data: users, isLoading, isError } = useGetUsersQuery(); // RTK query

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [isLoading]);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  useEffect(() => {
    const filtered = users?.filter((user) => {
      // Customize the filtering logic based on your needs
      const fullName = `${user.name}`.toLowerCase();
      return fullName.includes(filterCriteria.toLowerCase());
    });

    setFilteredUsers(filtered);
  }, [users, filterCriteria]);

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
        <SearchBar onInputChange={setFilterCriteria} />
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
          {users &&
            !loading &&
            !isError &&
            (filteredUsers?.length !== 0 ? (
              filteredUsers?.map((user) => (
                <TableBody key={user.id} user={user} openModal={openModal} />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-4">
                  <div className="flex justify-center items-center">
                    <p className="text-red-500 text-lg font-semibold">
                      No User Found in the database
                    </p>
                  </div>
                </td>
              </tr>
            ))}

          {!loading && isError && (
            <tr>
              <td colSpan={6} className="py-4">
                <div className="flex justify-center items-center">
                  <p className="text-red-500 text-lg font-semibold">
                    Error while fetching data
                  </p>
                </div>
              </td>
            </tr>
          )}

          {!loading && !isError && users?.length === 0 && (
            <tr>
              <td colSpan={6} className="py-4">
                <div className="flex justify-center items-center">
                  <p className="text-red-500 text-lg font-semibold">
                    No User Found in the database
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal */}
      {isModalOpen && <Modal closeModal={closeModal} />}
    </div>
  );
};

export default Page;
