import React, { useEffect, useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
} from "recharts";



function Admin() {
  

  const navigate = useNavigate()
  const[isUsername,setIsUsername]=useState( "")

  // user role

  useEffect(()=>{

     const token = sessionStorage.getItem("token")
     const savedUsername = sessionStorage.getItem("username")
     const userRole = sessionStorage.getItem("userRole")
    
     setIsUsername(savedUsername)

    if (!token) {
      toast.error('Please login!!.. to access admin panel')
      navigate('/login')
      return
    }

    if(!savedUsername || userRole !== 'admin'){
      toast.error('Access denied. Admin privilages required!!')
      navigate('/')
      return
    }
  },[navigate])



  
  
  // bar chart

const chartData = [
  { name: "Orders", value: 25 },
  { name: "Booked Services", value: 15 },
  { name: "UI Edits", value: 8 },
  { name: "Testimonials", value: 12 },
  { name: "Free Quote", value: 20 },
  { name: "Workshop", value: 18 },
  { name: "Billing", value: 10 },
  { name: "Home Products", value: 30 },
];


  // ✅ Calculate total AFTER chartData is defined
const total = chartData.reduce((acc, item) => acc + item.value, 0);

// ✅ Custom Tooltip (shows values + percentage)
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const value = payload[0].value;
    const percent = ((value / total) * 100).toFixed(1);
    return (
      <div
        style={{
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "10px",
          fontWeight: "bold",
        }}
      >
        <p style={{ margin: 0, color: "#333" }}>{label}</p>
        <p style={{ margin: 0, color: "#0d6efd" }}>Value: {value}</p>
        <p style={{ margin: 0, color: "#28a745" }}>{percent}% of total</p>
      </div>
    );
  }
  return null;
};


  return (

    
    
    // header contents//
    
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>

      {/* dahsboard contents */}
       {/* ✅ Admin Dashboard Heading */}
  <h2 className="text-center fw-bolder  mt-4" style={{ color: "#001f3f",textDecoration:'underline' }}>
     Admin Dashboard 📊
  </h2>

    <Container className="mt-4">

    <div style={{ width: "100%", height: "100%" }}>
  <ResponsiveContainer
    width="100%"
    height={window.innerWidth < 768 ? 300 : 400} // shorter height on mobile
  >
    <BarChart
      data={chartData}
      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#333" }} />
      <YAxis />
      <Tooltip content={<CustomTooltip />} />

      {/* Gradient Definitions */}
      <defs>
        <linearGradient id="navyGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#001f3f" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#001f3f" stopOpacity={0.4} />
        </linearGradient>
        <linearGradient id="yellowGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFD700" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#FFD700" stopOpacity={0.4} />
        </linearGradient>
        <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF4136" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#FF4136" stopOpacity={0.4} />
        </linearGradient>
        <linearGradient id="violetGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8A2BE2" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#8A2BE2" stopOpacity={0.4} />
        </linearGradient>
      </defs>

      <Bar dataKey="value" radius={[20, 20, 0, 0]} barSize={window.innerWidth < 768 ? 30 : 50}>
        <Cell fill="url(#navyGradient)" />
        <Cell fill="url(#yellowGradient)" />
        <Cell fill="url(#redGradient)" />
        <Cell fill="url(#violetGradient)" />
        <Cell fill="url(#navyGradient)" />
        <Cell fill="url(#yellowGradient)" />
        <Cell fill="url(#redGradient)" />
        <Cell fill="url(#violetGradient)" />
        <LabelList
          dataKey="value"
          position="top"
          fill="#333"
          fontSize={window.innerWidth < 768 ? 12 : 14}
          fontWeight="bold"
        />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
</div>




      {/* Page Title */}
      <div className="text-center mb-4 mt-5">
        <h2 className="fw-bold text-info">Admin Dashboard</h2>
        <p className="text-dark fw-bolder">Welcome back, {isUsername}</p>
      </div>

      {/* Top Cards */}
      <Row className="mb-4 g-4">
        {/* Customer Orders */}
        <Col md={4}>
          <Link style={{ textDecoration: "none" }} to={"/orders"}>
            <Card className="shadow-sm h-100 text-center p-3">
              <div
                className="d-flex justify-content-center align-items-center mb-3"
                style={{ height: "60px" }}
              >
                <i
                  className="fa-solid fa-cart-arrow-down fa-2xl"
                  style={{ color: "#007bff" }}
                ></i>
              </div>
              <h5 className="fw-bold text-info">Customer Orders</h5>
              <p className="text-dark fw-bold">
                Manage customer orders and track delivery status
              </p>
            </Card>
          </Link>
        </Col>

        {/* Booked Services */}
        <Col md={4}>
          <Link style={{ textDecoration: "none" }} to={"/booked"}>
            <Card className="shadow-sm h-100 text-center p-3">
              <div
                className="d-flex justify-content-center align-items-center mb-3"
                style={{ height: "60px" }}
              >
                <i
                  className="fa-solid fa-square-check fa-2xl"
                  style={{ color: "#28a745" }}
                ></i>
              </div>
              <h5 className="fw-bold text-info">Booked Services</h5>
              <p className="text-dark fw-bold">
                View and manage service appointments
              </p>
            </Card>
          </Link>
        </Col>

        {/* UI Edits */}
        <Col md={4}>
          <Link style={{ textDecoration: "none" }} to={"/uiedits"}>
            <Card className="shadow-sm h-100 text-center p-3">
              <div
                className="d-flex justify-content-center align-items-center mb-3"
                style={{ height: "60px" }}
              >
                <i
                  className="fa-solid fa-pen-to-square fa-2xl"
                  style={{ color: "#ffc107" }}
                ></i>
              </div>
              <h5 className="fw-bold text-info">UI Edits</h5>
              <div className="mt-2 text-danger">
                <i
                  className="fa-solid fa-house me-2"
                  style={{ color: "#0d6efd" }}
                ></i>{" "}
                Home
              </div>
              <div className="mt-2 text-danger">
                <i
                  className="fa-solid fa-calendar me-2"
                  style={{ color: "#198754" }}
                ></i>{" "}
                Add Products
              </div>
              <div className="mt-2 text-danger">
                <i
                  className="fa-solid fa-globe me-2"
                  style={{ color: "#6f42c1" }}
                ></i>{" "}
                Banner
              </div>
            </Card>
          </Link>
        </Col>

        {/* Testimonials */}
        <Col md={4}>
          <Link style={{ textDecoration: "none" }} to={"/testimonials"}>
            <Card className="shadow-sm h-100 text-center p-3">
              <div
                className="d-flex justify-content-center align-items-center mb-3"
                style={{ height: "60px" }}
              >
                <i
                  className="fa-solid fa-message fa-2xl"
                  style={{ color: "#0d6efd" }}
                ></i>
              </div>
              <h5 className="fw-bold text-info">Testimonials</h5>
              <p className="text-dark fw-bold">
                Read what our happy customers have to say about their experience
                with us.
              </p>
            </Card>
          </Link>
        </Col>

        {/* Free Quote */}
        <Col md={4}>
          <Link style={{ textDecoration: "none" }} to={"/freequote"}>
            <Card className="shadow-sm h-100 text-center p-3">
              <div
                className="d-flex justify-content-center align-items-center mb-3"
                style={{ height: "60px" }}
              >
                <i
                  className="fa-solid fa-file-pen fa-2xl"
                  style={{ color: "#28a745" }}
                ></i>
              </div>
              <h5 className="fw-bold text-info">Free Quote</h5>
              <p className="text-dark fw-bold">
                Get a personalized service estimate at no cost. Quick, easy, and
                hassle-free!
              </p>
            </Card>
          </Link>
        </Col>

        {/* billing */}

        <Col md={4}>
          <Link style={{ textDecoration: "none" }} to={"/workshopdata"}>
            <Card className="shadow-sm h-100 text-center p-3">
              <div
                className="d-flex justify-content-center align-items-center mb-3"
                style={{ height: "60px" }}
              >
                <i
                  className="fa-solid fa-receipt fa-2xl"
                  style={{ color: "#ffc107" }}
                ></i>
              </div>
              <h5 className="fw-bold text-info">Worksop Details</h5>
              <p className="text-dark fw-bold">
                Manage Billings, track payment history, and generate detailed
                billing reports with ease. Keep your finances transparent and
                organized.
              </p>
            </Card>
          </Link>
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

    </div>
  );
}

export default Admin;
