import Actions from "./Actions";

import { User } from "../../redux/models/user.model";

type Props = {
  user: User;
  openModal: () => void
};

const TableBody = ({ openModal , user  }: Props) => {
  return (
    <tr className="bg-whiteColor border-b hover:bg-gray-50">
      <th
        scope="row"
        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap"
      >
        <div className="">
          <div className="text-base font-semibold">{user.name}</div>
          <div className="font-normal text-gray-500">{user.email}</div>
        </div>
      </th>
      <td className="px-6 py-4">{user.position}</td>
      <td className="px-6 py-4">
        <div className="flex items-center">
          {/* <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>{" "}
           verified */}
          {user.verified ? (
            <>
              <div className="h-2.5 w-2.5 rounded-full bg-green-500 me-2"></div>{" "}
              verified
            </>
          ) : (
            <>
              <div className="h-2.5 w-2.5 rounded-full bg-red-500 me-2"></div>{" "}
              not verified
            </>
          )}
        </div>
      </td>
      <td className="px-6 py-4">
        <Actions openModal={openModal}  user={user} />
      </td>
    </tr>
  );
};

export default TableBody;
