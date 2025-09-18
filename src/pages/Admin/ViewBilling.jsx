import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Container,
  Table,
  Modal,
  Form,
  Row,
  Col,
  InputGroup,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import {
  deleteBillingDetailsApi,
  getAllProductToBillingApi,
  getBillingDetailsApi,
  updateBillingDetailsApi,
} from "../../Services/allApi";
import { serverUrl } from "../../Services/serverUrl";
import QR_Code from "../../assets/QR/qrcode.jpg";
import "react-toastify/dist/ReactToastify.css";

function ViewBilling() {
  const [getAddedBillings, setGetAddedBillings] = useState([]);

  // 🔹 State for edit modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState(null);

  // geting products to implement search
  const [allProducts, setAllProducts] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [searchVehicle, setSearchVehicle] = useState("");
  // console.log(searchVehicle);

  const handleClose = () => setShowEditModal(false);
  const handleShow = (billing) => {
    setSelectedBilling(billing);
    setShowEditModal(true);
  };

  // Fetch products
  const getAllProducts = async () => {
    const result = await getAllProductToBillingApi(searchKey);
    if (result.status === 200) setAllProducts(result.data);
    else setAllProducts(result.response.data);
  };

  // get billing details
  const getBillingsToView = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Admin login required");
      return;
    }

    const reqHeader = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const result = await getBillingDetailsApi(reqHeader, searchVehicle);
      if (result?.data) {
        setGetAddedBillings(result.data);
      } else {
        setGetAddedBillings([]);
      }
    } catch (err) {
      console.error("Error fetching billing:", err);
      toast.error("Something went wrong");
    }
  };

  // delete billing
  const deleteAddedBillings = async (id) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Admin login required");
      return;
    }
    const reqHeader = {
      Authorization: `Bearer ${token}`,
    };
    try {
      const result = await deleteBillingDetailsApi(id, reqHeader);
      if (result.status === 200) {
        getBillingsToView();
        toast.success("Bills deleted successfully");
      } else {
        toast.error("Something went wrong");
      }
    } catch (err) {
      toast.error(err);
    }
  };

  // ===============================
  // Product Management in Modal

  const calculateGrandTotal = (products, labourCharges) => {
    const productTotal = products.reduce((acc, p) => acc + (p.total || 0), 0);
    return productTotal + (labourCharges || 0);
  };

  const increaseQty = (productId) => {
    const updatedProducts = selectedBilling.products.map((p) =>
      p._id === productId
        ? {
            ...p,
            qty: p.qty + 1,
            total: (p.offerPrice || p.price) * (p.qty + 1),
          }
        : p
    );
    setSelectedBilling({
      ...selectedBilling,
      products: updatedProducts,
      grandTotal: calculateGrandTotal(
        updatedProducts,
        selectedBilling.labourCharges
      ),
    });
  };

  const decreaseQty = (productId) => {
    const updatedProducts = selectedBilling.products.map((p) =>
      p._id === productId && p.qty > 1
        ? {
            ...p,
            qty: p.qty - 1,
            total: (p.offerPrice || p.price) * (p.qty - 1),
          }
        : p
    );
    setSelectedBilling({
      ...selectedBilling,
      products: updatedProducts,
      grandTotal: calculateGrandTotal(
        updatedProducts,
        selectedBilling.labourCharges
      ),
    });
  };

  const removeProduct = (productId) => {
    const updatedProducts = selectedBilling.products.filter(
      (p) => p._id !== productId
    );
    setSelectedBilling({
      ...selectedBilling,
      products: updatedProducts,
      grandTotal: calculateGrandTotal(
        updatedProducts,
        selectedBilling.labourCharges
      ),
    });
  };

  const handleAddProduct = (item) => {
    const alreadyExists = selectedBilling.products.some(
      (p) => p._id === item._id
    );
    if (alreadyExists) {
      toast.info("Product already added");
      return;
    }

    const newProduct = {
      _id: item._id,
      productName: item.productName,
      qty: 1,
      price: item.productPrice,
      offerPrice: item.offerPrice,
      total: item.offerPrice || item.productPrice,
    };

    const updatedProducts = [...selectedBilling.products, newProduct];
    setSelectedBilling({
      ...selectedBilling,
      products: updatedProducts,
      grandTotal: calculateGrandTotal(
        updatedProducts,
        selectedBilling.labourCharges
      ),
    });
  };

  // =============== Save Changes to Backend================

  const handleSaveChanges = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      toast.error("Admin login required");
      return;
    }
    const reqHeader = {
      Authorization: `Bearer ${token}`,
    };

    try {
      const result = await updateBillingDetailsApi(
        selectedBilling._id,
        selectedBilling,
        reqHeader
      );
      if (result.status === 200) {
        toast.success("Billing updated successfully");
        getBillingsToView();
        handleClose();
      } else {
        toast.error("Failed to update billing");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error updating billing");
    }
  };

  // pdf generating
  const handlePrintBill = (billing) => {
    const printWindow = window.open("", "_blank", "width=800,height=600");

    const productsRows = billing.products
      .map(
        (p, idx) => `
        <tr>
          <td>${idx + 1}</td>
          <td>${p.productName}</td>
          <td>${p.qty}</td>
          <td>₹${p.total}</td>
        </tr>
      `
      )
      .join("");

    const htmlContent = `
      <html>
        <head>
          <title>Billing - CUSTOM RODZ</title>
          <style>
            @page { size: A4; margin: 20px; }
            body { font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9; }
            h2 { color: #0d6efd; text-align: center; margin-bottom: 20px; }
            .top-section { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
            .customer-info { text-align: left; }
            .customer-info p { margin: 4px 0; }
            .qr-section { text-align: center; }
            .qr-section img {
              width: 100px;
              height: 100px;
              border: 2px solid #0d6efd;
              border-radius: 10px;
              padding: 5px;
              background-color: #ffffff;
            }
            .qr-section p {
              margin-top: 5px;
              font-weight: bold;
              font-size: 14px;
              color: #0d6efd;
            }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; background-color: #ffffff; }
            th, td { border: 1px solid #000; padding: 8px; text-align: center; }
            th { background-color: #0d6efd; color: #fff; }
            .total { font-weight: bold; color: green; }
          </style>
        </head>
        <body>
        <h2 style="color: black; text-decoration: underline;">
  CUSTOM-RODZ INVOICE
</h2>

  
          <div class="top-section">
            <div class="customer-info">
              <p><strong>Customer Name:</strong> ${billing.billingUserName}</p>
              <p><strong>Vehicle Name:</strong> ${
                billing.billingVehicleName
              }</p>
              <p><strong>Vehicle Number:</strong> ${
                billing.billingVehicleNumber
              }</p>
              <p><strong>Phone:</strong> ${billing.billingPhoneNumber}</p>
            </div>
  
            <div class="qr-section">
              <img src="${QR_Code}" alt="QR Code"/>
              <p>CUSTOM RODZ</p>
            </div>
          </div>
  
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${productsRows}
              <tr>
                <td colspan="3">Labour Charges</td>
                <td>₹${billing.labourCharges}</td>
              </tr>
              <tr>
                <td colspan="3" class="total">Grand Total</td>
                <td class="total">₹${billing.grandTotal}</td>
              </tr>
            </tbody>
          </table>
  
          <p style="text-align:center;"><strong>Date:</strong> ${new Date(
            billing.createdAt
          ).toLocaleDateString()}</p>
  
          <script>window.print();</script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  useEffect(() => {
    getBillingsToView();
    getAllProducts();
  }, [searchKey, searchVehicle]);

  return (
    <>
      <a
        href="/workshopdata"
        className="fw-bold text-info d-inline-flex align-items-center mb-3"
        style={{ textDecoration: "none", marginTop: "15px", marginLeft: "15px" }}
      >
        <i className="fa-solid fa-arrow-left me-2"></i> Back
      </a>

      <Container fluid>
        <Card className="shadow-sm border-0 rounded mb-5">
          <h3 className="text-info fw-bolder mb-2  d-inline-flex justify-content-center">
            Billed List
          </h3>
          <p className="text-center text-muted fw-bolder">
            Search and update the billed list summery here.
          </p>
          <Row className="mb-3 justify-content-center">
            <Col md={4} className="mt-2 mb-2">
              <InputGroup>
                <Form.Control
                  type="text"
                  placeholder="Search by Vehicle Number / Phone"
                  value={searchVehicle}
                  onChange={(e) => setSearchVehicle(e.target.value)}
                />
                <InputGroup.Text className="bg-primary">
                  <i className="fa fa-search text-light fa-lg"></i>
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>

          <Table
            striped
            bordered
            hover
            responsive
            className="align-middle text-center"
          >
            <thead className="table-light ">
              <tr>
                <th className="text-light bg-info">#</th>
                <th className="text-light bg-info">Customer Name</th>
                <th className="text-light bg-info">Vehicle Name</th>
                <th className="text-light bg-info">Vehicle Number</th>
                <th className="text-light bg-info">Phone</th>
                <th className="text-light bg-info">Items</th>
                <th className="text-light bg-info">Labour Charges</th>
                <th className="text-light bg-info">Grand Total</th>
                <th className="text-light bg-info">Date</th>
                <th className="text-light bg-info">Action</th>
              </tr>
            </thead>
            <tbody>
              {getAddedBillings?.length > 0 ? (
                getAddedBillings.map((item, index) => (
                  <tr key={index} className="text-dark fw-bolder">
                    <td>{index + 1}</td>
                    <td>{item.billingUserName}</td>
                    <td>{item.billingVehicleName}</td>
                    <td>{item.billingVehicleNumber}</td>
                    <td>{item.billingPhoneNumber}</td>
                    <td className="text-start">
                      {item.products?.length > 0 ? (
                        item.products.map((p, i) => (
                          <div key={i}>
                            {p.productName} (x{p.qty}) – ₹{p.total}
                          </div>
                        ))
                      ) : (
                        <span className="text-muted">No products</span>
                      )}
                    </td>
                    <td>₹{item.labourCharges}</td>
                    <td className="fw-bold text-success">₹{item.grandTotal}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center align-items-center gap-2">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => deleteAddedBillings(item?._id)}
                        >
                          <i className="fa-solid fa-trash"></i>
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleShow(item)}
                        >
                          <i className="fa-solid fa-pen"></i>
                        </Button>
                        <Button
                          variant="info"
                          size="sm"
                          onClick={() => handlePrintBill(item)}
                        >
                          <i className="fa-solid fa-print"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-muted text-center">
                    No bills available
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
      </Container>

      {/* 🔹 Edit Modal */}
      <Modal show={showEditModal} onHide={handleClose} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Edit Billing</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container fluid>
            <Row>
              {/* Left - Search & Add Products */}
              <Col md={7}>
                <Card className="shadow-sm border-0 rounded p-3 mb-4">
                  <h5 className="text-info fw-bold mb-3">
                    Search & Add Products
                  </h5>
                  <Form.Control
                    type="text"
                    placeholder="Search products..."
                    className="mb-3"
                    value={searchKey}
                    onChange={(e) => setSearchKey(e.target.value)}
                  />
                  <Row className="g-3">
                    {searchKey ? (
                      allProducts?.length > 0 ? (
                        allProducts.map((item, index) => (
                          <Col md={4} sm={6} xs={12} key={index}>
                            <Card className="h-100 shadow-sm text-center p-2">
                              <img
                                src={`${serverUrl}/uploads/${item.productImage}`}
                                alt={item.productName}
                                style={{
                                  height: "100px",
                                  objectFit: "contain",
                                }}
                                className="mb-2"
                              />
                              <h6>{item.productName}</h6>
                              <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                                <span className="text-muted text-decoration-line-through">
                                  ₹{item.productPrice}
                                </span>
                                <span className="text-success fw-bold">
                                  ₹{item.offerPrice}
                                </span>
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
                      ) : (
                        <p className="text-muted text-center">
                          No products found
                        </p>
                      )
                    ) : (
                      <p className="text-muted text-center">
                        Type to search for products...
                      </p>
                    )}
                  </Row>
                </Card>
              </Col>

              {/* Right - Billing Summary */}
              <Col md={5}>
                <div style={{ position: "sticky", top: "15px" }}>
                  <Card className="shadow-sm border-0 rounded p-3">
                    <h5 className="text-info fw-bold mb-3">Billing Summary</h5>

                    <Table
                      bordered
                      hover
                      size="sm"
                      className="text-center align-middle"
                    >
                      <thead>
                        <tr className="table-light">
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th>Delete</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedBilling?.products?.length > 0 ? (
                          selectedBilling.products.map((product, index) => (
                            <tr key={index}>
                              <td>{product.productName}</td>
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

                        {/* Labour Charges */}
                        <tr>
                          <td colSpan="3" className="fw-bold text-end">
                            Labour Charges
                          </td>
                          <td className="fw-bold text-dark text-center">
                            <Form.Control
                              type="number"
                              size="sm"
                              value={selectedBilling?.labourCharges || ""}
                              onChange={(e) => {
                                const newCharges = Number(e.target.value);
                                setSelectedBilling({
                                  ...selectedBilling,
                                  labourCharges: newCharges,
                                  grandTotal: calculateGrandTotal(
                                    selectedBilling.products,
                                    newCharges
                                  ),
                                });
                              }}
                            />
                          </td>
                        </tr>

                        {/* Total */}
                        <tr>
                          <td colSpan="3" className="fw-bold text-end">
                            Total
                          </td>
                          <td className="fw-bold text-success text-center">
                            ₹{selectedBilling?.grandTotal || 0}
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card>
                </div>
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="info" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="top-right" autoClose={2000} />
    </>
  );
}

export default ViewBilling;
