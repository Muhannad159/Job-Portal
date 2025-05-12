import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <>
      <div className="grid-background"></div>
      <main className="min-h-screen ">
        <Header />

        <Outlet />
      </main>
      <div className="p-3 mt-2 text-center bg-blue-600 ">
        Made for the future.
      </div>
    </>
  );
};

export default AppLayout;
