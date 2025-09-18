import React, { useEffect, useState } from 'react';
import { Button, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { addHomeBannerApi, addProductBannerApi, addServiceBannerApi, deleteHomeBannerApi, deleteProductApi, deleteProductBannerApi, deleteServiceBannerApi, getHomeBannerApi, getProductBannerApi, getServiceBannerApi } from '../../Services/allApi';
import { serverUrl } from '../../Services/serverUrl';
import 'react-toastify/dist/ReactToastify.css';


function Banner() {

    const [homeshow, setHomeshow] = useState(false);
    const handleCloseHome = () => setHomeshow(false);
    const handleShowHome = () => setHomeshow(true);

    const [productshow, setProductshow] = useState(false);
    const handleCloseProduct = () => setProductshow(false);
    const handleShowProduct = () => setProductshow(true);

    const [serviceshow, setServiceshow] = useState(false);
    const handleCloseService = () => setServiceshow(false);
    const handleShowService = () => setServiceshow(true);





    //=========HOMEBANNERRRR==========//


    // add home banner
    const [AddHomeBanner,setAddHomeBanner]=useState({
        bannerImage:""
    })


    // get home banner
    const[getHomeBanner,setGetHomeBanner]=useState([])



    // console.log(AddHomeBanner);

    const[preview,setPreview]=useState("")

    // console.log(preview);


    useEffect(() => {
        if (
            AddHomeBanner.bannerImage &&
          (AddHomeBanner.bannerImage.type === "image/png" ||
            AddHomeBanner.bannerImage.type === "image/jpg" ||
            AddHomeBanner.bannerImage.type === "image/jpeg"||
            AddHomeBanner.bannerImage.type === "image/webp"
         )) {
          setPreview(URL.createObjectURL(AddHomeBanner.bannerImage));
        }else{
            setPreview("");
        }
        getBanner()
      }, [AddHomeBanner.bannerImage]);


//   handleAddBanner

    const handleAddBanner = async () => {
        const { bannerImage } = AddHomeBanner;
      
        // 🚫 Stop if already 3 banners exist
        if (getHomeBanner?.length >= 3) {
          toast.error("Maximum 3 banners allowed!");
          return;
        }
      
        if (!bannerImage) {
          toast.warning("Please select a banner image");
          return;
        }
      
        const reqBody = new FormData();
        reqBody.append("bannerImage", bannerImage);
      
        const token = sessionStorage.getItem("token");
        if (token) {
          const reqHeader = {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
          };
      
          try {
            // API call
            const result = await addHomeBannerApi(reqBody, reqHeader);
            console.log(result);
      
            if (result.status === 200) {
              getBanner(); // refresh list
              toast.success("Banner added successfully");
              setAddHomeBanner({ bannerImage: "" }); // reset state
              setPreview(""); // clear preview
            } else {
              toast.error("Not added");
            }
          } catch (err) {
            toast.error("Something went wrong");
          }
        }
      };
      
// get home banner

const getBanner = async()=>{

    // api call

    const result = await getHomeBannerApi()
    if(result.status == 200){
        setGetHomeBanner(result.data)
    }else{
        setGetHomeBanner(result.response.data)

    }

}

// handledeletebanner

const handleDeleteBanner = async(id)=>{

    const token = sessionStorage.getItem("token")
    if(token){
        const reqHeader={
                "Content-Type":"multipart/form-data",
               "Authorization":`Bearer ${token}`
        }

        try{
            // apicall
            const result = await deleteHomeBannerApi(id,reqHeader)
            if(result.status == 200){
                toast.success("deleted successfully")
                getBanner()
            }else{
                toast.error("cant delete data")
            }

        }catch(err){
            toast.error("something went wrong")
        }
    }

}



//=========productBANNERRRR==========//

const [addProductBanner,setAddProductBanner]=useState({
    productBanner:""
})

const [productPreview,setProductPreview]=useState("")

const[getprdctBanner,setGetPrdctBanner]=useState([])


useEffect(()=>{
    if (
        addProductBanner.productBanner &&
      (addProductBanner.productBanner.type === "image/png" ||
        addProductBanner.productBanner.type === "image/jpg" ||
        addProductBanner.productBanner.type === "image/jpeg"||
        addProductBanner.productBanner.type === "image/webp"
     )) {
        setProductPreview(URL.createObjectURL(addProductBanner.productBanner));
    }else{
        setProductPreview("");
    }
    getProductBanner()

},[addProductBanner.productBanner])

// console.log(productPreview);


// addProductBanner

const addPDTBanner = async()=>{

    const {productBanner}=addProductBanner;

    if (getprdctBanner?.length >= 3) {
        toast.error("Maximum 3 banners allowed!");
        return;
      }
    const reqBody = new FormData()
    reqBody.append("productBanner",productBanner)

    const token = sessionStorage.getItem("token")
    if(token){
        const reqHeader={
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`,
        }

       try{
         // api call
         const result = await addProductBannerApi(reqBody,reqHeader)
         console.log(result);
         if(result.status == 200){
            getProductBanner()
             toast.success("Banner added successfully");
         }else{
             toast.error("something went wrong");
             setAddProductBanner({productBanner:""})
             setProductPreview("")
         }

       }catch(err){
        toast.error("api call failed")
       }
        
    }
}



// getProductBanner
const getProductBanner = async()=>{

    // api call

    const result = await getProductBannerApi()
    if(result.status == 200){
        setGetPrdctBanner(result.data)
    }else{
        setGetPrdctBanner(result.response.data)       
    }

}



// deleteProductBanner

const deleteProductBanner = async(id)=>{

    const token = sessionStorage.getItem("token")
    if(token){
        const reqHeader={
                "Content-Type":"multipart/form-data",
               "Authorization":`Bearer ${token}`
        }

        try{
            // apicall
            const result = await deleteProductBannerApi(id,reqHeader)
            if(result.status == 200){
                toast.success("deleted successfully")
                getProductBanner()
            }else{
                toast.error("cant delete data")
            }
        }catch(err){
            toast.error("something went wrong")
        }
    }
    
}





//=========Service  BANNERRRR==========//

const [serviceBannerState,setServiceBannerState]=useState({
  serviceBanner:""
})

const [servicePreview,setServicePreview]=useState("")


// get service banner
const[getservicebanner,setgetservicebanner]=useState([])

// console.log(servicePreview);


useEffect(()=>{

  if (
    serviceBannerState.serviceBanner &&
  (serviceBannerState.serviceBanner.type === "image/png" ||
    serviceBannerState.serviceBanner.type === "image/jpg" ||
    serviceBannerState.serviceBanner.type === "image/jpeg"||
    serviceBannerState.serviceBanner.type === "image/webp"
 )) {
  setServicePreview(URL.createObjectURL(serviceBannerState.serviceBanner));
}else{
  setServicePreview("");
}
getServiceBanner()

},[serviceBannerState.serviceBanner])



// addServiceBanner

const addServiceBanner = async()=>{

  const {serviceBanner}=serviceBannerState

  if (getServiceBanner?.length >= 3) {
    toast.error("Maximum 3 banners allowed!");
    return;
  }

  if (!serviceBanner) {
    toast.warning("Please select a banner image");
    return;
  }

  const reqBody = new FormData()
  reqBody.append("serviceBanner",serviceBanner)

  const token = sessionStorage.getItem("token")
  if(token){
    const reqHeader={
         "Content-Type":"multipart/form-data",
               "Authorization":`Bearer ${token}`
    }

    const result = await  addServiceBannerApi(reqBody,reqHeader)
    console.log(result);
    if(result.status == 200){
      getServiceBanner()
       toast.success("Banner added successfully");
   }else{
       toast.error("something went wrong");
       setServiceBannerState({serviceBanner:""})
       setServicePreview("")
   }
  }
}



// getServiceBanner

const getServiceBanner = async()=>{
  
  // api call
  const result = await getServiceBannerApi()
  if(result.status == 200){
    setgetservicebanner(result.data)
  }else{
    setgetservicebanner(result.response.data)
  }
}


// delete service banner

const dleleteServiceBanner = async(id)=>{

  const token = sessionStorage.getItem("token")
  if(token){
      const reqHeader={
              "Content-Type":"multipart/form-data",
             "Authorization":`Bearer ${token}`
      }

      try{
          // apicall
          const result = await deleteServiceBannerApi(id,reqHeader)
          if(result.status == 200){
              toast.success("deleted successfully")
              getServiceBanner()
          }else{
              toast.error("cant delete data")
          }
      }catch(err){
          toast.error("something went wrong")
      }

}

}











    return (
        <>
           <Link
              to="/uiedits"
              className="text-info back-btn"
            >
              ← Back
          </Link>


            <Container className="text-center my-5">
                <Row className="g-3 justify-content-center">
                    
        <Col xs="auto ">
                        <Button variant="info" className='px-4 fw-bold shadow-sm' onClick={handleShowHome}>
                            Home Banner
                        </Button>

                                <Modal
        show={homeshow}
        onHide={handleCloseHome}
        backdrop="static"
        keyboard={false}
        size="xl"   // ⬅️ bigger modal
        >
             <Modal.Header closeButton>
                <Modal.Title className='text-info'>Home Banner</Modal.Title>
             </Modal.Header>
 <Modal.Body>
  <Form>

    {preview && (
      <div className="text-center mb-3">
        <img
          src={preview}
          alt="preview"
          style={{
            width: "300px",
            height: "150px",
            objectFit: "cover",
            borderRadius: "8px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        />
        <p className="text-danger mt-2">Preview before saving</p>
      </div>
    )}

   
{getHomeBanner?.length < 3 ? (
  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
    <Form.Control
      type="file"
      onChange={e =>
        setAddHomeBanner({ ...AddHomeBanner, bannerImage: e.target.files[0] })
      }
    />
  </Form.Group>
) : (
  <p className="text-danger fw-bold">You can only add up to 3 banners.</p>
)}


    
    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
      <Form.Label>Uploaded Banners:</Form.Label>
      <Row className="g-3 justify-content-center">
        {getHomeBanner?.length > 0 ? (
          getHomeBanner.map((banr, index) => (
            <Col key={index} xs={12} md={6} lg={4} className="d-flex justify-content-center">
              <div
                className="p-2 shadow rounded d-flex flex-column align-items-center"
                style={{ maxWidth: "200px" }}
              >
                <img
                  src={`${serverUrl}/uploads/${banr?.bannerImage}`}
                  alt={`banner-${index}`}
                  style={{
                    width: "300px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <Button
                  variant="danger"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleDeleteBanner(banr._id)}
                >
                  Delete
                </Button>
              </div>
            </Col>
          ))
        ) : (
          <p className="text-danger fw-bolder">No banner added</p>
        )}
      </Row>
    </Form.Group>
  </Form>
</Modal.Body>

<Modal.Footer>
    <Button variant="secondary" onClick={handleCloseHome}>
        Close
    </Button>
    <Button variant="primary" 
    className='btn-info'
     onClick={()=>handleAddBanner()}
     disabled={getHomeBanner?.length >= 3} // ✅ FIXED
     >

      Save Changes

      </Button>
</Modal.Footer>
</Modal>
       </Col>








{/* product banner section */}


<Col xs="auto">
  <Button
    variant="info"
    className="px-4 fw-bold shadow-sm"
    onClick={handleShowProduct}
  >
    Product Banner
  </Button>

  <Modal
    show={productshow}
    onHide={handleCloseProduct}
    backdrop="static"
    keyboard={false}
    size="xl"
  >
    <Modal.Header closeButton>
      <Modal.Title className="text-info">Product Banner</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <Form>
        
        {productPreview && (
          <div className="text-center mb-3">
            <img
              src={productPreview}
              alt="productPreview"
              style={{
                width: "300px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "8px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              }}
            />
            <p className="text-danger mt-2">Preview before saving</p>
          </div>
        )}

{getprdctBanner?.length < 3 ? (
  <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
    <Form.Control
      type="file"
      onChange={(e) =>
        setAddProductBanner({
          ...addProductBanner,
          productBanner: e.target.files[0],
        })
      }
    />
  </Form.Group>
) : (
  <p className="text-danger fw-bold">
    You can only add up to 3 banners.
  </p>
)}

<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
  <Form.Label>Uploaded Banners:</Form.Label>
  <Row className="g-3 justify-content-center">
    {getprdctBanner?.length > 0 ? (
      getprdctBanner.map((banner, index) => (
        <Col
          key={index}
          xs={12}
          md={6}
          lg={4}
          className="d-flex justify-content-center"
        >
          <div
            className="p-2 shadow rounded d-flex flex-column align-items-center"
            style={{ maxWidth: "300px" }}
          >
            <img
              src={`${serverUrl}/uploads/${banner?.productBanner}`}
              alt={`banner-${index}`}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <Button
              variant="danger"
              size="sm"
              className="mt-2"
              onClick={() => deleteProductBanner(banner._id)}
            >
              Delete
            </Button>
          </div>
        </Col>
      ))
    ) : (
      <p className="text-danger fw-bolder">No banner added</p>
    )}
  </Row>
</Form.Group>

      </Form>
    </Modal.Body>

    <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseProduct}>
        Close
      </Button>
      <Button
        variant="primary"
        className="btn-info"
        onClick={addPDTBanner}
        disabled={getprdctBanner?.length >= 3} // ✅ FIXED
      >
        Save Changes
      </Button>
    </Modal.Footer>
  </Modal>
</Col>




{/* service banner section */}

<Col xs="auto">
  <Button
    variant="info"
    className="px-4 fw-bold shadow-sm"
    onClick={handleShowService}
  >
    Service Banner
  </Button>

  <Modal
    show={serviceshow}
    onHide={handleCloseService}
    backdrop="static"
    keyboard={false}
    size="xl"
  >
    <Modal.Header closeButton>
      <Modal.Title className="text-info">Service Banner</Modal.Title>
    </Modal.Header>

    <Modal.Body>
      <Form>
      
      {
  servicePreview &&
  <div className="text-center mb-3">
    <img
      src={servicePreview}   
      alt="servicePreview"
      style={{
        width: "300px",
        height: "150px",
        objectFit: "cover",
        borderRadius: "8px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      }}
    />
    <p className="text-danger mt-2">Preview before saving</p>
  </div>
}

      

        {/* File Upload (Only show if less than 3 banners) */}
       
         { getservicebanner?.length <3?(
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Control
             type="file" 
             autoFocus
             onChange={e=> setServiceBannerState({...serviceBannerState,serviceBanner:e.target.files[0]})}
              />
             
          </Form.Group>
         ):<p className="text-danger fw-bold">
         You can only add up to 3 banners.
       </p>}
      

        {/* Uploaded Banners */}

        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Uploaded Banners:</Form.Label>
       
          <Row className="g-3 justify-content-center">
          { 
        getservicebanner?.length>0? getservicebanner.map((data,index)=>(
          <Col
          key={index}
            xs={12}
            md={6}
            lg={4}
            className="d-flex justify-content-center"
          >
            <div
              className="p-2 shadow rounded d-flex flex-column align-items-center"
              style={{ maxWidth: "200px" }}
            >
              <img
               src={`${serverUrl}/uploads/${data.serviceBanner}`}
               // <- keep as is (static or dynamic later)
                alt=""
                style={{
                  width: "300px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <Button
                variant="danger"
                size="sm"
                className="mt-2"
                onClick={() => dleleteServiceBanner(data?._id)}
              >
                Delete
              </Button>
            </div>
          </Col>
       )): <p className="text-danger fw-bolder">No banner added</p>
      }
   
    </Row>
        
        </Form.Group>
      </Form>
    </Modal.Body>

    <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseService}>
        Close
      </Button>
      <Button
        variant="primary"
        className="btn-info"
        onClick={addServiceBanner}
        disabled={getservicebanner?.length >= 3} // ✅ FIXED
      >
        Save Changes
      </Button>

    </Modal.Footer>
  </Modal>
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

export default Banner;