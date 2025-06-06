import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("sakdhaskldj@gmail.com");
  const [password, setPassword] = useState("asdasasdasas");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation - replace with real auth later
    if (email && password) {
      navigate("/landing"); // This navigates to the landing page
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white text-gray-500 max-w-[350px] mx-4 md:p-6 p-4 text-left text-sm rounded-xl shadow-[0px_0px_10px_0px] shadow-black/10"
    >
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Login Now
      </h2>
      <input
        id="email"
        className="w-full border my-3 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
        type="email"
        placeholder="Enter your email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        id="password"
        className="w-full border mt-1 border-gray-500/30 outline-none rounded-full py-2.5 px-4"
        type="password"
        placeholder="Enter your password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="text-right py-4">
        <a className="text-blue-600 underline" href="#">
          Forgot Password
        </a>
      </div>
      <button
        type="submit"
        className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600/90 active:scale-95 transition py-2.5 rounded-full text-white"
      >
        Log in
      </button>
      <p className="text-center mt-4">
        Don't have an account?{" "}
        <a href="#" className="text-blue-500 underline">
          Signup Now
        </a>
      </p>
    </form>
  );
};

export default Login;
