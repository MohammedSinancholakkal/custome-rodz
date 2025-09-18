import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Form, Button } from "react-bootstrap";
import {
  getCartApi,
  removeFromCartApi,
  updateCartQuantityApi,
  emptyCartApi,
  createOrderApi,
  verifyPaymentApi,
  sendConfirmationEmailApi,
} from "../Services/allApi";
import { serverUrl } from "../Services/serverUrl";
import "react-toastify/dist/ReactToastify.css";

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [userDetails, setUserDetails] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerAddress: "",
  });

  // Fetch Cart from backend
  const fetchCart = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return toast.warning("Please login first!");
      const reqHeader = { Authorization: `Bearer ${token}` };
      const res = await getCartApi(reqHeader);
      if (res.status === 200) setCartItems(res.data.cart || []);
      else toast.error(res?.response?.data?.message || "Failed to load cart");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong while fetching cart");
    }
  };

  // Remove product
  const handleRemove = async (productId) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return toast.warning("Please login first!");
      const reqHeader = { Authorization: `Bearer ${token}` };
      const res = await removeFromCartApi(productId, reqHeader);
      if (res.status === 200) {
        toast.success("Removed from cart");
        fetchCart();
      } else toast.error("Failed to remove");
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove item");
    }
  };

  // Update Quantity
  const handleQuantityChange = async (productId, currentQuantity, action) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return toast.warning("Please login first!");
      const reqHeader = { Authorization: `Bearer ${token}` };

      let newQuantity = currentQuantity;
      if (action === "increase") newQuantity++;
      else if (action === "decrease" && currentQuantity > 1) newQuantity--;

      const res = await updateCartQuantityApi(productId, newQuantity, reqHeader);
      if (res.status === 200) fetchCart();
      else toast.error("Failed to update quantity");
    } catch (err) {
      console.error(err);
      toast.error("Error updating quantity");
    }
  };

  // Empty Cart
  const handleEmptyCart = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem("token");
      if (!token) return toast.warning("Please login first!");
      const reqHeader = { Authorization: `Bearer ${token}` };
      const res = await emptyCartApi(reqHeader);
      if (res.status === 200) {
        toast.success("Cart emptied");
        setCartItems([]);
      } else toast.error("Failed to empty cart");
    } catch (err) {
      console.error(err);
      toast.error("Error emptying cart");
    } finally {
      setLoading(false);
    }
  };

  // Total Price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.productId?.offerPrice || 0) * item.quantity,
    0
  );

  // Open Payment Modal
  const handleBuyNow = () => {
    if (cartItems.length === 0) return toast.warning("Cart is empty");
    setShow(true);
  };

  // Razorpay Payment
  const handleConfirmPayment = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return toast.warning("Please login first!");
      const reqHeader = { Authorization: `Bearer ${token}` };

      // Create order using backend controller
      const orderRes = await createOrderApi(
        {
          customerName: userDetails.customerName,
          customerEmail: userDetails.customerEmail,
          customerPhone: userDetails.customerPhone,
          customerAddress: userDetails.customerAddress,
          cartItems,
          totalAmount: totalPrice,
        },
        reqHeader
      );

      if (!orderRes?.data) return toast.error("Failed to create order");

      const { razorpayOrderId, amount, currency, key, orderId } = orderRes.data;

      if (!razorpayOrderId) return toast.error("Razorpay order ID missing");

      const options = {
        key,
        amount,
        currency,
        name: "Custome Rodz",
        description: "Transaction Processing",
        order_id: razorpayOrderId,
        handler: async (response) => {
          try {
            // Verify payment
            const verifyRes = await verifyPaymentApi(
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              },
              reqHeader
            );

            if (verifyRes.data?.success) {
              toast.success("Payment successful!");

              // Send confirmation email
              const emailRes = await sendConfirmationEmailApi(orderId, reqHeader);
              if (emailRes.data?.success) toast.success("Confirmation email sent!");
              else toast.error("Payment done, but email not sent");

              fetchCart();
              setShow(false);
            } else toast.error("Payment verification failed");
          } catch (err) {
            console.error(err);
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: userDetails.customerName,
          email: userDetails.customerEmail,
          contact: userDetails.customerPhone,
        },
        theme: { color: "#0d6efd" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="container my-5 mb-5" style={{ padding: "0 5%" }}>
      <h3 className="fw-bold mb-4 mt-5 text-info">Cart Summary</h3>

      <div className="d-flex justify-content-between text-muted fw-bold border-bottom pb-2 flex-wrap">
        <div style={{ flex: "0 0 40%" }}>PRODUCT DETAILS</div>
        <div style={{ flex: "0 0 20%", textAlign: "center" }}>QUANTITY</div>
        <div style={{ flex: "0 0 20%", textAlign: "right" }}>PRICE</div>
        <div style={{ flex: "0 0 20%", textAlign: "right" }}>ACTION</div>
      </div>

      {cartItems.length > 0 ? (
        cartItems.map(
          (item) =>
            item.productId && (
              <div
                key={item._id}
                className="d-flex align-items-center justify-content-between py-3 border-bottom flex-wrap"
              >
                <div className="d-flex align-items-center" style={{ flex: "0 0 40%" }}>
                  <img
                    src={`${serverUrl}/uploads/${item?.productId?.productImage || "no-image.jpg"}`}
                    alt={item?.productId?.productName || "Product"}
                    className="me-3 rounded"
                    style={{ width: "70px", height: "70px", objectFit: "contain" }}
                  />
                  <div>
                    <h6 className="mb-1 text-info fw-bolder">{item?.productId?.productName || "Unknown"}</h6>
                    <small className="text-danger">{item?.productId?.productCategory || "No category"}</small>
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-center" style={{ flex: "0 0 20%" }}>
                  <button
                    className="btn btn-light btn-sm"
                    onClick={() => handleQuantityChange(item.productId._id, item.quantity, "decrease")}
                  >
                    -
                  </button>
                  <input
                    type="text"
                    value={item.quantity}
                    className="form-control form-control-sm mx-1 text-center"
                    style={{ width: "50px" }}
                    readOnly
                  />
                  <button
                    className="btn btn-light btn-sm"
                    onClick={() => handleQuantityChange(item.productId._id, item.quantity, "increase")}
                  >
                    +
                  </button>
                </div>

                <div style={{ flex: "0 0 20%", textAlign: "right" }}>
                  ₹{(item.productId?.offerPrice || 0) * item.quantity}
                </div>

                <div style={{ flex: "0 0 20%", textAlign: "right" }}>
                  <small
                    className="text-danger"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleRemove(item.productId._id)}
                  >
                    Remove
                  </small>
                </div>
              </div>
            )
        )
      ) : (
        <p className="text-center mt-4">🛒 No items added to cart</p>
      )}

      {cartItems.length > 0 && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <h5 className="fw-bold text-danger">Total: ₹{totalPrice}</h5>
          <div>
            <button className="btn btn-outline-danger me-2" onClick={handleEmptyCart} disabled={loading}>
              {loading ? "Processing..." : "Empty Cart"}
            </button>
            <button className="btn btn-info" onClick={handleBuyNow} disabled={loading}>
              {loading ? "Processing..." : "Buy Now"}
            </button>
          </div>
        </div>
      )}
