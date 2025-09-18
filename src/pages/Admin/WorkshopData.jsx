import React from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';




function WorkshopData() {
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
<h2 className="fw-bold text-info">Worksop billings</h2>
</div>

{/* Top Cards */}
<Row className="mb-4 g-4">
{/* Home */}
<Col md={4}>
  <Link style={{ textDecoration: "none" }} to={"/billing"}>
    <Card className="shadow-sm h-100 text-center p-3">
      <div
        className="d-flex justify-content-center align-items-center mb-3"
        style={{ height: "60px" }}
      >
        <span style={{ fontSize: "2rem", color: "#0d6efd" }}>💳</span>
      </div>
      <h5 className="fw-bold text-info">Customer Billings</h5>
      <p className="text-dark fw-semibold">
        Customer billings based on thire needs of vehicles.. 
      </p>
    </Card>
  </Link>
</Col>

{/* Products */}
<Col md={4}>
  <Link style={{ textDecoration: "none" }} to={"/viewbilling"}>
    <Card className="shadow-sm h-100 text-center p-3">
      <div
        className="d-flex justify-content-center align-items-center mb-3"
        style={{ height: "60px" }}
      >
       <span style={{ fontSize: "2rem", color: "#0d6efd" }}>🧾</span>


      </div>
      <h5 className="fw-bold text-info">View Billed customers</h5>
      <p className="text-dark fw-semibold">
        Browse, add, edit   and manage all available Parts and Accesories for the customer.
      </p>
    </Card>
  </Link>
</Col>

</Row>
</Container>
    </>
  )
}

export default WorkshopData
