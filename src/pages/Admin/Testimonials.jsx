import React, { useEffect, useState } from "react";
import {
  deleteTestimonialsApi,
  getToAdminestimonialsApi,
  updateTestimonialStatusApi,
} from "../../Services/allApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { serverUrl } from "../../Services/serverUrl";

function Testimonials() {
  const [getTestimony, setGetTestimony] = useState([]);
  const [approvedIds, setApprovedIds] = useState([]); // <-- track approved testimonials
  const token = sessionStorage.getItem("token");

  // get to admin testimonials

  const getToAdminTestimony = async () => {
    const result = await getToAdminestimonialsApi();
    if (result.status === 200) {
      setGetTestimony(result.data);
      // Track which testimonials are already approved
      const approved = result.data
        .filter((t) => t.status === "approved")
        .map((t) => t._id);
      setApprovedIds(approved);
    } else {
      setGetTestimony([]);
      toast.error("Failed to fetch testimonials");
    }
  };

  // approve testimonials

  const handleApprove = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.error("Admin login required");
        return;
      }

      const reqHeader = { Authorization: `Bearer ${token}` };
      const result = await updateTestimonialStatusApi(id, reqHeader);

      if (result.status === 200) {
        toast.success("Testimonial approved!");
        getToAdminTestimony(); // refresh the data from server
      } else {
        toast.error("Failed to approve testimonial.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  // delete testimonials

  const deleteAddedTestimonials = async (id) => {
    const result = await deleteTestimonialsApi(id);
    if (result.status === 200) {
      getToAdminTestimony();
      toast.success("Deleted successfully");
      setApprovedIds((prev) => prev.filter((approvedId) => approvedId !== id));
    } else {
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (token) {
      getToAdminTestimony();
    }
  }, [token]);

  return (
    <>
      <div className="container-fluid mt-4">
        <a
          href="/admin"
          className="fw-bold text-info d-inline-flex align-items-center mb-3"
          style={{ textDecoration: "none" }}
        >
          <i className="fa-solid fa-arrow-left me-2"></i> Back
        </a>

        <div className="text-center mb-4">
          <h2 className="fw-bold text-info">Testimonials</h2>
        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-striped table-hover align-middle text-center">
            <thead>
              <tr>
                <th className="bg-info text-light">#</th>
                <th className="bg-info text-light">Username</th>
                <th className="bg-info text-light">Vehicle Name</th>
                <th className="bg-info text-light">Testimonial Text</th>
                <th className="bg-info text-light">Image</th>
                <th className="bg-info text-light">Rating</th>
                <th className="bg-info text-light">Action</th>
              </tr>
            </thead>
            <tbody>
              {getTestimony?.length > 0 ? (
                getTestimony.map((testy, index) => (
                  <tr key={testy._id}>
                    <td>{index + 1}</td>
                    <td className="text-break">{testy?.testimonyUserName}</td>
                    <td className="text-break">{testy?.vehicleName}</td>
                    <td
                      className="text-break"
                      style={{ maxWidth: "250px", whiteSpace: "pre-wrap" }}
                    >
                      {testy?.testimonyMessage}
                    </td>
                    <td>
                      <img
                        src={`${serverUrl}/uploads/${testy?.testimonyImage}`}
                        alt="Profile"
                        className="img-fluid"
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "5px",
                        }}
                      />
                    </td>
                    <td>
                      {[...Array(Number(testy.rating)).keys()].map((i) => (
                        <i
                          key={i}
                          className="fa-solid fa-star text-warning me-1"
                        ></i>
                      ))}
                    </td>
                    <td>
                      <div className="d-flex flex-wrap justify-content-center gap-2">
                        <button
                          onClick={() => deleteAddedTestimonials(testy?._id)}
                          className="btn btn-danger btn-sm d-flex align-items-center"
                        >
                          <i className="fa-solid fa-trash me-1"></i> Delete
                        </button>

                        <button
                          className={`btn btn-sm d-flex align-items-center ${
                            approvedIds.includes(testy._id)
                              ? "btn-success"
                              : "btn-info"
                          }`}
                          onClick={() => handleApprove(testy._id)}
                          disabled={approvedIds.includes(testy._id)}
                        >
                          <i
                            className={`fa-solid me-1 ${
                              approvedIds.includes(testy._id)
                                ? "fa-check"
                                : "fa-check"
                            }`}
                          ></i>
                          {approvedIds.includes(testy._id)
                            ? "Confirmed"
                            : "Approve"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-danger fw-bold text-center">
                    No Testimonials Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true} // ensure auto-close works
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default Testimonials;
