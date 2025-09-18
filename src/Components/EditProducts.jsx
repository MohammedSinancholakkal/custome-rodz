
import React, {useContext, useEffect, useState } from 'react'
import { Button, Form, Modal } from 'react-bootstrap';
import { serverUrl } from '../Services/serverUrl';
import { updateProductApi } from '../Services/allApi';
import { toast, ToastContainer } from 'react-toastify';
import { editProductResponseContext } from '../ContextApi/ContextShare';





function EditProducts({product}) {

  // context share

  const{editProductResponse,setEditProductResponse}=useContext(editProductResponseContext)
   

  // editProductmodal

  const [editProductModalShow, setEditProductModalShow] = useState(false);

  const handleCloseEditProduct = () =>{

    //to set the field back to the state before updating
    setEditProducts({
        id: product?._id,
        productName: product?.productName,
        productPrice: product?.productPrice,
        offerPrice: product?.offerPrice,
        productCategory: product?.productCategory,
        productImage: "",
      });
      setEditPreview("");

     setEditProductModalShow(false);}
  const handleShowEditProduct = () => setEditProductModalShow(true);

  const[editProducts,setEditProducts]=useState({

     id:product?._id, productName:product?.productName,productPrice:product?.productPrice,offerPrice:product?.offerPrice,productCategory:product?.productCategory,productImage:""

  })
  const [editPreview,setEditPreview]=useState("")



  //edit product
  
      const handleUpdate = async () => {
        const { id, productName, productPrice, offerPrice, productCategory, productImage } = editProducts;
      
        if (!productName || !productPrice || !offerPrice || !productCategory) {
          toast.warning("Please fill the missing fields");
          return;
        }
      
        const reqBody = new FormData();
        reqBody.append("productName", productName);
        reqBody.append("productPrice", productPrice);
        reqBody.append("offerPrice", offerPrice);
        reqBody.append("productCategory", productCategory);
      
        // Use new file if uploaded, else keep existing filename
        editPreview
          ? reqBody.append("productImage", productImage)
          : reqBody.append("productImage", product?.productImage);
      
        const token = sessionStorage.getItem("token");
      
        if (!token) {
          toast.warning("Admin login required!!");
          return;
        }
      
        const reqHeader = {
          Authorization: `Bearer ${token}`,
        };
      
        try {
          const result = await updateProductApi(id, reqBody, reqHeader);
      
          if (result.status === 200) {
            toast.success("Product updated successfully!");
            handleCloseEditProduct();   
            setEditProductResponse(result.data)   
            // Trigger parent update if callback is provided
            // if (typeof onUpdate === "function") {
            //   onUpdate({ ...product, productName, productPrice, offerPrice, productCategory, productImage: editPreview ? productImage.name : product.productImage });
            // }
            
          } else {
            toast.warning(result.response?.data || "Update failed");
          }
        } catch (err) {
          console.log(err);
          toast.error("Something went wrong!");
        }
      };

      useEffect(() => {
        setEditProducts({
          id: product?._id,
          productName: product?.productName,
          productPrice: product?.productPrice,
          offerPrice: product?.offerPrice,
          productCategory: product?.productCategory,
          productImage: "",
        });
        setEditPreview(""); // reset preview

      }, [product]);
      
      


  return (
    <>


    {/* edit button */}

     <button className="btn btn-info btn-sm me-1"style={{ fontSize: "0.75rem" }} onClick={handleShowEditProduct} >EDIT</button>

    {/* edit modal */}


    <Modal
    show={editProductModalShow}
    onHide={handleCloseEditProduct}
    backdrop="static"
    keyboard={false}
    size="lg"
    >
    <Modal.Header closeButton>
        <Modal.Title className="text-info" >Edit Product</Modal.Title>
    </Modal.Header>

    <Modal.Body>
        <div className="row align-items-stretch g-3">
        <div className="col-10 col-md-4">
            <div
            className="card position-relative h-100 shadow-lg"
            style={{ minHeight: "100%" }}
            >
            <img
                src={editPreview || `${serverUrl}/uploads/${product.productImage}`}
                className="card-img-top img-fluid"
                style={{
                height: "250px",
                objectFit: "contain",
                padding: "10px",
                }}
                alt="Helmet"
            />

            <div className="card-body text-center">
                <p className="text-dark small mb-1">{editProducts?.productCategory || "Category"}</p>
                <h6 className="card-title mb-2 text-dark fw-bolder">{editProducts?.productName || "product name" }</h6>
            <div className='d-flex justify-content-center'>
            <p className="card-text text-success fw-bold mb-0">
                <del className="text-muted me-2 mb-3">${editProducts?.productPrice || "product price"}</del>
                </p>
                <p className="text-success fw-bold">${editProducts?.offerPrice || "offer Price"}</p>
            </div>
            </div>
            </div>
        </div>

    <div className="col-12 col-md-8">
            <Form>
            <Form.Group className="mb-3">
                <Form.Label>Product Name:</Form.Label>
                <Form.Control
                type="text"
                placeholder="Enter product name"
                value={editProducts.productName}  
                onChange={(e) => setEditProducts({ ...editProducts, productName: e.target.value })} 
                />
            </Form.Group>

            <Form.Group className="d-flex gap-2">
                        <Form.Check 
                        value="Parts" 
                        name="productCategory" 
                        type="radio" 
                        label="Parts" 
                        checked={editProducts.productCategory === "Parts"}
                        onChange={(e) => setEditProducts({ ...editProducts, productCategory: e.target.value })} 
                    
                    />

                    <Form.Check 
                        value="Accessories" 
                        name="productCategory" 
                        type="radio" 
                        label="Accessories"
                        checked={editProducts.productCategory === "Accessories"}
                        onChange={(e) => setEditProducts({ ...editProducts, productCategory: e.target.value })}
                    />

                    <Form.Check 
                        value="Oil" 
                        name="productCategory" 
                        type="radio" 
                        label="Oil"  
                        checked={editProducts.productCategory === "Oil"}
                        onChange={(e) => setEditProducts({ ...editProducts, productCategory: e.target.value })}
                        />
                    </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Price:</Form.Label>
                <Form.Control
                type="number"
                placeholder="Enter price"
                value={editProducts.productPrice}
                onChange={(e) => setEditProducts({ ...editProducts, productPrice: e.target.value })}
                
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Offer Price:</Form.Label>
                <Form.Control
                type="number"
                placeholder="Enter original price"
                value={editProducts.offerPrice}
                onChange={(e) => setEditProducts({ ...editProducts, offerPrice: e.target.value })}
                
                />
            </Form.Group>


           <Form.Group className="mb-3" style={{ position: 'relative' }}>
          <Form.Label>Image:</Form.Label>
          <Form.Control 
            type="file" 
            onChange={e=>{
              const file = e.target.files[0];
              if(file){
                setEditProducts({ ...editProducts, productImage: file });
                setEditPreview(URL.createObjectURL(file))
              }
            }}  
          />
          

          
          {/* Overlay filename */}
          {/* {!editPreview && product?.productImage && (
            <div 
              style={{
                position: 'absolute',
                top: '75%',
                left: '110px',
                transform: 'translateY(-50%)',
                pointerEvents: 'none', 
                color: '#6c757d',
                fontSize: '0.875rem',
                fontWeight:'bolder',
                color:'black',
                
              }}
            >
              {product.productImage}
            </div>
  )} */}
</Form.Group>


            </Form>
    </div>
        </div>
    </Modal.Body>

    <Modal.Footer>
        <Button variant="danger" onClick={handleCloseEditProduct}>
        Close
        </Button>
        <Button 
        variant="info" className="text-white"  onClick={handleUpdate}>
        Update
        </Button>
    </Modal.Footer>
    </Modal>
      
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

export default EditProducts
