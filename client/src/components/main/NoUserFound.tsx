/*
    path : client/src/components/main/TableBody.tsx
*/
const NoUserFound = () => {
  return (
    <tr>
      <td colSpan={6} className="py-4">
        <div className="flex justify-center items-center">
          <p className="text-red-500 text-lg font-semibold">
            No User Found in the database
          </p>
        </div>
      </td>
    </tr>
  );
};

export default NoUserFound;
