import { useState, ChangeEvent } from "react";

// import a user schema
import { User } from "../../redux/models/user.model";

/*
 User{
   id: number;
   name: string;
   email: string;
   position: string;
   verified: boolean;
 }
*/

type Props = {
  initialValues: User;
};

const useForm = ({ initialValues }: Props) => {
  const [inputs, setInputs] = useState<User>(initialValues);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;

    setInputs((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };


  return {
    inputs,
    handleChange,
  };
};

export default useForm;
