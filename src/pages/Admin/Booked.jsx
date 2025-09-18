import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { confirmBookedServiceApi, deleteABookedServicesApi, getBookedServicesApi } from "../../Services/allApi";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';






function Booked() {


  // state to get service booked 
  const[getServicesBooked,setGetServicesBooked]= useState([])



  const getBookedServicesToAdmin = async()=>{

    // api call

    const result = await getBookedServicesApi()
    if (result.status === 200) {
      setGetServicesBooked(result.data);
    } else {
      setGetServicesBooked([]);
      toast.error("Failed to fetch services");
    }
    
  }

 


  // confirm services 

  const confirmService = async (id) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const reqHeader = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };
  
      const result = await confirmBookedServiceApi(id, reqHeader); // ✅ FIXED
      if (result.status === 200) {
        toast.success("Service Approved and send to email");
        getBookedServicesToAdmin(); // refresh booked list
      } else {
        toast.error("Something went wrong");
      }
    } else {
      toast.error("Please login");
    }
  };
  
  




  // delete a booked service
  
  const deleteBookedService = async(id)=>{

    const token = sessionStorage.getItem("token")

    if(token){
        const reqHeader={
             "Content-Type": "application/json",
             Authorization: `Bearer ${token}`
        }


        // api call

        const result = await deleteABookedServicesApi(id,reqHeader)
        if(result.status == 200){
            toast.success('service deleted successfully')
            toast.success("Message Sended to whatsapp");
            getBookedServicesToAdmin()
        }else{
            toast.error("something went wrong")
        }
    }else{
        toast.error("please Login")
    }

}



  useEffect(()=>{
    getBookedServicesToAdmin()
  },[])






  return (

    <>
       <div className="container-fluid booked-container py-4">
      {/* Back Button */}
      <div className="mb-3">
        <a
          href="/admin"
          className="fw-bold text-info d-inline-flex align-items-center"
          style={{ textDecoration: "none" }}
        >
          <i className="fa-solid fa-arrow-left me-2"></i> Back
        </a>
      </div>

       {/* Page Title */}
       <div className="text-center mb-4">
          <h2 className="fw-bold text-info">Booked Services</h2>
        </div>

      {/* Tabs */}
      <div className="d-flex flex-wrap justify-content-center gap-3 mb-4">
        {/* <div className="tab-card bg-info text-white px-3 py-2 rounded">
          Services
        </div> */}

        <Link
          style={{ textDecoration: "none" }}
          to={"/confirmedservices"}
          
        >
          <div className="tab-card bg-info text-white px-3 py-2 rounded">
            Confirmed Services
          </div>
        </Link>
      </div>


      {/* Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover table-bordered align-middle">
          <thead className="text-info text-center">
            <tr className="bg-info">
              <th className="bg-info text-light">#</th>
              <th className="bg-info text-light">Name</th>
              <th className="bg-info text-light">Email</th>
              <th className="bg-info text-light">Phone No:</th>
              <th className="bg-info text-light">Description</th>
              <th
                style={{ minWidth: "150px" }}
                className="bg-info text-light"
              >
                Action
              </th>
            </tr>
          </thead>


          <tbody className="text-info fw-bolder text-center">
              {getServicesBooked?.length > 0 ? (
                getServicesBooked.map((getservices, index) => (
                  <tr key={getservices._id || index}>
                    <td>{index + 1}</td>
                    <td>{getservices?.bookedName}</td>
                    <td>{getservices?.bookedEmail}</td>
                    <td>{getservices?.bookedPhoneNo}</td>
                    <td>{getservices?.bookedMessage}</td>
                    <td>
                      <div className="d-flex flex-wrap justify-content-center gap-2">
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => deleteBookedService(getservices?._id)}
                        >
                          Delete
                        </button>
                        <button
                          className="btn btn-info btn-sm"
                          onClick={() => confirmService(getservices?._id)}
                        >
                          Confirm
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-danger fw-bolder text-center">
                    Nothing to display
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
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
   

  );
}

export default Booked;
