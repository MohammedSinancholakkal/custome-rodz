import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import {
  addToHomeApi,
  deleteProductApi,
  getDispalyHomeProductsApi,
  removeFromHomeApi,
} from "../../Services/allApi";
import { serverUrl } from "../../Services/serverUrl";
import EditProducts from "../../Components/EditProducts";
import { toast } from "react-toastify";
import { editProductResponseContext } from "../../ContextApi/ContextShare";
import { Link, useLocation } from "react-router-dom"; // ⬅ added useLocation
import "../Admin/DisplayHomeProducts.css";
import 'react-toastify/dist/ReactToastify.css';




function DisplayHomeProducts() {


  const [homeProductsCount, setHomeProductsCount] = useState(0);
  const [searchKey, setSearchKey] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Products");



  const { editProductResponse } = useContext(editProductResponseContext);
  const [getdisplayHomeProducts, setGetDisplayHomeProducts] = useState([]);



  const categories = ["All Products", "Parts", "Accessories", "Oil"];
  const location = useLocation(); // ⬅ to capture navigation state



  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // number of products per page


  
  // getHomeDisplayProducts
  const displayHomeProducts = async () => {
    const result = await getDispalyHomeProductsApi(searchKey);
    if (result.status == 200) {
      setGetDisplayHomeProducts(result.data);
      const homeCount = result.data.filter((product) => product.isHome).length;
      setHomeProductsCount(homeCount);
    } else {
      setGetDisplayHomeProducts(result.response.data);
    }
  };

  // add/remove home section
  const handleAddToHome = async (pid, isHome) => {
    const token = sessionStorage.getItem("token");
    if (!token) return;

    const reqHeader = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    let result;

    if (isHome) {
      // remove from home
      result = await removeFromHomeApi(pid, reqHeader);
      if (result.status === 200) {
        setHomeProductsCount((prev) => prev - 1);
        setGetDisplayHomeProducts((prev) =>
          prev.map((product) =>
            product._id === pid ? { ...product, isHome: false } : product
          )
        );
      } else {
        toast.error(result.response?.data);
      }
    } else {
      // add to home
      if (homeProductsCount >= 4) {
        toast.warning("Only 4 products can be added to Home.");
        return;
      }
      result = await addToHomeApi(pid, reqHeader);
      if (result.status === 200) {
        setHomeProductsCount((prev) => prev + 1);
        setGetDisplayHomeProducts((prev) =>
          prev.map((product) =>
            product._id === pid ? { ...product, isHome: true } : product
          )
        );
      } else {
        toast.error(result.response?.data);
      }
    }
  };



  // delete product
  const handleDeleteAProduct = async (pid) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      const reqHeader = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      };

      const result = await deleteProductApi(pid, reqHeader);
      if (result.status == 200) {
        displayHomeProducts();
      } else {
        toast.warning(result.response.data);
      }
    }
  };

  // filtered and paginated products
  const filteredProducts = getdisplayHomeProducts.filter(
    (product) =>
      selectedCategory === "All Products" ||
      product.productCategory === selectedCategory
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );



  const token = sessionStorage.getItem('token')

// fetch products when dependencies change
useEffect(() => {
  if (token) {
    displayHomeProducts();
  }
}, [editProductResponse, searchKey, selectedCategory, token]);

