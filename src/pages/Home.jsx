import React, { useEffect, useRef, useState } from "react";
import { Carousel } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  addToCartApi,
  addToWishlistApi,
  getBannerToHomeApi,
  getCartApi,
  getHomeProductsApi,
  getTestimonialsApi,
  getWishlistApi,
  removeFromHomeApi,
} from "../Services/allApi";
import { serverUrl } from "../Services/serverUrl";
import { ToastContainer, toast } from "react-toastify";
import "../App.css";
import 'react-toastify/dist/ReactToastify.css';
// import InstagramFeed from "../Components/Instagram";


function Home() {
  const [getBanner, setGetBanner] = useState([]);
  const [getTestimony, setGetTestimony] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [animateWishlist, setAnimateWishlist] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [animateCart, setAnimateCart] = useState(null);
  const cardRefs = useRef([]);
  const navigate = useNavigate();
  const role = sessionStorage.getItem("userRole");

  const testimonyRefs = useRef({}); // refs per testimonial
  const [expandedCards, setExpandedCards] = useState({}); // tracks expanded cards
  const [showReadMore, setShowReadMore] = useState({}); // tracks if read more is needed
  

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    getHomeBanner();
    gethomeProducts();
    getHomeTestimonials();
  }, []); // load once
  
  useEffect(() => {
    if (token) {
      fetchCartItems();
      fetchWishlist();
    }
  }, [token]); // only cart/wishlist reload on login/logout
  



  
  // Banner
  const getHomeBanner = async () => {
    const result = await getBannerToHomeApi();
    if (result.status === 200) setGetBanner(result.data);
    else setGetBanner(result.response.data);
  };

  // Products
  const gethomeProducts = async () => {
    const result = await getHomeProductsApi();
    if (result.status === 200) setAllProducts(result.data);
    else setAllProducts(result.response.data);
  };

  // Remove product from home (admin)
  const handleRemoveFromHome = async (pid) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const reqHeader = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const result = await removeFromHomeApi(pid, reqHeader);
      if (result.status === 200) {
        toast.success("Removed from Home!");
        gethomeProducts();
      } else {
        toast.error("Failed to remove from home");
      }
    }
  };

  // Testimonials
  const getHomeTestimonials = async () => {
    const result = await getTestimonialsApi();
    if (result.status === 200) setGetTestimony(result.data);
    else setGetTestimony(result.response.data);
  };

  // Wishlist
  const fetchWishlist = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    try {
      const reqHeader = { Authorization: `Bearer ${token}` };
      const result = await getWishlistApi(reqHeader);
      if (result.status === 200) {
        const wishlistArray = result.data.wishlist || [];
        setWishlistItems(wishlistArray.map((item) => item._id));
      } else setWishlistItems([]);
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    }
  };

  const handleAddToWishlist = async (productId) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.warning("Please login first!");
        return;
      }
      if (wishlistItems.includes(productId)) {
        toast.warn("Already in wishlist!");
        return;
      }
      const reqHeader = { Authorization: `Bearer ${token}` };
      const response = await addToWishlistApi(productId, reqHeader);
      if (response.status === 200) {
        toast.success("Product added to wishlist!");
        fetchWishlist();
      } else toast.error("Failed to add to wishlist");
    } catch (err) {
      console.error(err);
      toast.error("Error adding to wishlist");
    }
  };

  // Cart
  const fetchCartItems = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) return;
  
      const reqHeader = { Authorization: `Bearer ${token}` };
      const result = await getCartApi(reqHeader);
  
      if (result.status === 200) {
        const validCartItems = result.data.cart
          .filter((item) => item.productId) // keep only items with a productId
          .map((item) => item.productId._id);
  
        setCartItems(validCartItems);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };
  



  // add to cart

  const handleAddToCart = async (productId) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.warning("Please login first!");
        return;
      }
      if (cartItems.includes(productId)) {
        toast.warn("Already in cart!");
        return;
      }
      const reqHeader = { Authorization: `Bearer ${token}` };
      const response = await addToCartApi(productId, reqHeader);
      if (response.status === 200) {
        toast.success("Product added to cart!");
        setCartItems((prev) => [...prev, productId]);
        setAnimateCart(productId);
        setTimeout(() => setAnimateCart(null), 500);
      } else toast.error("Failed to add to cart");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };


  
  // Animate cards on scroll
  useEffect(() => {
    const cards = document.querySelectorAll(".accessory-card");
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target); // stop observing after visible
          }
        });
      },
      { threshold: 0.3 }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [allProducts]); // <-- important: re-run after products load




  useEffect(() => {
    // after testimonials are loaded, check if overflow exists
    getTestimony.forEach((testy) => {
      const el = testimonyRefs.current[testy._id];
      if (el) {
        setShowReadMore((prev) => ({
          ...prev,
          [testy._id]: el.scrollHeight > el.clientHeight,
        }));
      }
    });
  }, [getTestimony]);



  const toggleReadMore = (id) => {
    setExpandedCards((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }
  
  return (
    <>
      {/* Carousel */}
      <Carousel>
        {getBanner?.length > 0 ? (
          getBanner.map((banner, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100 carousel-img"
                src={`${serverUrl}/uploads/${banner?.bannerImage}`}
                alt={`banner-${index}`}
                style={{ height: "500px", objectFit: "cover" }}
              />
              <Carousel.Caption>
                <h3 className="text-light">Premium Bike Workshop</h3>
                <p>Bringing top-notch service and care for your bikes.</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))
        ) : (
          <Carousel.Item>
            <img
              className="d-block w-100 carousel-img"
              src="https://static.vecteezy.com/system/resources/previews/055/420/404/non_2x/mechanics-repair-engine-adjustment-mechanic-working-on-a-motorcycle-engine-in-a-workshop-photo.jpeg"
              alt="default-banner"
              style={{ height: "500px", objectFit: "cover" }}
            />
            <Carousel.Caption>
              <h3 className="text-light">Premium Bike Workshop</h3>
              <p>
                State-of-the-art facility with certified technicians to care for
                your bike.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        )}
      </Carousel>

      {/* Experience Section */}
      <h1
        className="text-info fw-bolder text-center my-5"
        style={{ textDecoration: "underline" }}
      >
        WHY CUSTOM RODZ ?
      </h1>
      <section className="py-5 bg-light mt-3">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 mb-4 custom-border">
              <img
                src="https://cdn-icons-png.flaticon.com/512/3011/3011270.png"
                width="50"
                alt="Experienced Mechanics"
              />
              <h5 className="mt-3 fw-bold text-info">15+ Years in Service</h5>
              <p className="text-muted">
                Expert mechanics with hands-on experience in bike repair &
                service.
              </p>
            </div>

            <div className="col-md-3 mb-4 custom-border">
              <img
                src="https://cdn-icons-png.flaticon.com/512/6815/6815042.png"
                width="50"
                alt="Trusted by Bikers"
              />
              <h5 className="mt-3 fw-bold text-info">Trusted by Bikers</h5>
              <p className="text-muted">
                Thousands of happy bikers choose us for reliable and quick
                service.
              </p>
            </div>

            <div className="col-md-3 mb-4 custom-border">
              <img
                src="https://cdn-icons-png.flaticon.com/512/2972/2972502.png"
                width="50"
                alt="Quality Service"
              />
              <h5 className="mt-3 fw-bold text-info">Top-notch Service</h5>
              <p className="text-muted">
                We use quality parts and deliver every service with precision
                and care.
              </p>
            </div>

            <div className="col-md-3 mb-4">
              <img
                src="https://cdn-icons-png.flaticon.com/512/5971/5971912.png"
                width="50"
                alt="Support"
              />
              <h5 className="mt-3 fw-bold text-info">Emergency Support</h5>
              <p className="text-muted">
                Ready 24/7 for roadside assistance and emergency repairs.
              </p>
            </div>
          </div>
        </div>

        <style>{`
    .custom-border {
      border-right: 2px solid #bbbb; /* thicker border */
      padding-right: 15px; /* optional: make space between content and border */
    }
  `}</style>
      </section>

      {/* Testimonials */}
      <section className="py-5 bg- mb-5">
  <div className="container">
    <h2 className="text-center text-info fw-bold mb-5">
      What Our Bikers Say
    </h2>

    <div className="testimonial-marquee">
      <div className="testimonial-track">
        {getTestimony?.length > 0 ? (
          getTestimony.concat(getTestimony).map((testy, index) => (
            <div className="testimonial-item" key={index}>
              <div
                className="card testimonial-card p-4 border-0 rounded-4 position-relative overflow-hidden"
                style={{
                  background: "linear-gradient(145deg, #ffffff, #f1f5f9)",
                }}
              >
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={`${serverUrl}/uploads/${testy?.testimonyImage}`}
                    className="rounded-3"
                    width="70"
                    height="70"
                    alt="user"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="ms-3">
                    <h6 className="mb-1 fw-bold text-info text-capitalize">
                      {testy?.testimonyUserName}
                    </h6>
                    <span className="badge bg-info text-white text-capitalize">
                      {testy?.vehicleName}
                    </span>
                  </div>
                </div>

                {/* Stars */}
                <div className="mb-3">
                  {[...Array(Number(testy.rating)).keys()].map((i) => (
                    <i key={i} className="fa fa-star text-warning me-1"></i>
                  ))}
                </div>

                {/* Testimony message with clamp */}
                <p
                  className={`mb-0 fw-semibold text-info testimony-message ${
                    expandedCards[testy._id] ? "expanded" : "clamped"
                  }`}
                  style={{
                    fontSize: "1.1rem",
                    lineHeight: "1.6",
                    textTransform: "capitalize",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: expandedCards[testy._id] ? "none" : 3,
                    WebkitBoxOrient: "vertical",
                    transition: "all 0.3s ease",
                  }}
                >
                  "{testy?.testimonyMessage}"
                </p>

                {/* Read More toggle */}
                {testy?.testimonyMessage.length > 100 && (
                  <button
                    className="btn btn-link p-0 mt-2 text-info fw-bold"
                    style={{ fontSize: "0.9rem" }}
                    onClick={() => toggleReadMore(testy._id)}
                  >
                    {expandedCards[testy._id] ? "Read Less" : "Read More..."}
                  </button>
                )}

                <i
                  className="fa fa-quote-left text-info position-absolute"
                  style={{
                    top: "10px",
                    right: "15px",
                    fontSize: "30px",
                    opacity: "0.2",
                  }}
                ></i>
              </div>
            </div>
          ))
        ) : (
          <p className="text-danger fw-bolder text-center">
            Nothing to display
          </p>
        )}
      </div>
    </div>
  </div>
</section>


      {/* Accessories Section */}
      <section className="product-section py-5 bg-secondary mt-4 ">
        <div className="container text-center mt-4">
          <h2 className="mb-3 text-info fw-bolder">
            Special Bike Accessories With Offers
          </h2>
          <p className="text-dark mb-4">
            Top quality accessories at unbeatable prices. Upgrade your ride
            today!
          </p>
          <div className="row justify-content-center">
            {allProducts?.length > 0 ? (
              allProducts.map((item, index) => (
                <div className="col-md-3 mb-4" key={index}>
                 <div
                ref={(el) => (cardRefs.current[index] = el)}
                className="card position-relative home-card accessory-card"
                
              >

                    <img
                      src={`${serverUrl}/uploads/${item?.productImage}`}
                      className="card-img-top"
                      style={{ height: "150px", objectFit: "contain" }}
                      alt={item?.productName}
                    />
                    <div className="card-body p-2">
                      <p className="category-badge bg-info  text-light" style={{ textTransform:'capitalize' }}>{item?.productCategory}</p>
                      <h6 className="card-title mb-1 text-danger fw-bolder" style={{ textTransform:'capitalize' }}>
                        {item?.productName}
                      </h6>
                      <p className="card-text text-success fw-bold mb-1">
                        <del className="text-muted me-2">
                          ₹{item?.productPrice}
                        </del>
                        ₹{item?.offerPrice}
                      </p>
                      <div className="d-flex flex-wrap justify-content-center gap-2 mt-2">
                      <button
                        className="btn btn-info btn-sm"
                        onClick={async () => {
                          const token = sessionStorage.getItem("token")
                          if (token) {
                            // user is logged in
                            if (!cartItems.includes(item._id)) {
                              await handleAddToCart(item._id);
                            }
                            navigate("/cart");
                            
                          } else {
                            toast.warning("login required")
                            // not logged in → go to login
                            navigate("/login");
                          }
                        }}
                      >
                        Buy Now
                      </button>

                        <button
                          className="btn btn-light btn-sm"
                          onClick={() => handleAddToCart(item._id)}
                        >
                          <i
                            className={`fa-solid fa-cart-shopping ${
                              cartItems.includes(item._id) ? "text-warning" : ""
                            } ${animateCart === item._id ? "bounce" : ""}`}
                          ></i>
                        </button>
                        <button
                          className="btn btn-outline-dark btn-light btn-sm"
                          onClick={() => {
                            handleAddToWishlist(item._id);
                            setAnimateWishlist(item._id);
                            setTimeout(() => setAnimateWishlist(null), 500);
                          }}
                        >
                          <i
                            className={`fa-solid fa-heart ${
                              wishlistItems.includes(item._id)
                                ? "text-danger"
                                : "text-info"
                            } ${animateWishlist === item._id ? "bounce" : ""}`}
                          ></i>
                        </button>
                        {role === "admin" && (
                          <>
                            <button
                              className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle"
                              style={{
                                width: "30px",
                                height: "30px",
                                padding: "0",
                              }}
                              onClick={() => handleRemoveFromHome(item._id)}
                            >
                              <i className="fa-solid fa-xmark"></i>
                            </button>
                            <Link
                              to="/displayhomeproducts"
                              state={{ scrollTo: "products-section" }}
                            >
                              <button className="btn btn-info btn-sm rounded-circle">
                                <i className="fa-solid fa-plus"></i>
                              </button>
                            </Link>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="d-flex gap-3">
                <p className="text-danger fw-bolder">
                  No products added to Home yet..!!{" "}
                  <span className="ms-3 text-success">Add Products --</span>
                </p>
                <Link
                  to="/displayhomeproducts"
                  state={{ scrollTo: "products-section" }}
                >
                  <button className="btn btn-info btn-sm rounded-circle">
                    <i className="fa-solid fa-plus"></i>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* image section */}
      <section className="image-section py-5 bg-light">
        <div className="container">
          <h2 className="text-center text-info fw-bolder mb-5">
            Custome Rodz Insights
          </h2>

          {/* First row: 2 images (70% / 30%) */}
          <div className="row g-2 mb-1 justify-content-center">
            {" "}
            {/* Reduced gap from g-3 to g-2 */}
            {[
              {
                src: "https://plus.unsplash.com/premium_photo-1661960487542-352d8c5a69f7?fm=jpg&q=60&w=3000",
                text: "At Custom Rodz Bike Workshop, we specialize in complete bike maintenance, engine tuning, brake inspections, and custom modifications. Our expert mechanics ensure every bike gets top-notch care for performance and safety. Trust us to keep your ride smooth and reliable.",
                size: "col-12 col-lg-8",
              },
              {
                src: "https://media.istockphoto.com/id/1019948816/photo/mechanic-repairing-customized-motorcycle.jpg?s=612x612&w=0&k=20&c=JbOvmcjIei-BpFkycaafdskX3n5TCuZLCUpwkZt8SKY=",
                text: "Our workshop offers quick diagnostics, emergency repairs, and regular servicing to keep your bike in peak condition. Safety and performance are our top priorities.",
                size: "col-12 col-lg-4",
              },
            ].map((item, index) => (
              <div
                className={`${item.size} position-relative overflow-hidden gallery-card`}
                key={index}
              >
                <img
                  src={item.src}
                  alt={`Gallery ${index + 1}`}
                  className="img-fluid w-100 rounded" // Added rounded corners
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="overlay text-white d-flex align-items-center p-3">
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Second row: 3 equal images */}
          <div className="row g-2 justify-content-center">
            {" "}
            {/* Reduced gap */}
            {[
              {
                src: "https://st3.depositphotos.com/13194036/18625/i/1600/depositphotos_186254938-stock-photo-close-shot-bike-repair-station.jpg",
                text: "Our bike specialists provide expert maintenance, oil changes, chain adjustments, tire replacements, and performance tuning. Every bike gets personalized care to ensure a safe and enjoyable ride.",
              },
              {
                src: "https://static.vecteezy.com/system/resources/thumbnails/011/844/022/small_2x/mechanic-using-a-hex-key-or-allen-wrench-to-remove-motorcycle-rear-hydraulic-brake-pump-working-in-garage-maintenance-and-repair-motorcycle-concept-selective-focus-photo.jpg",
                text: "Regular tune-ups and inspections are key to extending the life of your bike. We check brakes, suspension, and engine performance with precision and care.",
              },
              {
                src: "https://t4.ftcdn.net/jpg/04/43/36/15/360_F_443361534_s2VuWPveNCIecA94KpvjLeeOOnhB09hn.jpg",
                text: "Custom Rodz offers premium bike detailing and modifications to enhance both aesthetics and performance. We make every ride unique and smooth.",
              },
            ].map((item, index) => (
              <div
                className="col-md-4 position-relative overflow-hidden gallery-card"
                key={index}
              >
                <img
                  src={item.src}
                  alt={`Gallery ${index + 3}`}
                  className="img-fluid w-100 rounded" // Rounded corners
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="overlay text-white d-flex align-items-center p-3">
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
  .gallery-card {
    transition: transform 0.3s ease;
    cursor: pointer;
  }
  .gallery-card img {
    transition: transform 0.5s ease;
  }
  .gallery-card:hover img {
    transform: scale(1.05);
  }
  .overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
    transform: translateY(100%);
    transition: transform 0.5s ease;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    overflow: hidden;
    border-radius: 15px; /* Ensure overlay matches rounded image corners */
  }
  .gallery-card:hover .overlay {
    transform: translateY(0);
  }
  .overlay p {
    margin: 0;
    font-size: 1rem;
    line-height: 1.5;
  }

  /* Mobile / Touch devices: show overlay on tap */
  @media (hover: none) and (pointer: coarse) {
    .gallery-card:active .overlay {
      transform: translateY(0);
    }
  }
`}</style>

      </section>

      {/* Service Quote */}
      <div className="container mb-5">
        <div className="row mt-5">
          <div className="col-12 text-center">
            <div className="bg-info p-4 rounded">
              <h3 className="text-light">
                <i className="bi bi-bicycle me-2"></i> Fast & Reliable Bike
                Repairs
              </h3>
              <p className="text-light">
                Contact our bike service experts and get your ride tuned up or
                repaired the same day.
              </p>
              <button
                className="btn btn-light text-info"
                onClick={() =>
                  navigate("/services", {
                    state: { section: "service123_quote" },
                  })
                }
              >
                Get a Service Quote
              </button>
            </div>
          </div>
        </div>
      </div>




{/* instagram */}

{/* <InstagramFeed/> */}

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

export default Home;
