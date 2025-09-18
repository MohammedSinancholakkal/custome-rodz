import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { deleteOrdersOfUsersApi, getUserOrdersApi } from "../Services/allApi";
import { serverUrl } from "../Services/serverUrl";
import 'react-toastify/dist/ReactToastify.css';


function MyOrders() {
  const [userOrders, setUserOrders] = useState([]);



  const fetchMyOrders = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if(!token){
        toast.warning("login required")
        return;
      }
      const reqHeader = {
        Authorization: `Bearer ${token}`,
      };

      const result = await getUserOrdersApi(reqHeader);
      if (result.data.success) {
        setUserOrders(result.data.orders);
      } else {
        toast.error("No orders found");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch orders");
    }
  };

  // console.log(userOrders);





  // delete user orders 

  const deleteUserOrdersFromMyOrders = async(id)=>{

    const token = sessionStorage.getItem("token")
    if(!token){
      toast.error("please login")
      return
    }

    const reqHeader = {
      Authorization:`Bearer ${token}`,
    }

    // api call

    const result = await deleteOrdersOfUsersApi(id,reqHeader)
    if(result.status == 200){
      fetchMyOrders();
      toast.success("deleted successfully")
    }else{
      toast.error("somthing went wrong")
    }
  }
  

  useEffect(() => {
    fetchMyOrders();

  }, []);

  return (
    <>
   
    <div className="container mt-5 mb-5">
      {/* Back Button */}
      <Link to="/" className="text-decoration-none mb-3 d-block">
        <h6 className="text-info fw-bolder">
          <i className="fa-solid fa-arrow-left"></i> Back
        </h6>
      </Link>

      <h3 className="text-center mb-4 fw-bolder text-info">
        <i className="fa-solid fa-xs fa-arrow-left me-1"></i>
        <i className="fa-solid fa-xs fa-arrow-left me-3"></i>
        My-Orders
        <i className="fa-solid fa-xs fa-arrow-right ms-3"></i>
        <i className="fa-solid fa-xs fa-arrow-right ms-1"></i>
      </h3>

      { userOrders.length === 0 ? (
         
          <p className="text-center text-danger fw-bold">No orders found.</p>
      ) : (
        <div className="d-flex flex-column gap-3 mt-5">
            {userOrders.map((order, index) => (
                <div key={order._id} className="p-3 shadow rounded bg-light mb-2">
                    {/* Order ID */}
                    <h6 className="fw-bold mb-3 border-bottom pb-2">Order #{index + 1}</h6>

                    {/* Loop through items */}
                    {order.items.map((item, idx) => (
                    <div
                        key={item._id}
                        className={`row mb-3 pb-3 ${
                        idx !== order.items.length - 1 ? "border-bottom" : ""
                        }`}
                    >
                        {/* Left Side: Image + Product Name */}
                        <div className="col-12 col-md-4 text-center mb-3 mb-md-0 mt-3">
                        <img
                            src={`${serverUrl}/uploads/${item.productImage}`}
                            alt={item.productName}
                            className="img-fluid rounded mb-2"
                            style={{ maxHeight: "100px", objectFit: "cover" }}
                        />
                        <p className="fw-bold mb-1">{item.productName}</p>
                        </div>

                        {/* Right Side: Order Details */}
                        <div className="col-12 col-md-8 d-flex flex-column justify-content-between mt-4">
                        <div className="row text-center">
                            {/* Price & Qty */}
                            <div className="col-6 col-md">
                            <div className="d-flex flex-column">
                                <span>
                                <strong>Amount:</strong> ₹{item.price}
                                </span>
                                <span>
                                <strong>Quantity:</strong> {item.quantity}
                                </span>
                            </div>
                            </div>

                            {/* Total */}
                            <div className="col-6 col-md">
                            <strong>Total:</strong> ₹{item.total}
                            </div>

                            {/* Date */}
                            <div className="col-6 col-md">
                            <strong>Date:</strong>{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                            </div>

                            {/* Status */}
                            <div className="col-12 col-md">
                            <strong>Order Status:</strong>{" "}
                            <span
                                className={`fw-bolder ${
                                order.status === "Confirmed"
                                    ? "text-success"
                                    : order.status === "Rejected"
                                    ? "text-danger"
                                    : "text-warning"
                                }`}
                            >
                                {order.status}
                            </span>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="d-flex justify-content-end gap-2 mt-4">
                            <Link to="/cart" onClick={() => window.scrollTo(0, 0)}>
                            <button className="btn btn-sm btn-outline-light btn-info text-light">
                                Buy Again
                            </button>
                            </Link>

                            <Link to={`/products`} onClick={() => window.scrollTo(0, 400)}>
                            <button className="btn btn-sm btn-outline-light btn-info text-light">
                                View
                            </button>
                            </Link>
                            <button className="btn btn-sm btn-outline-light btn-danger text-light"
                            onClick={()=> deleteUserOrdersFromMyOrders(order?._id)}
                            >
                                Delete
                            </button>
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
                ))}

        </div>
      )}


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

export default MyOrders;