// reset pagination only when filters change
useEffect(() => {
  setCurrentPage(1);
}, [searchKey, selectedCategory]);


  

  // scroll handling on navigation
  useEffect(() => {
    if (location.state?.scrollTo) {
      const section = document.getElementById(location.state.scrollTo);
      if (section) section.scrollIntoView({ behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <>
      <a
        href="/uiedits"
        className="fw-bold text-info"
        style={{
          textDecoration: "none",
          marginTop: "30px",
          marginLeft: "10px",
          display: "inline-block",
        }}
      >
        <i className="fa-solid fa-arrow-left"></i> Back
      </a>
      <h2 className="text-center text-info fw-bold mb-4">Home Products</h2>
      <p className="text-center text-dark">
        Here you can manage the products displayed on the home page.
      </p>
      <div className="d-flex justify-content-center gap-2">
        <Link to={"/"}>
          <Button className="btn-info ">Home</Button>
        </Link>
        <Link to={"/addproducts"}>
          <Button className="btn-info">Add Product</Button>
        </Link>
      </div>

      {/* search */}
      <div className="search-bar m-3 d-flex flex-column flex-sm-row align-items-center justify-content-center gap-2 mt-5">
  <div className="input-group" style={{ maxWidth: "500px", width: "100%" }}>
    <span className="input-group-text bg-primary border-end-0">
      <i className="fa fa-search text-light"></i>
    </span>
    <input
      value={searchKey}
      onChange={(e) => setSearchKey(e.target.value)}
      type="text"
      placeholder="Search products..."
      className="form-control search-input border-start-0"
    />
  </div>
</div>



      {/* sidebar + product section */}
      <div className="products-page container-fluid">
        <div className="row">
          <aside
            className="col-12 col-md-3 mb-4 mb-md-0 position-sticky fw-bolder text-dark"
            style={{ top: "80px", height: "fit-content" }}
          >
            <h5 className="mb-3 text-info fw-bolder">Category</h5>
            <ul className="list-unstyled category-list text-dark">
              {categories.map((category, idx) => (
                <li
                  key={idx}
                  onClick={() => setSelectedCategory(category)}
                  className={`fw-bolder ${
                    selectedCategory === category
                      ? "text-info text-decoration-underline"
                      : ""
                  }`}
                  style={{ cursor: "pointer", marginBottom: "10px" }}
                >
                  {category}
                </li>
              ))}
            </ul>
          </aside>

          {/* Product display */}
          <main className="col-12 col-md-9 mb-5">
            <div id="products-section" className="row g-4 mb-5">
              <Row>
                {paginatedProducts?.map((product, index) => (
                  <Col key={index} md={4} lg={3}>
                    <div className="card shadow-sm text-center mt-5 card-hover">
                      <img
                        src={`${serverUrl}/uploads/${product?.productImage}`}
                        className="card-img-top"
                        style={{ objectFit: "contain", padding: "8px" }}
                        alt={product?.productName}
                      />
                      <div className="card-body p-2">
                        <p
                          className="small mb-1 px-2 py-1 text-light bg-info rounded fw-bolder"
                          style={{ display: "inline-block", fontSize: "0.75rem" }}
                        >
                          {product?.productCategory}
                        </p>
                        <h6
                          className="card-title mb-1 fw-bolder text-dark text-capitalize"
                          style={{ fontSize: "0.95rem", textTransform: "capitalize" }}
                        >
                          {product?.productName}
                        </h6>

                        <p
                          className="card-text text-success fw-bold mb-1"
                          style={{ fontSize: "0.9rem" }}
                        >
                          <del className="text-danger me-1">
                            ₹{product?.productPrice}
                          </del>
                          ₹{product?.offerPrice}
                        </p>

                        <div className="d-flex justify-content-center mb-3">
                          <EditProducts product={product} />
                          <button
                            className="btn btn-danger btn-sm me-1"
                            style={{ fontSize: "0.75rem" }}
                            onClick={() => handleDeleteAProduct(product?._id)}
                          >
                            DELETE
                          </button>
                          <button
                            className={`btn btn-sm me-1 ${
                              product.isHome
                                ? "btn-success"
                                : homeProductsCount >= 4
                                ? "btn-danger"
                                : "btn-info"
                            }`}
                            style={{ fontSize: "0.75rem" }}
                            onClick={() => handleAddToHome(product._id, product.isHome)}
                          >
                            {product.isHome ? (
                              <>
                                ADDED <i className="fa-solid fa-check ms-1"></i>
                              </>
                            ) : homeProductsCount >= 4 ? (
                              "MAXIMUM!"
                            ) : (
                              "TO HOME"
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <nav>
                    <ul className="pagination">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => {
                            setCurrentPage(prev => prev - 1);
                            window.scrollTo({ top: 500, behavior: "smooth" });
                          }}
                        >
                          Previous
                        </button>
                      </li>

                      {Array.from({ length: totalPages }, (_, i) => (
                        <li
                          key={i}
                          className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                        >
                          <button
                            className="page-link"
                            onClick={() => {
                              setCurrentPage(i + 1);
                              window.scrollTo({ top: 400, behavior: "smooth" });
                            }}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}

                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => {
                            setCurrentPage(prev => prev + 1);
                            window.scrollTo({ top: 300, behavior: "smooth" });
                          }}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default DisplayHomeProducts;
