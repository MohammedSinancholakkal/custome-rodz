import React from 'react'
import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <>
      
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="text-center">
          <h1>404 - Page Not Found</h1>
          <Link to="/" className="btn btn-info mt-3">Go to Home</Link>
        </div>
      </div>
    </>
  )
}

export default NotFound
