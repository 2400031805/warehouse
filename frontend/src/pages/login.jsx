import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async (e) => {

    e.preventDefault();

    if (!email || !password) {
      alert("Please enter username and password");
      return;
    }

    try {

      setLoading(true);

      const response = await fetch(
        "http://localhost:8080/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: email,
            password: password
          })
        }
      );

      const data = await response.text();

      if (!response.ok) {
        alert("Login failed. Please check your username and password.");
        return;
      }

      if (
        data === "User not found" ||
        data === "Invalid username or password"
      ) {
        alert(data);
        return;
      }

      // Save JWT token
      localStorage.setItem("token", data);
      localStorage.setItem("isLoggedIn", "true");

      if (remember) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      // Go to dashboard
      navigate("/dashboard");

    } catch (error) {

      console.error("Login error:", error);

      alert(
        "Unable to connect to the server. Make sure all backend services are running."
      );

    } finally {
      setLoading(false);
    }
  };


  const demoLogin = () => {

    setEmail("hima123");
    setPassword("Hima@123");

  };


  return (
    <div className="login-page">

      <header className="login-navbar">

        <div className="login-logo">

          <div className="login-logo-icon">
            O
          </div>

          <div>
            <strong>OMNISTOCK</strong>
            <span>Retail Management</span>
          </div>

        </div>


        <nav>

          <span>Products</span>
          <span>Features</span>
          <span>About</span>

          <button
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>

        </nav>

      </header>


      <main className="login-main">

        <section className="login-hero">

          <p className="login-eyebrow">
            CONNECTED RETAIL INTELLIGENCE
          </p>

          <h1>
            Simple inventory
            <br />
            management for
            <br />
            <span>modern retail.</span>
          </h1>

          <p className="login-description">
            Manage products, inventory, warehouses and
            orders from one simple and connected platform.
          </p>


          <div className="login-hero-buttons">

            <button
              onClick={() => navigate("/register")}
              className="hero-primary"
            >
              Get Started →
            </button>

            <button className="hero-secondary">
              Explore Platform
            </button>

          </div>

        </section>


        <section className="login-card">

          <div className="login-card-title">

            <div className="login-card-icon">
              O
            </div>

            <div>
              <h2>Welcome back</h2>
              <p>Sign in to your account</p>
            </div>

          </div>


          <form onSubmit={login}>

            <label>
              Email or Username

              <input
                type="text"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter your username"
              />

            </label>


            <label>
              Password

              <div className="password-input">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter password"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </label>


            <div className="login-options">

              <label className="remember-option">

                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) =>
                    setRemember(e.target.checked)
                  }
                />

                Remember me

              </label>


              <Link to="/forgot-password">
                Forgot password?
              </Link>

            </div>


            <button
              type="submit"
              className="login-submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>


          <div className="login-divider">
            <span>or</span>
          </div>


          <button
            className="demo-button"
            onClick={demoLogin}
          >
            Use Demo Account
          </button>


          <p className="login-register">

            Don't have an account?

            <Link to="/register">
              Create account
            </Link>

          </p>

        </section>

      </main>

    </div>
  );
}

export default Login;