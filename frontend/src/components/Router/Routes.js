import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "../Dashboard/Dashboard";
import Login from "../Login/Login";
import PrivateRoute from "../PrivateRoute/PrivateRoute";
import PastApplications from "../Forms/PastApplications";
import CheckLeaves from "../Forms/CheckLeaves";
import Dates from "../Forms/Dates";
import ApplyLeaveComponent from "../Forms/ApplyLeaveComponent";
import UpdateLeave from "../Forms/OfficePortal";
import LeavePDFModals from "../Forms/LeavePDFModals";
import LeavePDFModalsNonCasual from "../Forms/LeavePDFModals2";
import PGLeavePdfModal from "../Forms/PGpdf";
import { useAuth } from "../../contexts/AuthContext";
import Sidebar from "../Sidebar/Sidebar";
import TopNavbar from "../Sidebar/TopNavbar";

const Paths = (props) => {
  const { currentUser } = useAuth();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<PrivateRoute user={["all"]} toast={props.toast} />}
        >
          <Route
            path="/"
            element={
              <div className="flex-row min-h-screen bg-blue-gray-50/50">
                <Sidebar />
                <div className="p-4 xl:ml-80">
                  <TopNavbar />
                  <Dashboard toast={props.toast} />
                </div>
              </div>
            }
          />
        </Route>
        <Route
          path="/navigate/applyleave"
          element={
            <PrivateRoute
              user={["admin", "hod", "faculty", "pg"]}
              toast={props.toast}
            />
          }
        >
          <Route
            path="/navigate/applyleave"
            element={
              <div className="flex-row min-h-screen bg-blue-gray-50/50">
                <Sidebar />
                <div className="p-4 xl:ml-80">
                  <TopNavbar />
                  <ApplyLeaveComponent toast={props.toast} />
                </div>
              </div>
            }
          />
        </Route>
        <Route
          path="/navigate/updateleave"
          element={
            <PrivateRoute user={["admin", "office"]} toast={props.toast} />
          }
        >
          <Route
            path="/navigate/updateleave"
            element={
              <div className="flex-row min-h-screen bg-blue-gray-50/50">
                <Sidebar />
                <div className="p-4 xl:ml-80">
                  <TopNavbar />
                  <UpdateLeave toast={props.toast} />
                </div>
              </div>
            }
          />
        </Route>
        <Route
          path="/navigate/pastapplications"
          element={<PrivateRoute user={["all"]} toast={props.toast} />}
        >
          <Route
            path="/navigate/pastapplications"
            element={
              <div className="flex-row min-h-screen bg-blue-gray-50/50">
                <Sidebar />
                <div className="p-4 xl:ml-80">
                  <TopNavbar />
                  <PastApplications toast={props.toast} />
                </div>
              </div>
            }
          />
        </Route>
        <Route
          path="/check_applications/casual/:id"
          element={<PrivateRoute user={["all"]} toast={props.toast} />}
        >
          <Route
            path="/check_applications/casual/:id"
            element={
              <div className="flex-row min-h-screen bg-blue-gray-50/50">
                <Sidebar />
                <div className="p-4 xl:ml-80">
                  <TopNavbar />
                  <LeavePDFModals
                    toast={props.toast}
                    from="check_applications"
                  />
                </div>
              </div>
            }
          ></Route>
        </Route>

        <Route
          path="/past_applications/casual/:id"
          element={<PrivateRoute user={["all"]} toast={props.toast} />}
        >
          <Route
            path="/past_applications/casual/:id"
            element={
              <div className="flex-row min-h-screen bg-blue-gray-50/50">
                <Sidebar />
                <div className="p-4 xl:ml-80">
                  <TopNavbar />
                  <LeavePDFModals
                    toast={props.toast}
                    from="past_applications"
                  />
                </div>
              </div>
            }
          ></Route>
        </Route>
        <Route
          path="/past_applications/pg_applications/:id"
          element={<PrivateRoute user={["all"]} toast={props.toast} />}
        >
          <Route
            path="/past_applications/pg_applications/:id"
            element={
              <div className="flex-row min-h-screen bg-blue-gray-50/50">
                <Sidebar />
                <div className="p-4 xl:ml-80">
                  <TopNavbar />
                  <PGLeavePdfModal
                    toast={props.toast}
                    from="past_applications"
                  />
                </div>
              </div>
            }
          ></Route>
        </Route>
        <Route
          path="/check_applications/pg_applications/:id"
          element={<PrivateRoute user={["all"]} toast={props.toast} />}
        >
          <Route
            path="/check_applications/pg_applications/:id"
            element={
              <div className="flex-row min-h-screen bg-blue-gray-50/50">
                <Sidebar />
                <div className="p-4 xl:ml-80">
                  <TopNavbar />
                  <PGLeavePdfModal
                    toast={props.toast}
                    from="check_applications"
                  />
                </div>
              </div>
            }
          ></Route>
        </Route>
        <Route
          path="/check_applications/non_casual/:id"
          element={<PrivateRoute user={["all"]} toast={props.toast} />}
        >
          <Route
            path="/check_applications/non_casual/:id"
            element={
              <div className="flex-row min-h-screen bg-blue-gray-50/50">
                <Sidebar />
                <div className="p-4 xl:ml-80">
                  <TopNavbar />
                  <LeavePDFModalsNonCasual
                    toast={props.toast}
                    from="check_applications"
                  />
                </div>
              </div>
            }
          ></Route>
        </Route>

        <Route
          path="/past_applications/non_casual/:id"
          element={<PrivateRoute user={["all"]} toast={props.toast} />}
        >
          <Route
            path="/past_applications/non_casual/:id"
            element={
              <div className="flex-row min-h-screen bg-blue-gray-50/50">
                <Sidebar />
                <div className="p-4 xl:ml-80">
                  <TopNavbar />
                  <LeavePDFModalsNonCasual
                    toast={props.toast}
                    from="past_applications"
                  />
                </div>
              </div>
            }
          ></Route>
        </Route>

        <Route
          path="/navigate/dates"
          element={<PrivateRoute user={["admin"]} toast={props.toast} />}
        >
          <Route
            path="/navigate/dates"
            element={
              <div className="flex-row min-h-screen bg-blue-gray-50/50">
                <Sidebar />
                <div className="p-4 xl:ml-80">
                  <TopNavbar />
                  <Dates toast={props.toast} />
                </div>
              </div>
            }
          />
        </Route>
        <Route
          path="/navigate/checkapplications"
          element={
            <PrivateRoute
              user={["admin", "faculty", "hod", "dean", "office", "registrar", "ar", "dr", "supdt"]}
              toast={props.toast}
            />
          }
        >
          <Route
            path="/navigate/checkapplications"
            element={
              <div className="flex-row min-h-screen bg-blue-gray-50/50">
                <Sidebar />
                <div className="p-4 xl:ml-80">
                  <TopNavbar />
                  <CheckLeaves toast={props.toast} />
                </div>
              </div>
            }
          />
        </Route>
        <Route path="/login" element={<Login toast={props.toast} />} />
      </Routes>
    </>
  );
};

export default Paths;
