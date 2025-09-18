
import React from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';


function UiEdits() {
  return (
    <>
      <Container className="mt-4">

          {/* Back Button */}
          <a
          href="/admin"
          className="fw-bold text-info d-inline-flex align-items-center mb-3"
          style={{ textDecoration: "none" }}
        >
          <i className="fa-solid fa-arrow-left me-2"></i> Back
        </a>
        {/* Page Title */}
        <div className="text-center mb-4">
          <h2 className="fw-bold text-info">UI Edits</h2>
        </div>

        {/* Top Cards */}
        <Row className="mb-4 g-4">
          {/* Home */}
          <Col md={4}>
            <Link style={{ textDecoration: "none" }} to={"/displayhomeproducts"}>
              <Card className="shadow-sm h-100 text-center p-3">
                <div
                  className="d-flex justify-content-center align-items-center mb-3"
                  style={{ height: "60px" }}
                >
                  <i
                    className="fa-solid fa-house fa-2xl"
                    style={{ color: "#0d6efd" }}
                  ></i>
                </div>
                <h5 className="fw-bold text-info">Home Display Products,</h5>
                <h5 className="fw-bold text-info">Edit/Delete Products</h5>
                <p className="text-dark fw-semibold">
                  Access your dashboard and navigate to all core features in one place.
                </p>
              </Card>
            </Link>
          </Col>

          {/* Products */}
          <Col md={4}>
            <Link style={{ textDecoration: "none" }} to={"/addproducts"}>
              <Card className="shadow-sm h-100 text-center p-3">
                <div
                  className="d-flex justify-content-center align-items-center mb-3"
                  style={{ height: "60px" }}
                >
                  <i
                    className="fa-solid fa-calendar fa-2xl"
                    style={{ color: "#198754" }}
                  ></i>
                </div>
                <h5 className="fw-bold text-info">Add Products</h5>
                <p className="text-dark fw-semibold">
                  Browse, add, and manage all available products in the system.
                </p>
              </Card>
            </Link>
          </Col>

          {/* Services */}
          <Col md={4}>
            <Link style={{ textDecoration: "none" }} to={"/banner"}>
              <Card className="shadow-sm h-100 text-center p-3">
                <div
                  className="d-flex justify-content-center align-items-center mb-3"
                  style={{ height: "60px" }}
                >
                  <i
                    className="fa-solid fa-globe fa-2xl"
                    style={{ color: "#6f42c1" }}
                  ></i>
                </div>
                <h5 className="fw-bold text-info">Banner</h5>
                <p className="text-dark fw-semibold">
                  Monitor, edit, and update all active service offerings.
                </p>
              </Card>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default UiEdits;