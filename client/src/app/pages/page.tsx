"use client";
/*
  path : client/src/components/main/Actions.tsx
*/
import { useState, useEffect } from "react";

import { User } from "../../redux/models/user.model";
import { useGetUsersQuery } from "../../redux/services/users";

import { useDispatch } from "react-redux";
import { setUser } from "../../redux/features/userSlice";

// components
import AddUserButton from "../../components/main/AddUserButton";
import SearchBar from "../../components/main/SearchBar";
import TableHead from "../../components/main/TableHead";
import Modal from "../../components/main/model/Modal";
import TableBody from "../../components/main/TableBody";
import NoUserFound from "../../components/main/NoUserFound";
import ErrorFetch from "../../components/main/ErrorFetch";
import NoUserMatch from "../../components/main/NoUserMatch";

//loader spinner
import HashLoader from "react-spinners/HashLoader";

const Page = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filterCriteria, setFilterCriteria] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[] | undefined>([]); // filtered users we get from search bar

  // fetch data from redux store
  const { data: users, isLoading, isError } = useGetUsersQuery(); // RTK query

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [isLoading]);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);


  useEffect(() => {
    if (!users || !Array.isArray(users)) {
      // Handle the case when users is undefined or not an array
      setFilteredUsers([]);
      return;
    }

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
            Array.isArray(users) &&
            !loading &&
            !isError &&
            (filteredUsers?.length !== 0 ? (
              filteredUsers?.map((user) => (
                <TableBody key={user.id} user={user} openModal={openModal} />
              ))
            ) : (
              <NoUserMatch />
            ))}
          {!loading && isError && <ErrorFetch />}
          {!loading && !isError && users && !Array.isArray(users) && (
            <NoUserFound />
          )}
        </tbody>
      </table>
      {/* Modal */}
      {isModalOpen && <Modal closeModal={closeModal} />}
    </div>
  );
};
export default Page;
