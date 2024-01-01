import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

export const useFormWithValidation = () => {
  // Define your validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required("Name is required")
      .min(2, "Name is too short"),
    email: Yup.string()
      .required("Email is required")
      .email("Email is invalid")
      .test("email", "Email is invalid", (value) => {
        const regex = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
        return regex.test(value);
      }),
    position: Yup.string().required("Position is required"),
  });

  // Use the useForm hook within the custom hook
  const { register, handleSubmit, formState } = useForm({
    resolver: yupResolver(validationSchema),
  });

  // Return the relevant data and functions needed in the component
  return {
    register,
    handleSubmit,
    formState,
    errors: formState.errors,
  };
};
