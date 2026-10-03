import { useNavigate } from "react-router-dom";

function Account() {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  return (
    <div className="account-page">

      <header className="account-navbar">

        <div className="account-logo">

          <div className="account-logo-icon">
            O
          </div>

          <div>
            <strong>OMNISTOCK</strong>
            <span>Retail Management</span>
          </div>

        </div>


        <div className="account-nav-buttons">

          <button
            onClick={() => navigate("/dashboard")}
          >
            ← Dashboard
          </button>

          <button
            className="account-logout"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </header>


      <main className="account-main">

        <section className="account-intro">

          <p>ACCOUNT MANAGEMENT</p>

          <h1>
            Your Account
            <br />
            <span>Details</span>
          </h1>

          <div className="account-description">

            Manage your OmniStock profile,
            personal information and account
            security from one place.

          </div>


          <div className="account-points">

            <div>✓ Personal information</div>

            <div>✓ Secure account access</div>

            <div>✓ Administrator account</div>

          </div>

        </section>


        <section className="account-card">

          <div className="account-profile">

            <div className="account-avatar">
              A
            </div>

            <div>

              <h2>
                pathakota Hima Bindu
              </h2>

              <p>
                himapathakota2006@gmail.com
              </p>

              <span>
                Administrator
              </span>

            </div>

          </div>


          <div className="account-section">

            <div className="account-section-title">

              <div>👤</div>

              <div>
                <h3>Personal Information</h3>
                <p>Manage your account information</p>
              </div>

            </div>


            <div className="account-info-grid">

              <div>
                <label>FULL NAME</label>
                <strong>
                  pathakota Hima Bindu
                </strong>
              </div>

              <div>
                <label>EMAIL ADDRESS</label>
                <strong>
                  himapathakota2006@gmail.com
                </strong>
              </div>

              <div>
                <label>PHONE NUMBER</label>
                <strong>
                  +91 9876543210
                </strong>
              </div>

              <div>
                <label>ROLE</label>
                <strong>
                  Administrator
                </strong>
              </div>

            </div>


            <button
              className="account-primary-button"
              onClick={() =>
                alert("Edit Profile")
              }
            >
              Edit Profile →
            </button>

          </div>


          <div className="account-section">

            <div className="account-section-title">

              <div>🔐</div>

              <div>
                <h3>Account Security</h3>
                <p>Keep your account protected</p>
              </div>

            </div>


            <div className="security-row">

              <div className="security-icon">
                🔑
              </div>

              <div>
                <strong>Password</strong>
                <span>Last updated recently</span>
              </div>

              <button>
                Change Password
              </button>

            </div>


            <div className="security-row">

              <div className="security-icon">
                🛡
              </div>

              <div>
                <strong>
                  Two-Factor Authentication
                </strong>

                <span>
                  Add an extra layer of security
                </span>

              </div>

              <button>
                Enable
              </button>

            </div>

          </div>

        </section>

      </main>


      <footer className="account-footer">

        <strong>OmniStock</strong>

        <span>
          Retail Management Platform
        </span>

        <span>
          © 2026 OmniStock Retail
        </span>

      </footer>

    </div>
  );
}

export default Account;