import React, { useEffect, useState } from "react";
import { Button, Badge } from "react-bootstrap";
import {
  deleteOrderApi,
  getAllPaymentsApi,
} from "../../Services/allApi";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



function Orders() {
  const [getAllPayments, setGetAllPayments] = useState([]);

  // Get all payments
  const getAllPaymentsToOrders = async () => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const reqHeader = { Authorization: `Bearer ${token}` };
      const result = await getAllPaymentsApi(reqHeader);
      if (result.status === 200) {
        setGetAllPayments(result.data.payments);
      } else {
        setGetAllPayments([]);
      }
    }
  };

  // Delete order
  const handleDelete = async (orderId) => {
    const token = sessionStorage.getItem("token");
    if (!token) return alert("Please login first");

    const reqHeader = { Authorization: `Bearer ${token}` };
    const result = await deleteOrderApi(orderId, reqHeader);

    if (result.status === 200) {
      getAllPaymentsToOrders();
      toast.success("Order deleted successfully!");
    } else {
      toast.error("Failed to delete order");
    }
  };



  useEffect(() => {
    getAllPaymentsToOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  

  return (
    <>
      <div className="container-fluid mt-5">
        <a
          href="/admin"
          className="fw-bold text-info d-inline-flex align-items-center mb-3"
          style={{ textDecoration: "none" }}
        >
          <i className="fa-solid fa-arrow-left me-2"></i> Back
        </a>

        <div className="text-center mb-4">
          <h2 className="fw-bold text-info">Customer Orders</h2>
        </div>

        <div className="bg-white p-3 rounded mt-3">
          <div className="table-responsive">
            <table className="table table-striped table-hover table-bordered align-middle">
              <thead className="text-info text-center">
                <tr className="bg-info">
                  <th className="bg-info text-light">#</th>
                  <th className="bg-info text-light">Customer Name</th>
                  <th className="bg-info text-light">Mobile No</th>
                  <th className="bg-info text-light">Email</th>
                  <th className="bg-info text-light">Product / Quantity / Amount</th>
                  <th className="bg-info text-light">Total</th>
                  <th className="bg-info text-light">Date</th>
                  <th className="bg-info text-light">Action</th>
                </tr>
              </thead>
              <tbody className="text-info fw-bolder text-center">
                {getAllPayments?.length > 0 ? (
                  getAllPayments.map((order, index) => (
                    <tr key={order._id}>
                      <td>{index + 1}</td>
                      <td className="text-truncate" style={{ maxWidth: "150px" }}>
                        {order?.customerName}
                      </td>
                      <td>{order?.customerPhone}</td>
                      <td className="text-truncate" style={{ maxWidth: "180px" }}>
                        {order?.customerEmail}
                      </td>
                      <td className="text-start">
                        <ul className="m-0 p-0 list-unstyled">
                          {order?.items.map((item, idx) => (
                            <li key={idx}>
                              <span className="fw-bold">Product:</span> {item?.productName} <br />
                              <span className="fw-bold">Qty:</span> {item?.quantity} <br />
                              <span className="fw-bold">Amt:</span> ₹{item?.total}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td>₹{order.totalAmount}</td>
                      <td>{new Date(order.createdAt).toLocaleString()}</td>
                      <td className="text-center">
                        <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center align-items-center">
                          {order.status === "Confirmed" ? (
                            <Badge bg="success" className="d-flex align-items-center" style={{height:'32px'}}>Confirmed</Badge>
                          ) : (
                            <Button
                              variant="success"
                              size="sm"
                              className="w-100 w-sm-auto"
                            >
                              Confirm
                            </Button>
                          )}
                          <Button
                            variant="danger"
                            size="sm"
                            className="w-100 w-sm-auto"
                            onClick={() => handleDelete(order._id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-danger fw-bolder">
                      Your Ordered List is empty
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default Orders;
