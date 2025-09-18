import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Table } from "react-bootstrap";
import { addBillingDetailsApi, getAllProductToBillingApi } from "../../Services/allApi";
import { serverUrl } from "../../Services/serverUrl";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function Billing() {
  const [allProducts, setAllProducts] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [labourCharges, setLabourCharges] = useState(0);
  const [billingDetails, setBillingDetails] = useState({
    billingUserName: "",
    billingVehicleName: "",
    billingVehicleNumber: "",
    billingPhoneNumber: "",
  });


  
  const getAllProducts = async () => {
    const result = await getAllProductToBillingApi(searchKey);
    if (result.status === 200) setAllProducts(result.data);
    else setAllProducts(result.response.data);
  };




  const handleAddProduct = (item) => {
    const exists = selectedProducts.find((p) => p._id === item._id);
    if (exists) {
      setSelectedProducts(
        selectedProducts.map((p) =>
          p._id === item._id
            ? { ...p, qty: p.qty + 1, total: (p.qty + 1) * p.offerPrice }
            : p
        )
      );
    } else {
      setSelectedProducts([
        ...selectedProducts,
        {
          ...item,
          qty: 1,
          price: item.productPrice,
          offerPrice: item.offerPrice,
          total: item.offerPrice,
        },
      ]);
    }
  };

  const increaseQty = (id) => {
    setSelectedProducts(
      selectedProducts.map((p) =>
        p._id === id ? { ...p, qty: p.qty + 1, total: (p.qty + 1) * p.offerPrice } : p
      )
    );
  };

  const decreaseQty = (id) => {
    setSelectedProducts(
      selectedProducts
        .map((p) =>
          p._id === id && p.qty > 1
            ? { ...p, qty: p.qty - 1, total: (p.qty - 1) * p.offerPrice }
            : p
        )
        .filter((p) => p.qty > 0)
    );
  };

  const removeProduct = (id) => {
    setSelectedProducts(selectedProducts.filter((p) => p._id !== id));
  };

  const productTotal = selectedProducts.reduce((sum, p) => sum + p.total, 0);
  const grandTotal = productTotal + Number(labourCharges || 0);

  const formatVehicleNumber = (value) => {
    let cleanValue = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
    let formatted = "";
    if (cleanValue.length > 0) formatted += cleanValue.substring(0, 2);
    if (cleanValue.length > 2) formatted += "-" + cleanValue.substring(2, 4);
    if (cleanValue.length > 4) formatted += "-" + cleanValue.substring(4, 5);
    if (cleanValue.length > 5) formatted += "-" + cleanValue.substring(5, 9);
    return formatted;
  };

  const handleAddDetails = async () => {
    const { billingUserName, billingVehicleName, billingVehicleNumber, billingPhoneNumber } = billingDetails;
    if (!billingUserName || !billingVehicleName || !billingVehicleNumber || !billingPhoneNumber) {
      toast.info("Please fill the missing fields");
      return;
    }
    if (billingPhoneNumber.length !== 10) {
      toast.warning("Phone number must be 10 digits");
      return;
    }
    if (selectedProducts.length === 0) {
      toast.warning("Please add at least one product!");
      return;
    }
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Admin login required");
      return;
    }

    const reqHeader = { Authorization: `Bearer ${token}` };
    const billingData = {
      ...billingDetails,
      products: selectedProducts.map((p) => ({
        productName: p.productName,
        qty: p.qty,
        price: p.productPrice,
        offerPrice: p.offerPrice,
        total: p.total,
      })),
      labourCharges: Number(labourCharges),
      grandTotal,
    };

    try {
      const result = await addBillingDetailsApi(billingData, reqHeader);
      if (result.status === 200) {
        toast.success("Details added successfully");
        setBillingDetails({
          billingUserName: "",
          billingVehicleName: "",
          billingVehicleNumber: "",
          billingPhoneNumber: "",
        });
        setSelectedProducts([]);
        setLabourCharges(0);
      } else {
        toast.error("Details not added");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, [searchKey]);

  return (
    <>
      <a
        href="/workshopdata"
        className="fw-bold text-info d-inline-flex align-items-center mb-3 ms-3 mt-3"
        style={{ textDecoration: "none" }}
      >
        <i className="fa-solid fa-arrow-left me-2"></i> Back
      </a>

      <Container className="my-3">
        <Row className="g-3">
          {/* Left - Billing Form & Product Search */}
          <Col xs={12} lg={7}>
            {/* Billing Form */}
            <Card className="shadow-sm border-0 rounded p-3 mb-3" style={{ fontSize: "0.9rem" }}>
              <h5 className="text-info fw-bold mb-3">Billing Details</h5>
              <Form>
                <Row>
                  <Col xs={12} md={6} className="mb-2">
                    <Form.Label className="mb-1">Full Name</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="Enter full name"
                      value={billingDetails.billingUserName}
                      onChange={(e) =>
                        setBillingDetails({ ...billingDetails, billingUserName: e.target.value })
                      }
                    />
                  </Col>
                  <Col xs={12} md={6} className="mb-2">
                    <Form.Label className="mb-1">Phone</Form.Label>
                    <Form.Control
                      size="sm"
                      type="tel"
                      placeholder="Enter phone number"
                      value={billingDetails.billingPhoneNumber}
                      maxLength={10}
                      onChange={(e) =>
                        setBillingDetails({ ...billingDetails, billingPhoneNumber: e.target.value.replace(/\D/g, "") })
                      }
                    />
                  </Col>
                </Row>

                <Row>
                  <Col xs={12} md={6} className="mb-2">
                    <Form.Label className="mb-1">Vehicle Name</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="Enter Vehicle name"
                      value={billingDetails.billingVehicleName}
                      onChange={(e) =>
                        setBillingDetails({ ...billingDetails, billingVehicleName: e.target.value.toUpperCase() })
                      }
                    />
                  </Col>

                  <Col xs={12} md={6} className="mb-2">
                    <Form.Label className="mb-1">Vehicle Number</Form.Label>
                    <Form.Control
                      size="sm"
                      type="text"
                      placeholder="Enter Vehicle number"
                      value={billingDetails.billingVehicleNumber}
                      onChange={(e) =>
                        setBillingDetails({ ...billingDetails, billingVehicleNumber: formatVehicleNumber(e.target.value) })
                      }
                      maxLength={13}
                    />
                  </Col>
                </Row>
              </Form>
            </Card>

            {/* Product Search */}
            <Card className="shadow-sm border-0 rounded p-3 mb-5">
              <h5 className="text-info fw-bold mb-3">Search & Add Products</h5>
              <Form.Control
                type="text"
                placeholder="Search products..."
                className="mb-3"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <Row className="g-3">
                {searchKey && allProducts?.length > 0 ? (
                  allProducts.map((item, index) => (
                    <Col xs={12} sm={6} md={4} key={index}>
                      <Card className="h-100 shadow-sm text-center p-2">
                        <img
                          src={`${serverUrl}/uploads/${item.productImage}`}
                          alt={item.productName}
                          style={{ height: "120px", objectFit: "contain" }}
                          className="mb-2"
                        />
                        <h6>{item.productName}</h6>
                        <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                          <span className="text-muted text-decoration-line-through">
                            ₹{item.productPrice}
                          </span>
                          <span className="text-success fw-bold">₹{item.offerPrice}</span>
                        </div>
                        <Button
                          variant="info"
                          size="sm"
                          className="w-100 fw-bold"
                          onClick={() => handleAddProduct(item)}
                        >
                          + Add
                        </Button>
                      </Card>
                    </Col>
                  ))
                ) : searchKey && allProducts?.length === 0 ? (
                  <p className="text-muted text-center">No products found</p>
                ) : (
                  <p className="text-muted text-center">Type to search for products...</p>
                )}
              </Row>
            </Card>
          </Col>

          {/* Right - Billing Summary */}
          <Col xs={12} lg={5}>
            <div className="position-lg-sticky" style={{ top: "15px" }}>
              <Card className="shadow-sm border-0 rounded p-3 mb-5">
                <h5 className="text-info fw-bold mb-3">Billing Summary</h5>

                <Table bordered hover size="sm" responsive className="text-center align-middle">
                  <thead>
                    <tr className="table-light">
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProducts.length > 0 ? (
                      selectedProducts.map((product, index) => (
                        <tr key={index}>
                          <td>{product.productName}</td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center gap-2">
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => decreaseQty(product._id)}
                              >
                                -
                              </Button>
                              <span className="fw-bold">{product.qty}</span>
                              <Button
                                variant="outline-secondary"
                                size="sm"
                                onClick={() => increaseQty(product._id)}
                              >
                                +
                              </Button>
                            </div>
                          </td>

                          <td>₹{product.total}</td>
                          <td className="text-center">
                            <span
                              className="text-danger fw-bold"
                              style={{ cursor: "pointer" }}
                              onClick={() => removeProduct(product._id)}
                            >
                              Remove
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-muted text-center">
                          No products added yet
                        </td>
                      </tr>
                    )}

                    <tr>
                      <td colSpan="3" className="fw-bold text-end">
                        Labour Charges
                      </td>
                      <td className="fw-bold text-dark text-center">
                        <Form.Control
                          type="number"
                          size="sm"
                          value={labourCharges}
                          onChange={(e) => setLabourCharges(e.target.value)}
                        />
                      </td>
                    </tr>

                    <tr>
                      <td colSpan="3" className="fw-bold text-end">
                        Total
                      </td>
                      <td className="fw-bold text-success text-center">₹{grandTotal}</td>
                    </tr>
                  </tbody>
                </Table>

                <Button
                  variant="info"
                  size="lg"
                  className="w-100 fw-bold"
                  onClick={handleAddDetails}
                >
                  Add Details
                </Button>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>

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

export default Billing;
