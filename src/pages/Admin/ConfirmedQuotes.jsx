import React, { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import { getConfirmedQuoteApi } from "../../Services/allApi";
import 'react-toastify/dist/ReactToastify.css';





function ConfirmedServices() {

    const[getfreeQuote,setGetfreeQuote]=useState([])


    // get confirmed quote

    const getConfirmedQuote = async()=>{

        const token = sessionStorage.getItem("token")
      if(!token){
        console.error("No token found. Please login first.");
        return;
      }

      const reqHeader = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }

      try{
           // apicall
      const result = await getConfirmedQuoteApi(reqHeader)
      if(result.status == 200){
          setGetfreeQuote(result.data)
      }else{
          setGetfreeQuote(result.response.data)
      }

      }catch(err){
        console.error("Error fetching confirmed quotes", err);
        setGetfreeQuote([]);
      }
    }



   

    useEffect(()=>{
        getConfirmedQuote()
    },[])


    

    
  return (
    <>
      <div className="container-fluid mt-4 ">
        {/* Back Link */}
        <div className="mb-3">
          <a
            href="/freequote"
            className="fw-bold text-info"
            style={{ textDecoration: "none"  }}

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
            Confirmed Quotes
          </h2>

          {/* Responsive Table */}
          <div className="table-responsive">
          <table className="table table-sm table-striped table-hover table-bordered align-middle text-center">
            <thead className="bg-info text-light align-middle">
              <tr style={{height:'40px'}}>
                <th  style={{ width: "2%" }}  className="text-light bg-info">#</th>
                <th  style={{ width: "13%" }} className="text-light bg-info">Customer Name</th>
                <th  style={{ width: "18%" }} className="text-light bg-info">Email</th>
                <th  style={{ width: "10%" }} className="text-light bg-info">Vehicle Model No</th>
                <th  style={{ width: "20%" }} className="text-light bg-info">Issue / Request</th>
                <th  style={{ width: "8%" }} className="text-light bg-info">Status</th>
              </tr>
            </thead>

            <tbody className="text-info fw-bolder">
              {getfreeQuote?.length > 0 ? (
                getfreeQuote.map((data, index) => (
                  <tr key={index} style={{height:'50px'}}>
                    <td>{index + 1}</td>
                    <td>{data.quoteName}</td>
                    <td className="text-break">{data.quoteEmail}</td>
                    <td>{data.quoteBikeModel}</td>
                    <td className="text-wrap" style={{ whiteSpace: "normal" }}>
                      {data.quoteMessage}
                    </td>
                    <td>
                      <span className="badge bg-success">Confirmed</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-muted">
                    No Confirmed Quotes Found!!
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
