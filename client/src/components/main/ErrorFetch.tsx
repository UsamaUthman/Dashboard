/*
    path : client/src/components/main/TableBody.tsx
*/
const ErrorFetch = () => {
  return (
    <tr>
      <td colSpan={6} className="py-4">
        <div className="flex justify-center items-center">
          <p className="text-red-500 text-lg font-semibold" data-testid="error">
            Error while fetching data
          </p>
        </div>
      </td>
    </tr>
  );
};

export default ErrorFetch;
