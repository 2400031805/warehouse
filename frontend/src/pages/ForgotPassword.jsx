import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {

  const [email, setEmail] = useState("");

  const submit = (e) => {

    e.preventDefault();

    if (!email) {
      alert("Please enter your email");
      return;
    }

    alert(
      "If this email exists, a reset link will be sent."
    );

  };


  return (
    <div className="forgot-page">

      <div className="forgot-card">

        <div className="forgot-logo">
          O
        </div>

        <p className="forgot-eyebrow">
          ACCOUNT RECOVERY
        </p>

        <h1>
          Forgot password?
        </h1>

        <p>
          Enter your email address and we'll help
          you reset your password.
        </p>


        <form onSubmit={submit}>

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


          <button
            type="submit"
            className="forgot-button"
          >
            Send Reset Link
          </button>

        </form>


        <Link
          className="back-login"
          to="/"
        >
          ← Back to Sign In
        </Link>

      </div>

    </div>
  );
}

export default ForgotPassword;