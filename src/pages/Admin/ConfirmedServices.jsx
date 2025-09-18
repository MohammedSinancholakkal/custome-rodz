import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import {
  deleteConfirmedServicesApi,
  getConfirmedServicesApi,
} from "../../Services/allApi";
import 'react-toastify/dist/ReactToastify.css';


function ConfirmedServices() {



  const [confirmedServices, setConfirmedServices] = useState([]);




  // get confirmed services

  const getConfirmedServices = async () => {
    try {
      const result = await getConfirmedServicesApi();
      console.log("Confirmed services API result:", result);
      if (result.status === 200) {
        setConfirmedServices(result.data);
      } else {
        setConfirmedServices(result.response.data);
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };




  // delete confirmed services

  const deleteConfirmedServices = async (id) => {
    const token = sessionStorage.getItem("token");

    if (token) {
      const reqHeader = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      try {
        const result = await deleteConfirmedServicesApi(id, reqHeader);
        console.log(result);
        if (result.status === 200) {
          toast.success("Deleted successfully");
          getConfirmedServices();
        } else {
          toast.error("Can't delete the data");
        }
      } catch (err) {
        toast.error("Something went wrong");
      }
    }
  };




  useEffect(() => {
    getConfirmedServices();
  }, []);




  return (
    <>
      <div className="container-fluid mt-4 ">
        {/* Back Link */}
        <div className="mb-3">
          <a
            href="/booked"
            className="fw-bold text-info"
            style={{ textDecoration: "none" }}
          >
            <i className="fa-solid fa-arrow-left"></i> Back
          </a>
        </div>

        {/* Page Card */}
        <div
          className="p-4 "
          style={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
        >
          <h2 className="text-center text-info mb-4 fw-bold">
            Confirmed Services
          </h2>

          {/* Responsive Table */}
          <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered align-middle text-center w-100">
            <thead className="bg-info text-light">
                <tr>
                <th style={{ width: "3%" }} className="bg-info text-light">#</th>
                <th style={{ width: "13%" }} className="bg-info text-light">Name</th>
                <th style={{ width: "20%" }} className="bg-info text-light">Email</th>
                <th style={{ width: "10%" }} className="bg-info text-light">Phone No:</th>
                <th style={{ width: "25%", maxWidth: "250px" }} className="bg-info text-light">
                    Description
                </th>
                <th style={{ width: "8%" }} className="bg-info text-light">Action</th>
                </tr>
            </thead>

  <tbody className="text-info fw-bolder">
    {confirmedServices.length > 0 ? (
      confirmedServices.map((service, index) => (
        <tr key={service._id}>
          <td>{index + 1}</td>
          <td>{service.bookedName}</td>
          <td className="text-break">{service.bookedEmail}</td>
          <td>{service.bookedPhoneNo}</td>
          {/* limit description width & wrap */}
          <td className="text-wrap" style={{ maxWidth: "250px", whiteSpace: "normal" }}>
            {service.bookedMessage}
          </td>
          <td>
            <button
              className="btn btn-warning btn-sm w-100"
              onClick={() => deleteConfirmedServices(service?._id)}
            >
              Delete
            </button>
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="6" className="text-muted">
          No confirmed services found
        </td>
      </tr>
    )}
  </tbody>
</table>

          </div>
        </div>
      </div>

      {/* Toasts */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default ConfirmedServices;
