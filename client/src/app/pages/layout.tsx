"use client";

import Navbar from "../../components/navBar/Navbar";
import { Provider } from "react-redux";
import { store } from "../../redux/store";
import { Toaster } from "react-hot-toast";

const page = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-mainColor">
      <Navbar />
      <Provider store={store}>{children}</Provider>
      <Toaster
        position="bottom-center"
        reverseOrder={false} // new toast at bottom
        gutter={8}
        toastOptions={{
          className: "",
          duration: 3000,
          style: {
            background: "black",
            color: "#fff",
          },
        }}
      />
    </div>
  );
};

export default page;
