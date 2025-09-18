
import React, { useState } from "react";
import { toast } from "react-toastify";





const JoinUs = () => {



  const [addData, setAddData] = useState({

    username: "",
    email: "",
    phone: "",
    interest: "",

  });



  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(addData);
    
    // Validation
    if (!addData.username || !addData.email || !addData.phone || !addData.interest) {
       toast.warning("Please fill in all fields");
    }else{
      toast.success("Successfully joined!");
      setAddData({ username: "", email: "", phone: "", interest: "" });
    }
  }




  return (
    <div
      className="d-flex align-items-center justify-content-center bg-white"
      style={{ minHeight: "100vh", padding: "20px" }}
    >
      <div className="container p-5 rounded shadow-lg" style={{ maxWidth: "700px" }}>
        <h1 className="text-center mb-4 text-info fw-bold">Join Us – Custom Rodz</h1>
        <p className="text-center mb-4 text-secondary">
          Be a part of the <strong className="text-dark">Custom Rodz</strong> family — whether you’re a biker,
          mechanic, or enthusiast, we welcome you to ride with us! Get updates, exclusive offers, and priority service booking.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-info">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
              value={addData.username}
              onChange={(e) => setAddData({ ...addData, username: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-info">Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={addData.email}
              onChange={(e) => setAddData({ ...addData, email: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-info">Phone Number</label>
            <input
              type="tel"
              className="form-control"
              placeholder="Enter your phone number"
              value={addData.phone}
              onChange={(e) => setAddData({ ...addData, phone: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-info">Interest</label>
            <select
              className="form-select"
              value={addData.interest}
              onChange={(e) => setAddData({ ...addData, interest: e.target.value })}
            >
              <option value="">Select an option</option>
              <option value="membership">Membership</option>
              <option value="job">Work with Us</option>
              <option value="newsletter">Newsletter</option>
            </select>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-info px-5 py-2 text-white fw-bold">
              Join Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JoinUs;
