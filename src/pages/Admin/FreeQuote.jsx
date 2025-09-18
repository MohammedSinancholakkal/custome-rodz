import React, { useEffect, useState } from 'react';
import { confirmQuoteApi, deletAQuoteApi, getQuoteApi, rejectQuoteApi } from '../../Services/allApi';
import { toast, ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';


function FreeQuote() {
  const [getQuotes, setGetQuotes] = useState([]);


  const [loading, setLoading] = useState({ id: null, action: null });





//   getAdded quote 

  const getAddedQuote = async () => {
    const result = await getQuoteApi();
    if (result.status === 200) {
      setGetQuotes(result.data);
    } else {
      setGetQuotes(result.response.data);
    }
  };


//   deleteAQuote

const deleteASingleQuote = async(id)=>{

    const token = sessionStorage.getItem("token")

    if(token){
        const reqHeader={
             "Content-Type": "application/json",
             Authorization: `Bearer ${token}`
        }

        // api call

        const result = await deletAQuoteApi(id,reqHeader)
        if(result.status == 200){
            toast.success('Quote deleted successfully')
            getAddedQuote()
        }else{
            toast.error("something went wrong")
        }
    }else{
        toast.error("please Login")
    }

}





// confirm 

const handleConfirm = async (id) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    toast.error("Please Login");
    return;
  }

  setLoading({ id, action: "confirm" }); // 🔄 track confirm
  const reqHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const result = await confirmQuoteApi(id, reqHeader);
    if (result.status === 200) {
      toast.success("Quote confirmed & Email sent ✅");
      getAddedQuote();
    } else {
      toast.error("Failed to confirm quote ❌");
    }
  } catch {
    toast.error("Server error while confirming quote ❌");
  } finally {
    setLoading({ id: null, action: null });
  }
};



// reject
const handleReject = async (id) => {
  const token = sessionStorage.getItem("token");
  if (!token) {
    toast.error("Please login");
    return;
  }

  setLoading({ id, action: "reject" }); // 🔄 track reject
  
  const reqHeader = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    const result = await rejectQuoteApi(id, reqHeader);
    if (result.status === 200) {
      toast.success("Quote rejected & Email sent ❌");
      getAddedQuote();
    } else {
      toast.error("Failed to reject quote ❌");
    }
  } catch {
    toast.error("Server error while rejecting quote ❌");
  } finally {
    setLoading({ id: null, action: null });
  }
};




    

  useEffect(() => {
    getAddedQuote();
  }, []);




  return (
    <>
      <div className="mt-5">
        {/* Back link */}
        <a
          className="text-info"
          href="/admin"
          style={{
            textDecoration: "none",
            fontWeight: "bolder",
            marginTop: '10px',
            marginLeft: '10px'
          }}
        >
          <i className="fa-solid fa-arrow-left"></i> Back
        </a>

        {/* Page Title */}
        <div className="text-center mb-4">
          <h2 className="fw-bold text-info">Free Quotes</h2>
        </div>
        

        <Link
  style={{ textDecoration: "none" }}
  to={"/confirmedquotes"}
>
  <div 
    className="tab-card bg-info text-white px-3 py-2 rounded text-center"
    style={{
      maxWidth: "200px",   // ✅ restricts max size
      width: "100%",       // ✅ responsive on small screens
      margin: "0 auto"     // ✅ center align
    }}
  >
    Confirmed Quotes
  </div>
</Link>

   
        

        {/* Table wrapper for responsiveness */}
        <div
  className="table-responsive"
  style={{
    background: "#fff",
    padding: "20px",
    borderRadius: "8px",
    marginTop: "15px",
  }}
>
  <table
    className="table table-striped table-hover table-bordered text-center align-middle mb-5"
    style={{
      tableLayout: "auto", // ✅ let table adjust naturally
      width: "100%",
      minWidth: "600px", // ✅ allow scroll if screen smaller
    }}
  >
   <thead className="bg-info text-light">
  <tr className="align-middle">
    <th style={{ width: "3%" }} className="bg-info text-light">#</th>
    <th style={{ width: "18%" }} className="bg-info text-light">Customer Name</th>
    <th style={{ width: "10%" }} className="bg-info text-light">Vehicle Model</th>
    <th style={{ width: "30%" }} className="bg-info text-light">Request / Issue</th> {/* ✅ Reduced width */}
    <th style={{ width: "20%" }} className="bg-info text-light">Email</th> {/* ✅ little more space for email */}
    <th style={{ width: "14%" }} className="bg-info text-light">Actions</th>
  </tr>
</thead>


    <tbody className="text-info fw-bolder align-middle">
      {getQuotes?.length > 0 ? (
        getQuotes.map((quote, index) => (
          <tr key={index}>
            <td>{index + 1}</td>
            <td style={{ textTransform: "capitalize" }}>{quote.quoteName}</td>
            <td>{quote.quoteBikeModel?.toUpperCase()}</td>
            <td
              className="text-wrap"
              style={{
                whiteSpace: "normal",
                wordBreak: "break-word",
                textTransform: "capitalize",
              }}
            >
              {quote.quoteMessage}
            </td>
            <td className="text-break">{quote.quoteEmail}</td>
       


        <td>
  <div className="d-flex flex-wrap justify-content-between gap-2">
    {/* Delete */}
    <button
      className="btn btn-danger btn-sm"
      onClick={() => deleteASingleQuote(quote?._id)}
     
       > Delete <i className="fa-solid fa-trash"></i>
    
    </button>

    {/* Reject */}
    <button
      onClick={() => handleReject(quote._id)}
      className="btn btn-warning btn-sm"
      disabled={loading.id === quote._id && loading.action === "reject"}
    >
      {loading.id === quote._id && loading.action === "reject" ? (
        <span className="spinner-border spinner-border-sm"></span>
      ) : (
        <>Reject <i className="fa-solid fa-xmark"></i></>
      )}
    </button>

    {/* Confirm */}
    <button
      onClick={() => handleConfirm(quote._id)}
      className="btn btn-success btn-sm fw-bolder w-100"
      disabled={loading.id === quote._id && loading.action === "confirm"}
    >
      {loading.id === quote._id && loading.action === "confirm" ? (
        <span className="spinner-border spinner-border-sm"></span>
      ) : (
        <>Confirm <i className="fa-solid fa-check fa-md"></i></>
      )}
    </button>
  </div>
</td>



          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="6" className="text-danger m-0">
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

export default FreeQuote;
