import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = (e) => {

    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    localStorage.setItem(
      "user",
      JSON.stringify({
        name: name,
        email: email
      })
    );

    alert("Account created successfully");

    navigate("/");
  };


  return (
    <div className="register-page">

      <div className="register-card">

        <div className="register-logo">

          <div className="register-logo-icon">
            O
          </div>

          <strong>OMNISTOCK</strong>

        </div>


        <p className="register-eyebrow">
          CREATE ACCOUNT
        </p>

        <h1>
          Join OmniStock
        </h1>

        <p className="register-subtitle">
          Create your retail management account.
        </p>


        <form onSubmit={register}>

          <label>
            Full Name

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
            />

          </label>


          <label>
            Email Address

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />

          </label>


          <label>
            Password

            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
            />

          </label>


          <button
            type="submit"
            className="register-button"
          >
            Create Account
          </button>

        </form>


        <p className="register-login">

          Already have an account?

          <Link to="/">
            Sign in
          </Link>

        </p>

      </div>

    </div>
  );
}

export default Register;