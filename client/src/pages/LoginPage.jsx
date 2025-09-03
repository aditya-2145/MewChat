import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDataSubmitted, setIsDataSubmited] = useState(false);
  const { login } = useContext(AuthContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (currentState === "Sign Up" && !isDataSubmitted) {
      setIsDataSubmited(true);
      return;
    }
    login(currentState === "Sign Up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
  };
  return (
    <div className="min-h-screen bg-cover bg-center flex items-center gap-8 justify-center sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* ------left--------- */}
      <img src={assets.logo_big} alt="" className="w-[min(30vw,450px)]" />
      {/* ----------right----------- */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currentState}
          {isDataSubmitted && (
            <img
              onClick={() => setIsDataSubmited(false)}
              src={assets.arrow_icon}
              alt=""
              className="w-5 cursor-pointer"
            />
          )}
        </h2>
        {currentState == "Sign Up" && !isDataSubmitted && (
          <input
            onChange={(event) => setFullName(event.target.value)}
            value={fullName}
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Full Name"
            required
          />
        )}
        {!isDataSubmitted && (
          <>
            <input
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              type="email"
              placeholder="Enter Email Address"
              required
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            />
            <div className="relative w-full">
              <input
                onChange={(event) => setPassword(event.target.value)}
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
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </>
        )}
        {currentState === "Sign Up" && isDataSubmitted && (
          <textarea
            onChange={(event) => setBio(event.target.value)}
            value={bio}
            rows={4}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Add A Bio"
          ></textarea>
        )}
        <div className="flex items-center gap-2 text-sm text-white/95">
          <input type="checkbox" />
          <p>Agree to the terms & privacy policies.</p>
        </div>
        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-[#A5D9A0]/50 to-[#1C4D33]
 text-white rounded-md cursor-pointer"
        >
          {currentState == "Sign Up" ? "Create Account" : "LogIn Now"}
        </button>

        <div className="flex flex-col gap-2">
          {currentState === "Sign Up" ? (
            <p className="text-sm text-white/95">
              Already have an account?{" "}
              <span
                onClick={() => {
                  setCurrentState("LogIn");
                  setIsDataSubmited(false);
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
