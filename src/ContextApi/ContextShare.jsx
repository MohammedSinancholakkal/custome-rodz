import React, { createContext, useState } from 'react'

export const editProductResponseContext = createContext()

function ContextShare({children}) {

    const [editProductResponse,setEditProductResponse]=useState("")
  return (
    <>
    <editProductResponseContext.Provider value={{editProductResponse,setEditProductResponse}}>
      {children}
    </editProductResponseContext.Provider>
    </>
  )
}

export default ContextShare
