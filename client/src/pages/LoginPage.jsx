import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import axios from "axios";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign Up"); // "Sign Up" or "LogIn"
  const [step, setStep] = useState(1); // 1 = user details, 2 = OTP input
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useContext(AuthContext);

  // Step 1: request OTP or login directly
  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (currentState === "Sign Up" && step === 1) {
      try {
        const res = await axios.post("/api/auth/signup", {
          fullName,
          email,
          password,
          bio,
        });
        if (res.data.success) {
          toast.success("OTP sent to your email!");
          setStep(2);
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error(error);
        toast.error("Signup failed");
      }
      return;
    }

    if (currentState === "LogIn") {
      login("login", { email, password });
    }
  };

  // Step 2: verify OTP
  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    try {
      const res = await axios.post("/api/auth/verify-otp", { email, otp });
      if (res.data.success) {
        toast.success("Account created successfully!");
        localStorage.setItem("token", res.data.token);
        window.location.href = "/"; 
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center gap-8 justify-center sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* ------left--------- */}
      <img src={assets.logo_big} alt="" className="w-[min(30vw,450px)]" />

      {/* ----------right----------- */}
      <form
        onSubmit={
          currentState === "Sign Up" && step === 2
            ? handleVerifyOtp
            : onSubmitHandler
        }
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currentState}
          {currentState === "Sign Up" && step === 2 && (
            <img
              onClick={() => setStep(1)}
              src={assets.arrow_icon}
              alt=""
              className="w-5 cursor-pointer"
            />
          )}
        </h2>

        {/* ---- SignUp Step 1 ---- */}
        {currentState === "Sign Up" && step === 1 && (
          <>
            <input
              onChange={(e) => setFullName(e.target.value)}
              value={fullName}
              type="text"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Full Name"
              required
            />
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Enter Email Address"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <div className="relative w-full">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                required
                className="p-2 w-full border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 pr-10"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>
            <textarea
              onChange={(e) => setBio(e.target.value)}
              value={bio}
              rows={4}
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Add A Bio"
            ></textarea>
          </>
        )}

        {/* ---- SignUp Step 2: OTP ---- */}
        {currentState === "Sign Up" && step === 2 && (
          <input
            onChange={(e) => setOtp(e.target.value)}
            value={otp}
            type="text"
            placeholder="Enter OTP"
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        )}

        {/* ---- Login ---- */}
        {currentState === "LogIn" && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="Enter Email Address"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <div className="relative w-full">
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password"
                required
                className="p-2 w-full border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 pr-10"
              />
              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </span>
            </div>
          </>
        )}

        <div className="flex items-center gap-2 text-sm text-white/95">
          <input type="checkbox" required />
          <p>Agree to the terms & privacy policies.</p>
        </div>

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-[#A5D9A0]/50 to-[#1C4D33] text-white rounded-md cursor-pointer"
        >
          {currentState === "Sign Up" && step === 1
            ? "Get OTP"
            : currentState === "Sign Up" && step === 2
            ? "Verify OTP"
            : "LogIn Now"}
        </button>

        <div className="flex flex-col gap-2">
          {currentState === "Sign Up" ? (
            <p className="text-sm text-white/95">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrentState("LogIn");
                  setStep(1);
                }}
                className="font-medium text-[#74c990] cursor-pointer"
              >
                Login
              </span>
            </p>
          ) : (
            <p className="text-sm text-white/95">
              Create an account?{" "}
              <span
                onClick={() => {
                  setCurrentState("Sign Up");
                  setStep(1);
                }}
                className="font-medium text-[#74c990] cursor-pointer"
              >
                Click Here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
