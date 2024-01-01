const NoUserMatch = () => {
  return (
    <tr>
      <td colSpan={6} className="py-4">
        <div className="flex justify-center items-center">
          <p className="text-red-500 text-lg font-semibold">
            No User Match the search criteria
          </p>
        </div>
      </td>
    </tr>
  );
};

export default NoUserMatch;
