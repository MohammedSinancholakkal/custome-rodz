import React, { useEffect, useState } from 'react';
import { Button, Carousel} from 'react-bootstrap';
import '../App.css';
import {
  faCalendarAlt,
  faHandshake,
  faShieldAlt,
  faMotorcycle,
  faWarehouse,
  faOilCan
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import A247 from '../assets/247.svg';
import Apickupdrop from '../assets/pickupdrop.svg';
import Aupdating from '../assets/updating.svg';
import Awtsp from '../assets/wtsp.svg';
import navyblue from '../assets/navyblue.png';
import AddTestimonial from '../Components/AddTestimonials';
import ContactModal from '../Components/ContactModal';
import { useLocation, useNavigate } from 'react-router-dom';
import { addQuoteApi, getBannerToServicesApi } from '../Services/allApi';
import { serverUrl } from '../Services/serverUrl';
import { toast, ToastContainer } from 'react-toastify';



function Service() {
  
  const [showModal, setShowModal] = useState(false);

  const location = useLocation();


  // state to get baner
  const[getBanner,setGetBanner]=useState([])


  const navigate= useNavigate()

  const getBannerServices = async()=>{

    const result = await getBannerToServicesApi()
    if(result.status == 200){
      setGetBanner(result.data)
    }else{
      setGetBanner(result.response.data)
    }
  }





  // add quote state

  const[addQuote,setAddQuote]=useState({

    quoteName:"",quoteEmail:"",quoteBikeModel:"",quoteMessage:""

  })

// console.log(addQuote);





  // addQuote
  const hanleAddQuote = async (e) => {
    e.preventDefault();
  
    const { quoteName, quoteEmail, quoteBikeModel, quoteMessage } = addQuote;
  
    if (!quoteName || !quoteEmail || !quoteBikeModel || !quoteMessage) {
      toast.warning("Please fill the missing fields");
    } else {

      const token = sessionStorage.getItem("token");
  
      if (!token) {
        toast.warning("Login is required");
        setTimeout(() => navigate('/login'), 1000); // wait 1s before redirect
        return;
      }
      
      
      const reqHeader = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      };
  
      //  api call

        const result = await addQuoteApi(addQuote, reqHeader);
        // console.log(result);
  
        if (result.status === 200) {
          toast.success("Quote submitted successfully!");
          // Optional: clear the form
          setAddQuote({
            quoteName: "",
            quoteEmail: "",
            quoteBikeModel: "",
            quoteMessage: ""
          });
        } else {
          toast.error("invalid formate/failed to recieve quote!");
        }
    }
  };









  useEffect(()=>{

    if(location.state?.section){
      const sectionE1 = document.getElementById(location.state.section);
      if(sectionE1){
        sectionE1.scrollIntoView({behavior:'smooth'})
      }
    }
    getBannerServices()
  },[location])
  return (
    <>


    
{
  getBanner?.length > 0 ? (
    <Carousel>
      {getBanner.map((data, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100 carousel-img"
            src={`${serverUrl}/uploads/${data.serviceBanner}`}
            alt={`Banner ${index + 1}`}
          />
          <Carousel.Caption>
            <h3 className="text-light"> "Premium Bike Workshop"</h3>
            <p> "State-of-the-art facility with certified technicians to care for your bike."</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  ) : (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100 carousel-img"
          src="https://www.allextreme.in/media/weltpixel/owlcarouselslider/images/l/e/leg-guard.jpg"
          alt="Customer Service"
        />
        <Carousel.Caption>
          <h3 className="text-light">Fast & Friendly Service</h3>
          <p>
            Get back on the road faster with our quick turnaround and dedicated support team.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  )
}



{/* <FloatingMenu />  */}

      {/* Get a Free Quote Section */}
      <section id='service123_quote' className="py-5 bg-white ">
        <div className="container">
          <div className="row justify-content-center align-items-center">
            <div className="col-md-8 text-center">
              <h2 className="text-info fw-bold mb-3">Get a Free Quote</h2>
              <p className="text-muted mb-4">
                Want to know how much your repair or upgrade will cost? Fill out the form below and our team will get back to you with a free, no-obligation quote!
              </p>
              <form className="row g-3 justify-content-center">
                <div className="col-md-4">
                  <input type="text" className="form-control" placeholder="Your Name" onChange={e => setAddQuote({...addQuote,quoteName:e.target.value})}  value={addQuote.quoteName}  />
                </div>
                <div className="col-md-4">
                  <input type="email" className="form-control" placeholder="Email Address" onChange={e => setAddQuote({...addQuote,quoteEmail:e.target.value})} value={addQuote.quoteEmail}  />
                </div>
                <div className="col-md-4">
                  <input type="text" className="form-control" placeholder="Bike Model" onChange={e => setAddQuote({...addQuote,quoteBikeModel:e.target.value})} value={addQuote.quoteBikeModel}   />
                </div>
                <div className="col-12">
                  <textarea className="form-control" rows="3" placeholder="Describe your issue or request" 
                  onChange={e => setAddQuote({...addQuote,quoteMessage:e.target.value})} value={addQuote.quoteMessage} 
                   ></textarea>
                </div>
                <div className="col-12">
                  <Button onClick={hanleAddQuote} variant="info" type="submit" className="px-4 fw-bold">

                    Request Quote

                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>



      <section className="container service-container">
        <div className="service-content">
          {/* Left Side: Image */}
          <div className="service-image">
            <img
              src={navyblue}
              alt="Woman booking service"
            />
          </div>

          {/* Right Side: Text + Features */}
          <div className="service-text ">
            <h2 className='text-info  '>Book a Service</h2>
            <p className='text-info'>
              Say goodbye to service booking woes. Enjoy the convenience of booking
              a service from anywhere through WhatsApp and get live status updates
              on-the-go.
            </p>

            <div className="service-features text-info">
              <div className="feature-item">
                <img src={A247} alt="" />
                <span className='text-info'>Service workshop open all 7 days</span>
              </div>
              <div className="feature-item">
                <img src={Aupdating} alt="" />
                <span className='text-info'>Live status updates of your service</span>
              </div>
              <div className="feature-item">
                <img src={Apickupdrop} alt="" />
                <span className='text-info'>Service pick up & drop facility</span>
              </div>
              <div className="feature-item">
                <img src={Awtsp} alt="" />
                <span className='text-info'>Easy booking through WhatsApp</span>
              </div>
            </div>

            <button className="book-btn btn-info" onClick={() => setShowModal(true)}>Book Service</button>
            {showModal && <ContactModal show={showModal} handleClose={() => setShowModal(false)} />}
          </div>
        </div>
      </section>




      <section className="features text-info">
        <h2 className="features-title text-info">Customised Care For All Your Needs</h2>
        <div className="features-grid">
          <div className="feature-item">
            {/* <img src="/icons/workshop.svg" alt="Workshop Icon" /> */}
            <FontAwesomeIcon icon={faWarehouse} size="2x" className="mb-3 text-info" />
            <p className="text-info">Service Workshop<br />Open All 7 Days</p>
          </div>
          <div className="feature-item">
            <FontAwesomeIcon icon={faMotorcycle} size="2x" className="mb-3 text-info" />
            <p className="text-info">Service Pick Up &<br />Drop Facility</p>
          </div>
          <div className="feature-item">
            <FontAwesomeIcon icon={faOilCan} size="2x" className="mb-3 text-info" />
            <p className="text-info">Genuine Parts<br />& Oil</p>
          </div>
          <div className="feature-item">
            <FontAwesomeIcon icon={faHandshake} size="2x" className="mb-3 text-info" />
            <p className="text-info">Annual Maintenance<br />Plan Coverage</p>
          </div>
          <div className="feature-item">
            <FontAwesomeIcon icon={faShieldAlt} size="2x" className="mb-3 text-info" />
            <p className="text-info">5 Years Standard<br />Warranty</p>
          </div>
          <div className="feature-item">
            <FontAwesomeIcon icon={faCalendarAlt} size="2x" className="mb-3 text-info" />
            <p className="text-info">24 x 7 Assistance<br />Through RSA</p>
          </div>
        </div>
      </section>


      <AddTestimonial />

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
  )
}

export default Service