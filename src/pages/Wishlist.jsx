import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { getWishlistApi, removeFromWishlistApi, addToCartApi, getCartApi } from '../Services/allApi'
import { serverUrl } from '../Services/serverUrl'
import { useNavigate } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css';


function Wishlist() {
  const [getWishlist, setGetWishlist] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [animateCart, setAnimateCart] = useState(null)
  const navigate = useNavigate()

  // Get wishlist
  const getWishlistToProducts = async () => {
    try {
      const token = sessionStorage.getItem("token")
      if (token) {
        const reqHeader = { Authorization: `Bearer ${token}` }
        const result = await getWishlistApi(reqHeader)
        if (result.status === 200) {
          setGetWishlist(result.data.wishlist || [])
        } else {
          setGetWishlist(result.response?.data?.wishlist || [])
        }
      }
    } catch (err) {
      toast.error(err.message || "Something went wrong")
    }
  }

  // Get cart to track added products
  const getCart = async () => {
    try {
      const token = sessionStorage.getItem("token")
      if (!token) return
      const reqHeader = { Authorization: `Bearer ${token}` }
      const result = await getCartApi(reqHeader)
      if (result.status === 200) {
        const cartArray = result.data?.cart || []
        const productIds = cartArray
          .filter(item => item.productId && item.productId._id)
          .map(item => item.productId._id)
        setCartItems(productIds)
      }
    } catch (err) {
      console.error("Cart fetch error:", err)
    }
  }

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    const token = sessionStorage.getItem("token")
    if (!token) return
    const reqHeader = { Authorization: `Bearer ${token}` }
    try {
      const result = await removeFromWishlistApi(productId, reqHeader)
      if (result.status === 200) {
        toast.success("Wishlist item removed successfully")
        getWishlistToProducts()
      } else {
        toast.error("Can't delete data")
      }
    } catch (err) {
      toast.error(err.message || "Failed to delete")
    }
  }

  // Add to cart
  const handleAddToCart = async (productId) => {
    try {
      const token = sessionStorage.getItem("token")
      if (!token) {
        toast.warning("Please login first!")
        navigate("/login")
        return
      }
      const reqHeader = { Authorization: `Bearer ${token}` }
      if (cartItems.includes(productId)) {
        toast.warn("Already in cart!")
        return
      }
      const response = await addToCartApi(productId, reqHeader)
      if (response.status === 200) {
        toast.success("Product added to cart!")
        setCartItems(prev => [...prev, productId])
        setAnimateCart(productId)  // trigger bounce animation
        setTimeout(() => setAnimateCart(null), 500)
      } else {
        toast.error("Failed to add to cart")
      }
    } catch (err) {
      toast.error(err.message || "Failed to add to cart")
    }
  }

  useEffect(() => {
    getWishlistToProducts()
    getCart()
  }, [])

  return (
    <div className="container my-5">
      <h3 className="mb-4 fw-bold text-info">Wishlist ✏️</h3>

      {/* Desktop Table */}
      <div className="d-none d-md-block table-responsive">
        <table className="table align-middle text-center mt-4">
          <thead>
            <tr className="text-info">
              <th>#</th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Offer Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {getWishlist?.length > 0 ? (
              getWishlist.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <img
                      src={`${serverUrl}/uploads/${data.productImage}`}
                      alt={data.productName}
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                      className="mb-2 rounded"
                    />
                    <p className="fw-bolder text-dark">{data.productName}</p>
                  </td>
                  <td className="text-dark fw-bolder">{data.productCategory}</td>
                  <td>
                    <del className="text-danger fw-bolder me-2">${data.productPrice}</del>
                  </td>
                  <td>
                    <span className="text-success fw-bolder">${data.offerPrice}</span>
                  </td>
                  <td>
                    <button
                      className="btn btn-light btn-sm me-2"
                      onClick={() => handleAddToCart(data._id)}
                    >
                      <i
                        className={`fa-solid fa-cart-shopping ${
                          cartItems.includes(data._id) ? "text-warning" : ""
                        } ${animateCart === data._id ? "bounce" : ""}`}
                      ></i>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFromWishlist(data?._id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-danger fw-bold">
                  No wishlist found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="d-block d-md-none">
        {getWishlist?.length > 0 ? (
          <div className="row g-3">
            {getWishlist.map((data, index) => (
              <div key={index} className="col-12">
                <div className="card shadow-sm border-0 p-2">
                  <div className="d-flex align-items-center">
                    <img
                      src={`${serverUrl}/uploads/${data.productImage}`}
                      alt={data.productName}
                      style={{ width: "80px", height: "80px", objectFit: "cover" }}
                      className="rounded me-3"
                    />
                    <div>
                      <h6 className="fw-bold text-dark mb-1">{data.productName}</h6>
                      <p className="mb-0 small text-secondary">{data.productCategory}</p>
                      <p className="mb-0">
                        <del className="text-danger me-2">${data.productPrice}</del>
                        <span className="text-success fw-bold">${data.offerPrice}</span>
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 d-flex justify-content-end">
                    <button
                      className="btn btn-light btn-sm me-2"
                      onClick={() => handleAddToCart(data._id)}
                    >
                      <i
                        className={`fa-solid fa-cart-shopping ${
                          cartItems.includes(data._id) ? "text-warning" : ""
                        } ${animateCart === data._id ? "bounce" : ""}`}
                      ></i>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => removeFromWishlist(data?._id)}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-danger fw-bold">No wishlist found</p>
        )}
      </div>
    </div>
  )
}

export default Wishlist
