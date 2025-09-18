import { commonApi } from "./CommonApi";
import { serverUrl } from "./serverUrl";





///login registerr =================//////

//registerApi

export const RegisterApi = async (user)=>{
    return await commonApi("POST", `${serverUrl}/register`,user,"")
}


// //loginApi

export const LoginApi = async (user)=>{
    return await commonApi("POST", `${serverUrl}/login`,user,"")
}




  

//==============================================================//




// get home , allproducts, displayhomeproducts =====================//
// //getHomeProductsApi

export const getHomeProductsApi = async () => {
    return await commonApi("GET", `${serverUrl}/products/home`, "");
  };



//   tohomeProductsApi
export const addToHomeApi = async (pid, reqHeader) => {
    return await commonApi("PUT", `${serverUrl}/products/${pid}/tohome`, {}, reqHeader);
  };


// //getAllProductsApi

export const getAllProductsApi = async (searchKey)=>{ //search implimentation
    return await commonApi("GET", `${serverUrl}/all-product?search=${searchKey}`,"","")

}

// //getDispalyHomeProductsApi

export const getDispalyHomeProductsApi = async (searchKey)=>{
    return await commonApi("GET", `${serverUrl}/display-home-product?search=${searchKey}`,"","")

}


// // //getAdminProductsApi

export const getAdminProductsApi = async (reqHeader)=>{
    return await commonApi("GET", `${serverUrl}/admin-product`,"",reqHeader)

}





// ==  Add,delete,update=======================//

// //addProductApi

export const AddProductApi = async (reqBody, reqHeader) => {
    return await commonApi("POST", `${serverUrl}/add-product`, reqBody, reqHeader);
  }

// update product 
export const updateProductApi = async (pid,reqBody, reqHeader) => {
    return await commonApi("PUT", `${serverUrl}/edit-products/${pid}`,reqBody, reqHeader);
  };

  
// delete product 
export const deleteProductApi = async (id,reqHeader) => {
    return await commonApi("DELETE", `${serverUrl}/delete-products/${id}`,{}, reqHeader);
  };



  // remove from homrApi

 
export const removeFromHomeApi = (id, reqHeader) => {
  return commonApi("PATCH", `${serverUrl}/remove-from-home/${id}`, {}, reqHeader);
};








//  testimonials  ============================//

// add testimonials 

export const addTestimonialsApi = async (body,reqHeader) => {
  return await commonApi("POST", `${serverUrl}/add-testimony`,body, reqHeader);
};



// get testimonials 

export const getTestimonialsApi = async () => {
  return await commonApi("GET", `${serverUrl}/get-testimony`,"", "");
};


// get toAdminstimonials 

export const getToAdminestimonialsApi = async () => {
  return await commonApi("GET", `${serverUrl}/get-admin-testimony`,"", "");
};


// approve testimony api

export const updateTestimonialStatusApi = async (id,reqHeader) => {
  return await commonApi("PATCH", `${serverUrl}/testimonial-status/${id}`, {}, reqHeader);
};


// delete testimonials 

export const deleteTestimonialsApi = async (id) => {
  return await commonApi("DELETE", `${serverUrl}/delete-testimony/${id}`,{}, "");
};







// ==  Quote section  =======================//

// addQuoteApi

export const addQuoteApi = async (body,reqHeader) => {
  return await commonApi("POST", `${serverUrl}/add-quote`,body, reqHeader);
};


// getQuoteApi

export const getQuoteApi = async () => {
  return await commonApi("GET", `${serverUrl}/get-quote`,"", "");
};



// deletAQuoteApi

export const deletAQuoteApi = async (id,reqHeader) => {
  return await commonApi("DELETE", `${serverUrl}/delete-quote/${id}`,{}, reqHeader);
};


// confirm quote

export const confirmQuoteApi = async (id, reqHeader) => {
  return await commonApi("PUT", `${serverUrl}/quotes/confirm/${id}`, {}, reqHeader);
};




// get confirmed quote only

