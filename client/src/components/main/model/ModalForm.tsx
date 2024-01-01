/*
  path : client/src/components/main/model/ModalForm.tsx
*/

// select the current user to make changes to it if there is any
import { selectUser } from "../../../redux/features/userSlice";
import { useSelector } from "react-redux";


// import a user schema
import { User } from "../../../redux/models/user.model";

// component button to modal form
import SubmitButton from "./SubmitButton";

// custom hook to handle form inputs
import usrFormChange from "../../hooks/useFormChange";

// form validation
import { useFormWithValidation } from "../../hooks/useFormWithValidation";

type Props = {
  closeModal: () => void;
};

const ModalForm = ({ closeModal }: Props) => {
  const globalUser = useSelector(selectUser);
  const { handleChange, inputs } = usrFormChange({
    initialValues: globalUser,
  });
  /*
   we can also make a change directly to the global user state but there is a problem with that
   if we change the global user state directly on every change in the input field ,
    that will cause a re-render on every change (in prodection that will be a problem beacasue we will re render all queries in the redux store and redux system will be slow or even crash)
   1- we can solve that by using a a callback function in like (debounce) and that will cause a delay in the change of the global user state,
    (when i start writing a letter in the input field it will not change the global user state until i stop writing for "x" seconds) and that will solve the problem
    
   2- we can solve that by using a local state for the user and when we click on the submit button we will change the global user state with the local user state

   *-- i prefer the second solution because it's more simple in this case we don't have a lots of featch requests for now so we can use the second solution --*
  */
  const { register, handleSubmit, formState, errors } = useFormWithValidation();

  return (
    <form className="p-4 md:p-5" onSubmit={handleSubmit(() => {})}>
      <div className="grid gap-4 mb-4 grid-cols-2">
        <div className="col-span-2">
          <label htmlFor="name" className="formLabel">
            Name
          </label>
          <input
            {...register("name")}
            type="text"
            name="name"
            id="name"
            value={inputs.name || ""}
            className="formInput"
            placeholder={globalUser.name || "Your name"}
            autoComplete="no-password"
            onChange={handleChange}
          />
          {errors.name && (
            <div className="text-red-500 text-xs">{errors.name?.message}</div>
          )}
        </div>
        <div className="col-span-2">
          <label htmlFor="email" className="formLabel">
            Email
          </label>
          <input
            {...register("email")}
            type="text"
            name="email"
            id="email"
            value={inputs.email || ""}
            className="formInput"
            placeholder={globalUser.email || "Your email"}
            autoComplete="no-password"
            onChange={handleChange}
          />
          {errors.email && (
            <div className="text-red-500 text-xs">{errors.email?.message}</div>
          )}
        </div>
        <div className="flex justify-between w-full gap-4 col-span-2">
          <div className="w-2/3">
            <label htmlFor="position" className="formLabel">
              Position
            </label>
            <input
              {...register("position")}
              type="text"
              name="position"
              id="position"
              value={inputs.position || ""}
              className="formInput"
              placeholder={globalUser.position || "Your position"}
              autoComplete="no-password"
              onChange={handleChange}
            />
            {errors.position && (
              <div className="text-red-500 text-xs">
                {errors.position?.message}
              </div>
            )}
          </div>
          <div className="w-1/3 flex items-center justify-center">
            {!globalUser.verified && (
              <>
                <input
                  name="verified"
                  id="verified"
                  type="checkbox"
                  className="formCheckbox"
                  onChange={handleChange}
                />
                <label
                  htmlFor="verified"
                  className="ms-2 text-sm font-medium text-gray-900"
                >
                  Verified state
                </label>
              </>
            )}
            {globalUser.verified && (
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-green-500 font-semibold">Verified</h1>
                <p className="text-xs text-gray-500 text-center">
                  You can't change this field if the user is verified
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <SubmitButton
        closeModal={closeModal}
        inputs={inputs}
        formState={formState}
      />
    </form>
  );
};

export default ModalForm;
