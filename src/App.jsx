import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Auth from "./pages/Auth";
import Services from "./pages/Services";
import "./App.css";
import NotFound from "./pages/NotFound";
import Header from './Components/Header'
import Footer from './Components/Footer'
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Aboutus from "./pages/Aboutus";
import Admin from "./pages/Admin/Admin";
import Orders from "./pages/Admin/Orders";
import Testimonials from "./pages/Admin/Testimonials";
import Booked from "./pages/Admin/Booked";
import FreeQuote from "./pages/Admin/FreeQuote";
import UiEdits from "./pages/Admin/UiEdits";
import Billing from "./pages/Admin/Billing";
import Banner from "./pages/Admin/Banner";
import JoinUs from "./pages/JoinUs";
import Privacy from "./pages/Privacy";
import AddProducts from "./pages/Admin/AddProducts";
import DisplayHomeProducts from "./pages/Admin/DisplayHomeProducts";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import ConfirmedServices from "./pages/Admin/ConfirmedServices";
import ConfirmedQuotes from "./pages/Admin/ConfirmedQuotes";
import MyOrders from "./pages/MyOrders";
import ViewBilling from "./pages/Admin/ViewBilling";
import WorkshopData from "./pages/Admin/WorkshopData";



function App() {


  // state to not route

  const [isAuthorized,setIsAuthorized]=useState(false)

  useEffect(()=>{

    if(sessionStorage.getItem("token") &&  sessionStorage.getItem("userRole") === "admin"){
      setIsAuthorized(true)
    }else{
      setIsAuthorized(false)
    }
  },[])


  const location = useLocation()


  // Paths where you don't want the Header

  const hideHeaderPaths = ['/login', '/register'];
  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);


  const hideFooterPaths = ['/login','/register','/aboutus','/admin','/billing','/booked','/orders','/uiedits','/testimonials','/freequote','/confirmedservices','/banner','/confirmedquotes','/displayhomeproducts','/addproducts','/viewbilling','/workshopdata']

  const shouldHideFooter = hideFooterPaths.includes(location.pathname)


  return (
    <>
    
    {
      !shouldHideHeader && <Header/> 
    }



      <Routes>
        <Route path="/" element={<Home />} />

        {/* Pass the prop correctly */}
        <Route path="/register" element={<Auth login={false} />} />
        <Route path="/login" element={<Auth login={true} />} />
        <Route path="/joinus" element={<JoinUs />} />
        <Route path="/privacy" element={<Privacy />} />



        {/* Pages */}
        <Route path="/products" element={<Products />} />
        <Route path="/services" element={<Services />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/myorders" element={<MyOrders />} />




        {/* Admin */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/orders" element={isAuthorized?<Orders />:<Home/>} />
        <Route path="/testimonials" element={isAuthorized?<Testimonials />:<Home/>} />
        <Route path="/booked" element={isAuthorized?<Booked />:<Home/>} />
        <Route path="/uiedits" element={isAuthorized?<UiEdits />:<Home/>} />
        <Route path="/freequote" element={isAuthorized?<FreeQuote />:<Home/>} />
        <Route path="/billing" element={isAuthorized?<Billing />:<Home/>} />
        <Route path="/confirmedservices" element={isAuthorized?<ConfirmedServices />:<Home/>} />
        <Route path="/banner" element={isAuthorized?<Banner />:<Home/>} />
        <Route path="/addproducts" element={isAuthorized?<AddProducts />:<Home/>} />
        <Route path="/displayhomeproducts" element={isAuthorized?<DisplayHomeProducts/>:<Home/>} />
        <Route path="/confirmedquotes" element={isAuthorized?<ConfirmedQuotes/>:<Home/>} />
        <Route path="/viewbilling" element={isAuthorized?<ViewBilling/>:<Home/>} />
        <Route path="/workshopdata" element={isAuthorized?<WorkshopData/>:<Home/>} />

        

        {/* Optional */}
        <Route path="*" element={<NotFound />} />
      </Routes>


        {/* Keep ToastContainer global */}
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

      
      {!shouldHideFooter && <Footer/> }
        
    </>
  );
}

export default App;
