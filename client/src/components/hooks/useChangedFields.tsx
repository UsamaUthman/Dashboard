/*
 path : client/src/components/hooks/useChangedFields.tsx
*/

import { useSelector } from "react-redux";
// Redux
import { selectUser } from "../../redux/features/userSlice";

// User model
import { User } from "../../redux/models/user.model";

export const useGetChangedFields = (): ((inputs: User) => User) => {
  const globalUser = useSelector(selectUser);

  // Return the function to get changed fields
  return (inputs: User): User => {
    const changedFields = {} as User;

    if (inputs.name !== globalUser.name) changedFields.name = inputs.name;
    if (inputs.email !== globalUser.email) changedFields.email = inputs.email;
    if (inputs.position !== globalUser.position)
      changedFields.position = inputs.position;
    if (inputs.verified !== globalUser.verified)
      changedFields.verified = inputs.verified;

    return changedFields;
  };
};