export const getConfirmedQuoteApi = async (reqHeader) => {
  return await commonApi("GET", `${serverUrl}/quotes/confirmed`, "", reqHeader);
};



// get confirmed quote only

export const rejectQuoteApi = async (id,reqHeader) => {
  return await commonApi("PUT", `${serverUrl}/quotes/reject/${id}`, {}, reqHeader);
};







// ==  add booked services section  =======================//


// addBookedServicesApi

export const addBookedServicesApi = async (body,reqHeader) => {
  return await commonApi("POST", `${serverUrl}/add-booked-services`,body, reqHeader);
};



// getBookedServicesApi

export const getBookedServicesApi = async () => {
  return await commonApi("GET", `${serverUrl}/get-booked-services`,"", "");
};



// confirm booked Api
export const confirmBookedServiceApi = async (id, reqHeader) => {
  return await commonApi("PUT",`${serverUrl}/booked/confirm/${id}`,{},reqHeader);
};



// get confirmed services ============ //

// Get only confirmed services
export const getConfirmedServicesApi = async () => {
  return await commonApi("GET", `${serverUrl}/booked/confirmed`, "", "");
};



// delete only confirmed services
export const deleteConfirmedServicesApi = async (id,reqHeader) => {
  return await commonApi("DELETE", `${serverUrl}/delete/confirmed/${id}`, {}, reqHeader);
};


// deleteBookedServicesApi

export const deleteABookedServicesApi = async (id,reqHeader) => {
  return await commonApi("DELETE", `${serverUrl}/delete-services/${id}`,{},reqHeader);
};











// banner section =========================//

// addHomeBanner

export const addHomeBannerApi = async (body,reqHeader) => {
  return await commonApi("POST", `${serverUrl}/add-home-banner`,body, reqHeader);
};



// getHomeBanner

export const getHomeBannerApi = async () => {
  return await commonApi("GET", `${serverUrl}/get-home-banner`,"", "");
};


// deleteHomeBanner

export const deleteHomeBannerApi = async (id,reqHeader) => {
  return await commonApi("DELETE", `${serverUrl}/delete-home-banner/${id}`,{}, reqHeader);
};



// getBannerToHome

export const getBannerToHomeApi = async () => {
  return await commonApi("GET", `${serverUrl}/get-banner-tohome`,"", "");
};




// product banner section =========================//

// addProductBanner

export const addProductBannerApi = async (body,reqHeader) => {
  return await commonApi("POST", `${serverUrl}/add-product-banner`,body, reqHeader);
};



// getProductBanner

export const getProductBannerApi = async () => {
  return await commonApi("GET", `${serverUrl}/get-product-banner`,"", "");
};



// deleteProductBanner

export const deleteProductBannerApi = (id, reqHeader) => {
  return commonApi("DELETE", `${serverUrl}/delete-product-banner/${id}`, {}, reqHeader);
};


// getBannerToProducts

export const getBannerToProductsApi = async () => {
  return await commonApi("GET", `${serverUrl}/get-banner-toproducts`,"", "");
};







// service banner section =========================//

// addServiceBanner

export const addServiceBannerApi = async (body,reqHeader) => {
  return await commonApi("POST", `${serverUrl}/add-service-banner`,body, reqHeader);
};



// getServiceBanner

export const getServiceBannerApi = async () => {
  return await commonApi("GET", `${serverUrl}/get-service-banner`,"", "");
};



// deleteServiceBanner

export const deleteServiceBannerApi = (id, reqHeader) => {
  return commonApi("DELETE", `${serverUrl}/delete-service-banner/${id}`, {}, reqHeader);
};


// getBannerToServices

export const getBannerToServicesApi = async () => {
  return await commonApi("GET", `${serverUrl}/get-banner-toservices`,"", "");
};





// wishlist section =========================//

// add to wishlist

export const addToWishlistApi = async (productId,reqHeader) => {
  return await commonApi("POST", `${serverUrl}/add/wishlist/${productId}`,{}, reqHeader);
};




