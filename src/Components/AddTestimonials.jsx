import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { addTestimonialsApi } from "../Services/allApi";

function AddTestimonial() {


  // to clear the image field 

  const fileInputRef = useRef(null);


  // star function

  const handleStarClick = (starValue) => {
    setAddTestimonials({ ...addTestimonials, rating: starValue });
  }

  
  //initialstate to add testimonials
  const [addTestimonials, setAddTestimonials] = useState({
    testimonyUserName: "",
    vehicleName: "",
    testimonyMessage: "",
    rating: "",
    testimonyImage: "",
  });

  // state to set image url
  const [preview, setPreview] = useState("");

  useEffect(() => {
    if (
      addTestimonials.testimonyImage &&
      (addTestimonials.testimonyImage.type === "image/png" ||
        addTestimonials.testimonyImage.type === "image/jpg" ||
        addTestimonials.testimonyImage.type === "image/jpeg"||
        addTestimonials.testimonyImage.type === "image/webp"
     )) {
      setPreview(URL.createObjectURL(addTestimonials.testimonyImage));
    }else{
      setAddTestimonials({...addTestimonials,testimonyImage:""});
    }
  }, [addTestimonials.testimonyImage]);

  // console.log(preview);
  // console.log(addTestimonials);




  // add testimonials

  const handleAddTestimony = async(e)=>{
    e.preventDefault()

    const {testimonyUserName,vehicleName,testimonyMessage,rating,testimonyImage}= addTestimonials

    if(!testimonyUserName || !vehicleName || !testimonyMessage || !rating || !testimonyImage ){
      toast.warning("please fill the missing fields")

    }else{

      const reqBody = new FormData()

      reqBody.append("testimonyUserName",testimonyUserName)
      reqBody.append("vehicleName",vehicleName)
      reqBody.append("testimonyMessage",testimonyMessage)
      reqBody.append("rating",rating)
      reqBody.append("testimonyImage", testimonyImage); // image file

      const reqHeader = {"Content-Type":"multipart/form-data"}

      try{
        //api call

        const result = await addTestimonialsApi(reqBody,reqHeader)
        console.log(result);

        if(result.status == 200){
          setAddTestimonials({
            testimonyUserName: "",
            vehicleName: "",
            testimonyMessage: "",
            rating: "",
            testimonyImage: "",
          })
          setPreview("")
          if (fileInputRef.current) {
            fileInputRef.current.value = ""; // <-- clears actual file input field
          }
          toast.success("Thanks for the  review");
        }else{
          toast.error("something went wrong!!");
        }
      }catch(err){
        console.log(err);
        
      }
    }

  }








  





  return (

<>
<Container className="my-5 mb-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="p-4 shadow-sm">
            <h2 className="text-center mb-4 text-info">Add Testimonial</h2>
            <Form>
              <Form.Group className="mb-3">

                {/* name */}

                <Form.Label className="text-info">Name:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter full name"
                  required
                  onChange={e => setAddTestimonials({...addTestimonials,testimonyUserName:e.target.value})}
                  value={addTestimonials.testimonyUserName}
                />
              </Form.Group>

              {/* vehicle name */}

              <Form.Group className="mb-3">
                <Form.Label className="text-info">Vehicle Name:</Form.Label>
                <Form.Control type="text" placeholder="Enter Vehicle name " 
                 onChange={e => setAddTestimonials({...addTestimonials,vehicleName:e.target.value})}
                 value={addTestimonials.vehicleName}
                />
              </Form.Group>

              {/* testimonial text */}

              <Form.Group className="mb-3">
                <Form.Label className="text-info">Testimonial Text:</Form.Label>
                <Form.Control
                  as="textarea"
                  placeholder="Write testimonial here..."
                  onChange={e => setAddTestimonials({...addTestimonials,testimonyMessage:e.target.value})}
                  value={addTestimonials.testimonyMessage}
                />
              </Form.Group>


              {/* star */}

              <Form.Group className="mb-3">
                <Form.Label className="text-info">Rating:</Form.Label>
                <div>
                  {[1, 2, 3, 4,5].map((star) => (
                    <i
                      key={star}
                      className={`fa-star fa-lg me-2 ${
                        star <= addTestimonials.rating ? 'fas text-warning' : 'far text-muted'
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleStarClick(star)}
                    ></i>
                  ))}
                </div>
              </Form.Group>


              <Form.Group className="mb-4">

                {/* profile image */}

                <Form.Label className="text-info">Profile-Image:</Form.Label>
                <Form.Control  type="file" 
                 ref={fileInputRef}
                onChange={e=> setAddTestimonials({...addTestimonials,testimonyImage:e.target.files[0]})}
                 
                  />
                
              </Form.Group>

              <div className="d-grid ">
                <Button onClick={handleAddTestimony} className="btn btn-info mb-3" size="lg" type="submit">
                  Add Testimonial
                </Button>
              </div>
            </Form>
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

export default AddTestimonial;
