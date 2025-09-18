import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast, ToastContainer } from "react-toastify";
import { addBookedServicesApi } from "../Services/allApi";
import { useNavigate } from "react-router-dom";

const ContactModal = ({ show, handleClose }) => {
  const [addBookedServices, setAddBookedServices] = useState({
    bookedName: "",
    bookedEmail: "",
    bookedPhoneNo: "",
    bookedMessage: "",
  });



  const navigate = useNavigate()

  
  // add booked services
  const addServices = async (e) => {
    e.preventDefault();

    const { bookedName, bookedEmail, bookedPhoneNo, bookedMessage } =
      addBookedServices;

    // ✅ validation
    if (!bookedName || !bookedEmail || !bookedPhoneNo || !bookedMessage) {
      toast.warning("Please fill the missing fields");
      return;
    }

    // ✅ email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(bookedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // ✅ phone validation (only 10–11 digits)
    if (!/^[0-9]{10,11}$/.test(bookedPhoneNo)) {
      toast.error("Please enter a valid phone number (10–11 digits)");
      return;
    }

    const token = sessionStorage.getItem("token");

    if (!token) {
      toast.warning("Login is required");
      setTimeout(() => navigate('/login'), 1000); // wait 1s before redirect
      return;
    }
    

    const reqHeader = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      // api call
      const result = await addBookedServicesApi(addBookedServices, reqHeader);
      console.log(result);

      if (result.status === 200) {
        setAddBookedServices({
          bookedName: "",
          bookedEmail: "",
          bookedPhoneNo: "",
          bookedMessage: "",
        });

        toast.success("Service Booked successfully");

        // ✅ close modal after short delay
        setTimeout(() => {
          handleClose();
        }, 500);
      } else {
        toast.error("Failed to submit service. Please try again.");
      }
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  return (
    <>
      {/* Bootstrap Modal */}
      <div
        className={`modal fade ${show ? "show d-block" : "d-none"}`}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-body p-4">
              {/* Close Button */}
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleClose}
              ></button>

              {/* Modal Header */}
              <div className="text-center mb-3">
                <h3 className="text-info">Book Your Bike Service Today!</h3>
                <h5 className="text-info">Special Offer:</h5>
                <p className="text-info">
                  Get 15% off on your first service — plus free pickup and drop
                  within city limits!
                </p>
              </div>

              {/* Form */}
              <form id="contactForm">
                <div className="mb-3">
                  <input
                    type="text"
                    name="fullname"
                    className="form-control bg-light border-0"
                    placeholder="Your Name"
                    pattern="[a-zA-Z ]*"
                    style={{ height: "55px" }}
                    onChange={(e) =>
                      setAddBookedServices({
                        ...addBookedServices,
                        bookedName: e.target.value,
                      })
                    }
                    value={addBookedServices.bookedName}
                  />
                </div>

                {/* ✅ Email validation */}
                <div className="mb-3">
                  <input
                    type="email"
                    name="email"
                    className="form-control bg-light border-0"
                    placeholder="Your Email"
                    style={{ height: "55px" }}
                    onChange={(e) =>
                      setAddBookedServices({
                        ...addBookedServices,
                        bookedEmail: e.target.value,
                      })
                    }
                    value={addBookedServices.bookedEmail}
                  />
                </div>

                {/* ✅ Phone – only numbers */}
                <div className="mb-3">
                  <input
                    type="text"
                    name="mobile"
                    className="form-control bg-light border-0"
                    placeholder="Your Phone Number"
                    style={{ height: "55px" }}
                    onChange={(e) => {
                      const onlyNums = e.target.value.replace(/[^0-9]/g, ""); // strip non-digits
                      setAddBookedServices({
                        ...addBookedServices,
                        bookedPhoneNo: onlyNums,
                      });
                    }}
                    value={addBookedServices.bookedPhoneNo}
                    maxLength={11}
                  />
                </div>

                <div className="mb-3">
                  <textarea
                    name="query"
                    className="form-control bg-light border-0"
                    rows="3"
                    placeholder="Describe any issues or service requests for your bike"
                    onChange={(e) =>
                      setAddBookedServices({
                        ...addBookedServices,
                        bookedMessage: e.target.value,
                      })
                    }
                    value={addBookedServices.bookedMessage}
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  onClick={addServices}
                  type="submit"
                  className="btn btn-info d-block w-100 mb-3"
                >
                  Submit Booking
                </button>
                <footer className="bg-light text-muted small p-2">
                  *Same-day service available for selected jobs. Call us for
                  urgent repairs: <strong>+91-98765-43210</strong>
                </footer>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay Background */}
      {show && (
        <div
          className="modal-backdrop fade show"
          onClick={handleClose}
        ></div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default ContactModal;