// get wishlist wishlist

export const getWishlistApi = async (reqHeader) => {
  return await commonApi("GET", `${serverUrl}/get-wishlist`,{}, reqHeader);
};



// remove from wishlist

export const removeFromWishlistApi = async (productId,reqHeader) => {
  return await commonApi("DELETE", `${serverUrl}/remove-wishlist/${productId}`,{}, reqHeader);
};






// ===================== 🛒 CART =====================

// Add to Cart

export const addToCartApi = async (productId, reqHeader) => {
  return await commonApi("POST",`${serverUrl}/add-cart`,{ productId, quantity: 1 },reqHeader);
};



// get cart

export const getCartApi = async (reqHeader) => {
  return await commonApi("GET",`${serverUrl}/get-cart`,{},reqHeader);
};


// remove cart

export const removeFromCartApi = async (productId,reqHeader) => {
  return await commonApi("DELETE",`${serverUrl}/remove-cart/${productId}`,{},reqHeader);
};



// update cart

export const updateCartQuantityApi = async (productId, quantity, reqHeader) => {
  return await commonApi("PUT",`${serverUrl}/update-cart-quantity`,{ productId, quantity },reqHeader);
};



// empty cart
export const emptyCartApi = async (reqHeader) => {
  return await commonApi("DELETE",`${serverUrl}/empty-cart`,{},reqHeader);
};





// ===================== 💳 RAZORPAY PAYMENT =====================
// Create Razorpay order
export const createOrderApi = async (orderData, headers) => {
  return await commonApi("POST", `${serverUrl}/create-order`, orderData, headers);
};

// Verify Razorpay payment
export const verifyPaymentApi = async (paymentData, headers) => {
  return await commonApi("POST", `${serverUrl}/verify-payment`, paymentData, headers);
};

// Get all payments/orders
export const getAllPaymentsApi = async (reqHeader) => {
  return await commonApi("GET", `${serverUrl}/get-payments`, {}, reqHeader);
};

// Send confirmation email for an order
export const sendConfirmationEmailApi = async (orderId, reqHeader) => {
  return await commonApi("POST",`${serverUrl}/send-confirmation-email`,{ orderId },reqHeader);
};

// Delete order by ID
export const deleteOrderApi = async (orderId, reqHeader) => {
  return await commonApi("DELETE",`${serverUrl}/delete-order/${orderId}`,{},reqHeader);
};

// Get all orders for logged-in user
export const getUserOrdersApi = async (reqHeader) => {
  return await commonApi("GET", `${serverUrl}/my-orders`, {}, reqHeader); // fixed empty string to {}
};




// ================ billing section ===================

// //getAllProductsApi

export const getAllProductToBillingApi = async (searchKey)=>{ //search implimentation
  return await commonApi("GET", `${serverUrl}/all-product?search=${searchKey}`,"","")

}


// add billing details

export const addBillingDetailsApi = async (reqBody,reqHeader)=>{ //search implimentation
  return await commonApi("POST", `${serverUrl}/add-billing`,reqBody,reqHeader)

}


// get billing details

export const getBillingDetailsApi = async (reqHeader,searchVehicle)=>{ //search implimentation
  return await commonApi("GET", `${serverUrl}/get-billing?search=${searchVehicle}`,"",reqHeader)

}


// delete billing details

export const deleteBillingDetailsApi = async (id,reqHeader)=>{ //search implimentation
  return await commonApi("DELETE", `${serverUrl}/delete-billing/${id}`,{},reqHeader)

}


// delete billing details

export const deleteOrdersOfUsersApi = async (id,reqHeader)=>{ //search implimentation
  return await commonApi("DELETE", `${serverUrl}/delete-orders-users/${id}`,{},reqHeader)

}


// get billing details

// Update billing details
export const updateBillingDetailsApi = async (id, data, reqHeader) => {
  return await commonApi("PUT",`${serverUrl}/update-billing/${id}`, data,reqHeader);
};




