import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import Page from "../../../src/app/pages/page";
import {
  useGetUsersQuery,
  useAddUserMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} from "../../../src/redux/services/users";
import { Provider } from "react-redux";
import { store } from "../../../src/redux/store";

jest.mock("../../../src/redux/services/users");

const MocPage = () => {
  return (
    <Provider store={store}>
      <Page />
    </Provider>
  );
};

describe("Main ", () => {
  beforeEach(() => {
    (useGetUsersQuery as jest.Mock).mockClear();
    (useAddUserMutation as jest.Mock).mockClear();
    (useDeleteUserMutation as jest.Mock).mockClear();
    (useUpdateUserMutation as jest.Mock).mockClear();

    const mockData = [
      {
        id: 1,
        name: "Jhon Doe",
        email: "test@gmail.com",
        position: "test",
        verified: true,
      },
      {
        id: 2,
        name: "Hassan",
        email: "tettttt@yahoo.com",
        position: "react developer",
        verified: true,
      },
    ];

    (useGetUsersQuery as jest.Mock).mockReturnValue({
      data: mockData,
      isLoading: false,
      isSucces: true,
      isError: false,
      error: null,
    });

    // define all the mutation functions it's required to render the page
    (useAddUserMutation as jest.Mock).mockReturnValue([
      jest.fn(),
      { isLoading: false },
    ]);
    (useDeleteUserMutation as jest.Mock).mockReturnValue([
      jest.fn(),
      { isLoading: false },
    ]);
    (useUpdateUserMutation as jest.Mock).mockReturnValue([
      jest.fn(),
      { isLoading: false },
    ]);

    render(<MocPage />);
  });

  // ---------------------------------------------------------------------------------------------

  it("should render the main page", async () => {
    // check if the table head is rendered
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument(); // verified
    expect(screen.getByText("Position")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument(); // delete and edit

    // check if the value is rendered
    expect(screen.getByText("Jhon Doe")).toBeInTheDocument(); // user1
    expect(screen.getByText("Hassan")).toBeInTheDocument(); // user2

    //make sure the loading spinner is not rendered
    expect(screen.queryByTestId("loader")).not.toBeInTheDocument();

    // make sure the error message is not rendered
    expect(screen.queryByTestId("error")).not.toBeInTheDocument();

    // make sure the no user found message is not rendered
    expect(screen.queryByTestId("no-user")).not.toBeInTheDocument();

    // make sure the no match message is not rendered
    expect(screen.queryByTestId("no-match")).not.toBeInTheDocument();
  });

  // ---------------------------------------------------------------------------------------------

  //   it("should render the loading spinner", async () => { // put the loading to true

  //     // make sure the loading spinner is not rendered
  //     expect(screen.queryByTestId("loader")).toBeInTheDocument();

  //     // make sure the error message is not rendered
  //     expect(screen.queryByTestId("error")).not.toBeInTheDocument();
  //   });

  // ---------------------------------------------------------------------------------------------

  //   it("should render the error message", async () => { // put the error to true
  //     // make sure the loading spinner is not rendered
  //     expect(screen.queryByTestId("loader")).not.toBeInTheDocument();

  //     // make sure the error message is not rendered
  //     expect(screen.queryByTestId("error")).toBeInTheDocument();
  //   });

  // ---------------------------------------------------------------------------------------------

  //   it("should render the no user found message", async () => { // put the users to {}
  //     // make sure the loading spinner is not rendered
  //     expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
  //     // make sure the error message is not rendered
  //     expect(screen.queryByTestId("error")).not.toBeInTheDocument();

  //     // make sure the no user found message is rendered
  //     expect(screen.queryByTestId("no-user")).toBeInTheDocument();
  //   });

  // ---------------------------------------------------------------------------------------------

  it("should render the no match message", async () => {
    // put the filterCriteria to "test"
    const searchInput = screen.getByTestId("search-input");
    fireEvent.change(searchInput, { target: { value: "test" } });
    // make sure the loading spinner is not rendered
    expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
    // make sure the error message is not rendered
    expect(screen.queryByTestId("error")).not.toBeInTheDocument();

    // make sure the no user found message is rendered
    expect(screen.queryByTestId("no-match")).toBeInTheDocument();
  });

});
