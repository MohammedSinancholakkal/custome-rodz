import { useEffect, useState } from "react";
import { Carousel, Col, Row } from "react-bootstrap";
import {
  addToCartApi,
  addToWishlistApi,
  getAllProductsApi,
  getBannerToProductsApi,
  getCartApi,
  getWishlistApi,
} from "../Services/allApi";
import { serverUrl } from "../Services/serverUrl";
import { toast, ToastContainer } from "react-toastify";
import "../App.css";
import { useNavigate } from "react-router-dom";

function Products() {
  const [allProducts, setAllProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All Products");
  const [searchKey, setSearchKey] = useState("");
  const [wishlistItems, setWishlistItems] = useState([]);

  // animation to wishlist
  const [animateWishlist, setAnimateWishlist] = useState(null);

  // Cart state
  const [cartItems, setCartItems] = useState([]);
  const [animateCart, setAnimateCart] = useState(null);
  const [getcartItens, setGetCartItems] = useState([]);

  // get product carrousel
  const [getBanner, setGetBanner] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const navigate = useNavigate();

  const token = sessionStorage.getItem("token");

  useEffect(() => {
    getAllProducts();
    getProductBanner();

    if (token) {
      fetchWishlist();
      getCart();
    }

    setCurrentPage(1);
  }, [searchKey, activeCategory, token]);

  // get wishlist to set for existing product
  const fetchWishlist = async () => {
    const token = sessionStorage.getItem("token");
    if (!token) return;
    try {
      const reqHeader = { Authorization: `Bearer ${token}` };
      const result = await getWishlistApi(reqHeader);
      if (result.status === 200) {
        const wishlistArray = result.data.wishlist || [];
        setWishlistItems(wishlistArray.map((item) => item._id));
      }
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    }
  };

  //  getting all products
  const getAllProducts = async () => {
    const result = await getAllProductsApi(searchKey);
    if (result?.status === 200) {
      setAllProducts(result.data);
    } else {
      setAllProducts(result?.response?.data || []);
    }
  };

  // getProductBanner
  const getProductBanner = async () => {
    const result = await getBannerToProductsApi();
    if (result.status == 200) {
      setGetBanner(result.data);
    } else {
      setGetBanner(result.response.data);
    }
  };

  //  add wishlist
  const handleAddToWishlist = async (productId) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.warning("Please login first!");
        return;
      }
      const reqHeader = { Authorization: `Bearer ${token}` };
      if (wishlistItems.includes(productId)) {
        toast.warn("Already exists in wishlist!");
        return;
      }
      const response = await addToWishlistApi(productId, reqHeader);
      if (response.status === 200) {
        toast.success("Product added to wishlist!");
        setWishlistItems((prev) => [...prev, productId]);
      } else {
        toast.error("Failed to add to wishlist");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to wishlist");
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
      const reqHeader = { Authorization: `Bearer ${token}` };
      if (cartItems.includes(productId)) {
        toast.warn("Already in cart!");
        return;
      }
      const response = await addToCartApi(productId, reqHeader);
      if (response.status === 200) {
        toast.success("Product added to cart!");
        setCartItems((prev) => [...prev, productId]);
        setAnimateCart(productId);
        setTimeout(() => setAnimateCart(null), 500);
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };

  // const get cart
  const getCart = async () => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) {
        toast.warning("Please login first!");
        return;
      }
      const reqHeader = { Authorization: `Bearer ${token}` };
      const result = await getCartApi(reqHeader);

      if (result.status === 200) {
        const cartArray = result.data?.cart || [];
        setGetCartItems(cartArray); // store full cart

        // Only push valid productIds
        const productIds = cartArray
          .filter((item) => item.productId && item.productId._id)
          .map((item) => item.productId._id);

        setCartItems(productIds);
      } else {
        setGetCartItems([]);
        setCartItems([]);
        toast.error(result?.response?.data?.message || "Failed to load cart");
      }
    } catch (err) {
      console.error("Cart fetch error:", err);
      setGetCartItems([]);
      setCartItems([]);
      toast.error(err.message || "Something went wrong");
    }
  };

  // Pagination logic
  const filteredProducts = allProducts.filter(
    (product) =>
      activeCategory === "All Products" ||
      product.productCategory === activeCategory
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      {/* Carousel */}
      <Carousel className="mb-5">
        {getBanner?.length > 0 ? (
          getBanner.map((banner, index) => (
            <Carousel.Item key={index}>
              <img
                className="d-block w-100 carousel-img"
                src={`${serverUrl}/uploads/${banner?.productBanner}`}
                alt={`banner-${index}`}
              />
              <Carousel.Caption>
                <h3 className="text-light">Premium Bike Workshop</h3>
                <p>
                  State-of-the-art facility with certified technicians to care
                  for your bike.
                </p>
              </Carousel.Caption>
            </Carousel.Item>
          ))
        ) : (
          <Carousel.Item>
            <img
              className="d-block w-100 carousel-img"
              src="https://www.allextreme.in/media/weltpixel/owlcarouselslider/images/l/e/leg-guard.jpg"
              alt="Customer Service"
            />
            <Carousel.Caption>
              <h3 className="text-light">Fast & Friendly Service</h3>
              <p>
                Get back on the road faster with our quick turnaround and
                dedicated support team.
              </p>
            </Carousel.Caption>
          </Carousel.Item>
        )}
      </Carousel>

      {/* Search Bar */}
      <div className="search-bar m-3 d-flex flex-column flex-sm-row align-items-center justify-content-center gap-2 mt-5">
        <input
          onChange={(e) => setSearchKey(e.target.value)}
          type="text"
          placeholder="Search products..."
          className="form-control w-100 w-sm-50 w-md-25"
          style={{ maxWidth: "250px" }}
        />
        <button className="btn btn-primary px-4">Search</button>
      </div>

      <div className="products-page container-fluid mt-5">
        <div className="row">
          {/* Sidebar */}
          <aside className="col-12 col-md-3 mb-4 mb-md-0 sidebar">
            <h5 className="mb-3 text-info fw-bolder">Category</h5>
            <ul className="list-unstyled category-list">
              {["All Products", "Parts", "Accessories", "Oil"].map((cat) => (
                <li
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`fw-bolder ${
                    activeCategory === cat
                      ? "text-info text-decoration-underline"
                      : ""
                  }`}
                  style={{ cursor: "pointer" }}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </aside>

          {/* Product Grid */}
          <main className="col-12 col-md-9 mb-5">
            <Row className="g-4">
              {paginatedProducts?.length > 0 ? (
                paginatedProducts.map((product, index) => (
                  <Col key={index} md={4} lg={3}>
                    <div className="card product-card card-hover text-center mb-4">
                      <img
                        src={`${serverUrl}/uploads/${product?.productImage}`}
                        className="card-img-top"
                        alt={product?.productName}
                      />
                      <div className="card-body p-2">
                        {/* Category Badge */}
                        <p
                          className="category-badge bg-info  text-light"
                          style={{ textTransform: "capitalize" }}
                        >
                          {product?.productCategory}
                        </p>

                        <h6
                          className="card-title mb-1 fw-bolder text-dark"
                          style={{ textTransform: "capitalize" }}
                        >
                          {product?.productName}
                        </h6>
                        <p className="card-text text-success fw-bold mb-1">
                          <del className="text-danger me-1">
                            {" "}
                            ${product?.productPrice}
                          </del>
                          ${product?.offerPrice}
                        </p>

                        <div className="d-flex justify-content-center gap-2 mb-3">
                          <button
                            className="btn btn-info btn-sm"
                            onClick={async () => {
                              const token = sessionStorage.getItem("token");

                              if (token) {
                                // Only add if product is not already in cart
                                if (!cartItems.includes(product._id)) {
                                  await handleAddToCart(product._id);
                                }
                                navigate("/cart");
                              } else {
                                toast.warning("Login is required");
                                navigate("/login");
                              }
                            }}
                          >
                            Buy Now
                          </button>

                          {/* Cart Button */}
                          <button
                            className="btn btn-light btn-sm"
                            onClick={() => handleAddToCart(product._id)}
                          >
                            <i
                              className={`fa-solid fa-cart-shopping ${
                                cartItems.includes(product._id)
                                  ? "text-warning"
                                  : ""
                              } ${animateCart === product._id ? "bounce" : ""}`}
                            ></i>
                          </button>

                          {/* Wishlist Button */}
                          <button
                            className="btn btn-outline-dark btn-light btn-sm"
                            onClick={() => {
                              handleAddToWishlist(product._id);
                              setAnimateWishlist(product._id); // trigger animation
                              setTimeout(() => setAnimateWishlist(null), 500);
                            }}
                          >
                            <i
                              className={`fa-solid fa-heart ${
                                wishlistItems.includes(product._id)
                                  ? "text-danger"
                                  : "text-info"
                              } ${
                                animateWishlist === product._id ? "bounce" : ""
                              }`}
                            ></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))
              ) : (
                <p className="text-danger">Nothing To Display...</p>
              )}
            </Row>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <nav>
                  <ul className="pagination">
                    <li
                      className={`page-item ${
                        currentPage === 1 ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => {
                          setCurrentPage((prev) => prev - 1);
                          window.scrollTo({ top: 500, behavior: "smooth" });
                        }}
                      >
                        Previous
                      </button>
                    </li>

                    {Array.from({ length: totalPages }, (_, i) => (
                      <li
                        key={i}
                        className={`page-item ${
                          currentPage === i + 1 ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => {
                            setCurrentPage(i + 1);
                            window.scrollTo({ top: 500, behavior: "smooth" });
                          }}
                        >
                          {i + 1}
                        </button>
                      </li>
                    ))}

                    <li
                      className={`page-item ${
                        currentPage === totalPages ? "disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => {
                          setCurrentPage((prev) => prev + 1);
                          window.scrollTo({ top: 400, behavior: "smooth" });
                        }}
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>
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

export default Products;
