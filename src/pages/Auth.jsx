import React, { useState } from "react";
import "./Auth.css";
import { ToastContainer, toast } from "react-toastify";
import { LoginApi, RegisterApi } from "../Services/allApi";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import 'react-toastify/dist/ReactToastify.css';


function Auth({ login }) {
  // spin loading
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isLoginForm = login === true;

  const [userData, setUserData] = useState({
    username: "",
    email: "",
    password: "",
  });

  // eye button
  const [showPassword, setShowPassword] = useState(false);




  // handle register//

  const handleRegister = async (e) => {
    e.preventDefault();
    const { username, email, password } = userData;

    // patterns (improved regex to allow all valid emails)
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.warn("Not a valid Email Format");
      return;
    } else if (/\s/.test(email)) {
      toast.warn("White spaces not allowed");
      return;
    }

    if (!username || !email || !password) {
      toast.warn("Please fill the missing fields");
    } else {
      const result = await RegisterApi(userData);
      if (result.status === 200 || result.status === 201) {
        toast.success(`${userData.username} Registered Successfully`);
        setUserData({ username: "", email: "", password: "" });
        navigate("/login");
      } else {
        toast.warn(result.response.data);
      }
    }
  };




  // handle login//

  const handleLogin = async (e) => {
    e.preventDefault();

    const { email, password } = userData;

    try {
      // spinner
      setLoading(true);

      const result = await LoginApi({ email, password });
      console.log(result);

      if (result.status === 200) {

        // save session
        sessionStorage.setItem("username",result.data.existingUser.username);
        sessionStorage.setItem("token", result.data.token);
        sessionStorage.setItem("userRole", result.data.existingUser.role);

        setUserData({ username: "", email: "", password: "" });

        // role-based redirect
        setTimeout(() => {
          if (result.data.existingUser.role === "admin") {
            navigate("/admin");
            toast.success(`Admin ${result.data.existingUser.username} Logged in Successfully`);
          } else {
            navigate("/");
            toast.success(`${result.data.existingUser.username} Logged in Successfully`);
          }
          
        }, 500);
      } else {
        toast.warning(result.response.data);
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong");
    } finally {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  };
  

  return (
    <>
      {/* Back Button */}
      <a
        href={isLoginForm ? "/register" : "/"}
        style={{
          position: "fixed",
          top: "80px",
          left: "100px",
          color: "white",
          padding: "8px 14px",
          borderRadius: "8px",
          textDecoration: "none",
          fontWeight: "bold",
          boxShadow: "0px 3px 6px rgba(0,0,0,0.2)",
        }}
      >
        ← Back
      </a>

      <div className="login-container">
        <form
          className="login-form"
          onSubmit={isLoginForm ? handleLogin : handleRegister}
        >
          {isLoginForm ? (
            <>
              <h2>LOGIN FORM</h2>

              <label>EMAIL</label>
              <input
                type="text"
                placeholder="Enter Email-Id"
                required
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                value={userData.email}
              />

              <label>PASSWORD</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  required
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                  value={userData.password}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="login-options">
                <label>
                  <input type="checkbox" /> Remember Me
                </label>

                <a href="/forgot-password" className="forgot-link">Forgot Password?</a>

              </div>

              <button type="submit" disabled={loading}>LOGIN</button>

              {loading && (
                <div className="loading-overlay">
                  <FaSpinner className="slow-spin" />
                  Logging in...
                </div>
              )}

              <p className="signup-text">
                Don't have an account ?{" "}
                <a style={{ textDecoration: "underline" }} href="/register">
                  Register
                </a>
              </p>
            </>
          ) : (
            <>
              <h2>REGISTER FORM</h2>

              <label>USERNAME</label>
              <input
                type="text"
                placeholder="Enter username"
                required
                onChange={(e) =>
                  setUserData({ ...userData, username: e.target.value })
                }
                value={userData.username}
              />

              <label>EMAIL</label>
              <input
                type="text"
                placeholder="Enter Email-Id"
                required
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                value={userData.email}
              />

              <label>PASSWORD</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter Password"
                  required
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                  value={userData.password}
                />
                <span
                  className="eye-icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button type="submit">REGISTER</button>
              <br />
              <br />
              <p className="login-text text-light">
                Already have an account ?{" "}
                <a style={{ textDecoration: "none" }} href="/login">
                  Login
                </a>
              </p>
            </>
          )}
        </form>
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

export default Auth;
