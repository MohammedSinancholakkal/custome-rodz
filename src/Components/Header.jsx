import React, { useEffect, useState } from 'react'
import { Container, Navbar, Nav } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Header() {


  const [userRole, setUserRole] = useState("");

  // loogedin?
  const[isLoggedin,setIsLogedIn]=useState(false)

  const navigate = useNavigate()


  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const token = sessionStorage.getItem("token");
    const username = sessionStorage.getItem("username");
    const role = sessionStorage.getItem("userRole");
    setUserRole(role || "");
    setIsLogedIn(!!token && !!username);
  };

  const signOut = () => {
    const confirmLogout = window.confirm(`Are you sure you want to log out?`);
    if (confirmLogout) {
      sessionStorage.clear(); // clears all session storage items
      setIsLogedIn(false); // immediately update state
      setUserRole("");
      navigate('/'); // redirect to home
      toast.warn("Loggin Out Successfull")
    }
  };
  



  return (
    <>
      {/* Top Navbar: Sign-in, Join-Us, Privacy Policy */}
      
        {/* Top Navbar */}
        <header className="topbar">
        <nav className="topbar-nav">
          {isLoggedin ? (
           <Nav.Link onClick={signOut}>Sign Out</Nav.Link>
          ) : (
            <Link to="/login">Sign-in</Link>
          )}
          <span>|</span>
          <Link to="/joinus">Join-Us</Link>
          <span>|</span>
          <Link to="/privacy">Privacy Policy</Link>
        </nav>
      </header>

      {/* Main Navbar */}
      <Navbar className='sticky-top' bg="info" variant="dark" expand="lg">
        <Container fluid>
          {/* Brand */}
          <Navbar.Brand  className="fw-bolder" style={{cursor:'pointer'}}>
           
            <div>
                <p className='header-title '>Custom Rodz</p>
            </div>
          </Navbar.Brand>

          {/* Toggle for mobile */}
          <Navbar.Toggle aria-controls="main-navbar" />

          <Navbar.Collapse id="main-navbar">

            {/* Center navigation */}
            <Nav className="mx-auto" style={{ gap: '20px', fontWeight: 'bolder' }}>
            <Nav.Link as={Link} to="/" className="text-light nav-link active">Home</Nav.Link>
            <Nav.Link as={Link} to="/products" className="text-light nav-link">Products</Nav.Link>
            <Nav.Link as={Link} to="/services" className="text-light nav-link">Services</Nav.Link>
            {userRole === "admin" && (
             <Nav.Link as={Link} to="/admin" className="text-light nav-link">Admin</Nav.Link>
             )}
             <Nav.Link as={Link} to="/aboutus" className="text-light nav-link">About-Us</Nav.Link>
            </Nav>


            {/* Wishlist & Cart aligned to right */}
            <Nav className="ms-auto" style={{ gap: '15px' }}>
              <Nav.Link href="/wishlist" className=" wishlist text-light">
                <i className="fa-regular fa-heart"></i> 
              </Nav.Link>
              <Nav.Link href="/cart" className=" cart text-light">
                <i className="fa-solid fa-cart-shopping"></i> 
              </Nav.Link>
              <Nav.Link href="/myorders" className=" cart text-light">
              <i className="fa-solid fa-truck-fast"> </i>
              </Nav.Link>
            </Nav>

          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}

export default Header