<Modal show={show} onHide={() => setShow(false)} size="xl">
  <Modal.Header closeButton>
    <Modal.Title>Payment Details</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
      <div className="row">
        <div className="col-md-6">
          {/* Name */}
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={userDetails.customerName}
              onChange={(e) => {
                const name = e.target.value
                  .replace(/[^a-zA-Z\s]/g, "") // letters & spaces only
                  .replace(/\b\w/g, (l) => l.toUpperCase());
                setUserDetails({ ...userDetails, customerName: name });
              }}
              placeholder="Enter your name"
            />
            {!userDetails.customerName && (
              <small className="text-danger">Name is required</small>
            )}
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={userDetails.customerEmail}
              onChange={(e) =>
                setUserDetails({ ...userDetails, customerEmail: e.target.value })
              }
              placeholder="Enter your email"
            />
            {userDetails.customerEmail &&
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.customerEmail) && (
                <small className="text-danger">Invalid email address</small>
              )}
            {!userDetails.customerEmail && (
              <small className="text-danger">Email is required</small>
            )}
          </Form.Group>

          {/* Phone */}
          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              value={userDetails.customerPhone}
              onChange={(e) => {
                const onlyNums = e.target.value.replace(/\D/g, "");
                setUserDetails({
                  ...userDetails,
                  customerPhone: onlyNums.slice(0, 10),
                });
              }}
              placeholder="Enter 10-digit phone number"
            />
            {userDetails.customerPhone.length > 0 &&
              userDetails.customerPhone.length < 10 && (
                <small className="text-danger">
                  Phone number must be 10 digits
                </small>
              )}
            {!userDetails.customerPhone && (
              <small className="text-danger">Phone is required</small>
            )}
          </Form.Group>
        </div>

        <div className="col-md-6">
          {/* Address */}
          <Form.Group className="mb-3">
            <Form.Label>Address</Form.Label>
            <Form.Control
              value={userDetails.customerAddress}
              onChange={(e) =>
                setUserDetails({ ...userDetails, customerAddress: e.target.value })
              }
              placeholder="Enter your address"
            />
            {!userDetails.customerAddress && (
              <small className="text-danger">Address is required</small>
            )}
          </Form.Group>

          {/* Products */}
          <Form.Group className="mb-3">
            <Form.Label>Products</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              readOnly
              value={cartItems
                .map(
                  (item) =>
                    `${item.productId?.productName || "Unavailable"} (x${
                      item.quantity
                    }) - ₹${item.productId?.offerPrice || 0}`
                )
                .join("\n")}
            />
          </Form.Group>
        </div>
      </div>

      <h5
        className="mt-3 bg-info text-light fw-bolder d-flex justify-content-center align-items-center"
        style={{ height: "50px" }}
      >
        Total Amount: ₹{totalPrice}
      </h5>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShow(false)}>
      Cancel
    </Button>
    <Button
      variant="info"
      disabled={
        !userDetails.customerName ||
        !userDetails.customerEmail ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userDetails.customerEmail) ||
        userDetails.customerPhone.length !== 10 ||
        !userDetails.customerAddress
      }
      onClick={handleConfirmPayment}
    >
      Confirm & Pay
    </Button>
  </Modal.Footer>
</Modal>



      <ToastContainer position="top-right" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="light" />
    </div>
  );
}

export default Cart;
