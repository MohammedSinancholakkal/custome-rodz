import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "../src/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import ContextShare from "./ContextApi/ContextShare.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ContextShare>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ContextShare>
  </React.StrictMode>
);
