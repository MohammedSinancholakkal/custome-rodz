import React, { useEffect, useRef, useState } from 'react';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { AddProductApi } from '../../Services/allApi';
import { Link } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';



function AddProducts() {


  const[addProducts,setAddProducts]=useState({

    productName:"",productPrice:"",offerPrice:"",productCategory:"",productImage:""
  })
  // console.log(addProducts);


  // to create image url

  const[preview,setPreview]=useState("")

  // image clear from input

  const fileInputRef = useRef(null);


  useEffect(() => {
    if (addProducts.productImage && (
      addProducts.productImage.type === 'image/png' ||
      addProducts.productImage.type === 'image/jpg' ||
      addProducts.productImage.type === 'image/jpeg'||
      addProducts.productImage.type === 'image/webp'
    )) {
      setPreview(URL.createObjectURL(addProducts.productImage));
    } else {
      setAddProducts({...addProducts,productImage:""});
    }
    
  }, [addProducts.productImage]);
  
  // console.log(preview);
  




  // handleAddProducts

  const handleAddProducts = async(e)=>{
    e.preventDefault()

    const {productName, productPrice,offerPrice,productCategory,productImage}=addProducts

    if(!productName ||  !productPrice || !offerPrice || !productCategory || !productImage ){
      toast.warning("please fill the missing fields")
    }else{

      //create a body and headers for the multipart form data

      const reqBody = new FormData()

      reqBody.append('productName',productName)
      reqBody.append('productPrice',productPrice)
      reqBody.append('offerPrice',offerPrice)
      reqBody.append('productCategory',productCategory)
      reqBody.append('productImage',productImage)

      const token = sessionStorage.getItem("token")

      if(token){
        const reqHeader = {
          "Content-Type":"multipart/form-data",
          "Authorization":`Bearer ${token}`
        }

      try{
          //api call
          const result = await AddProductApi(reqBody,reqHeader)
          console.log(result);

          if(result.status == 200 || result.status == 201 ){
            setAddProducts({ productName:"",productPrice:"",offerPrice:"",productCategory:"",productImage:""})
            setPreview("");
            fileInputRef.current.value = "";
            toast.success("Product Added Successfully")
          }else{
            toast.warning(result.response.data)
          }
      }catch(err){
        console.log(err);      
      }       
      }
    }
  }


  
  return (
    <>
      {/* Back Button */}
      <a
        href="/uiedits"
        className="fw-bold text-info mt-5 ms-3 d-inline-flex align-items-center "
        style={{ textDecoration: "none" }}
      >
        <i className="fa-solid fa-arrow-left me-2 "></i> Back
      </a>

      <Container className="my-4">
        <Row className="justify-content-center">

          {/* Left side - Form */}
          <Col md={6} lg={5} className='mb-5'>
            <Card className="p-4 shadow-sm h-100">
              <h3 className="text-center text-info fw-bold mb-4">Add New Product</h3>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label className='fw-bolder text-info'>Product Name:</Form.Label>
                  <Form.Control type="text" placeholder="Enter product name" onChange={e=> setAddProducts({...addProducts,productName:e.target.value})}  value={addProducts.productName} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className='fw-bolder text-info'>Price:</Form.Label>
                  <Form.Control type="number" placeholder="Enter price" onChange={e=> setAddProducts({...addProducts,productPrice:e.target.value})}  value={addProducts.productPrice} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className='fw-bolder text-info'>Offer Price:</Form.Label>
                  <Form.Control type="number" placeholder="Enter offer price"  onChange={e=> setAddProducts({...addProducts,offerPrice:e.target.value})}  value={addProducts.offerPrice} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className='fw-bolder text-info'>Category:</Form.Label>

                <Form.Group className="d-flex gap-2">
                                  {/* parts */}
                <Form.Check 
                value="Parts" 
                name="productCategory" 
                type="radio" 
                label="Parts"  
                checked={addProducts.productCategory === "Parts"}   
                onChange={(e) => setAddProducts({ ...addProducts, productCategory: e.target.value })} 
              />

              <Form.Check 
                value="Accessories" 
                name="productCategory" 
                type="radio" 
                label="Accessories"
                checked={addProducts.productCategory === "Accessories"}
                onChange={(e) => setAddProducts({ ...addProducts, productCategory: e.target.value })} 
              />

              <Form.Check 
                value="Oil" 
                name="productCategory" 
                type="radio" 
                label="Oil"  
                checked={addProducts.productCategory === "Oil"}
                onChange={(e) => setAddProducts({ ...addProducts, productCategory: e.target.value })} 
              />

                  </Form.Group>
                  
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className='fw-bolder text-info'>Product Image:</Form.Label>
                  <Form.Control type="file" onChange={e=> setAddProducts({...addProducts,productImage:e.target.files[0]})} ref={fileInputRef}   />
                </Form.Group>

                <div className='d-flex gap-3'>
                <Button  onClick={handleAddProducts} variant="info" type="submit" className="w-100 fw-bold">Add Product  <i class="fa-solid fa-plus"></i>
                 </Button>
               <Link to={'/displayhomeproducts'}>
               <Button  variant="warning"  className="w-100 fw-bold">
                  Display
                </Button>
               </Link>
                </div>
              </Form>
            </Card>
          </Col>



          {/* Right side - Product Preview Card */}
          <Col md={4} lg={3}>
          <p className='ms-5 mb-3 text-info fs-5 fw-bolder'>Product Preview</p>
  <Card className="shadow-sm text-center mx-auto" style={{ maxWidth: "200px" }}>
    <Card.Img
      variant="top"
      src={preview || "https://content.hostgator.com/img/weebly_image_sample.png"}
      style={{ height: "130px", objectFit: "contain", padding: "8px" }}
      alt={addProducts.productName || "Product Preview"}
    />
    <Card.Body className="p-2">
      <small className="text-muted d-block mb-1 capitalize-first" 
      style={{transform:'capitalize'}}>
        
        {addProducts.productCategory || "Category"}
      </small>

      <Card.Title  className="mb-1 capitalize-first" style={{ fontSize: "0.9rem" }}>
        {addProducts.productName || "Product name"}
      </Card.Title>

    <div className='d-flex justify-content-center'>

        <p className='fw-bold mb-1 text-success' style={{ fontSize: "0.85rem" }}>
              <del className="text-muted me-1"> {addProducts.productPrice || "$Price"}</del>
              {addProducts.offerPrice || "$offer price"}
              </p>
    </div>
    

      <div className="d-flex justify-content-center gap-2 mb-3">
        <Button size="sm" variant="info">ADD TO CART</Button>
        <Button size="sm" variant="outline-dark">
          <i className="fa-solid fa-heart text-danger"></i>
        </Button>
      </div>
    </Card.Body>
  </Card>
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

export default AddProducts;
