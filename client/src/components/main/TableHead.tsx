import React from "react";

const TableHead = () => {
  const itemsList: { name: string }[] = [
    {
      name: "Name",
    },
    {
      name: "Position",
    },
    {
      name: "Status",
    },
    {
      name: "Action",
    },
  ];

  return (
    <tr>
      {itemsList.map((item, index) => (
        <th scope="col" className="px-6 py-3 w-1/4" key={index}>
          {item.name}
        </th>
      ))}
    </tr>
  );
};

export default TableHead;
