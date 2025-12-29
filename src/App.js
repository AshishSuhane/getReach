import "./App.css";
import { useEffect, useState } from "react";
import LinkedAccountsTable from "./components/linkedAccountTable";
import AlertBox from "./components/alertBox";
import ConnectSidebar from "./components/connectSidebar";
import config from "./config.json"
function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isAlert, setAlert] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const verifyUser = async () => {
    const clientId = config.CLIENT_ID;
    const redirectUri = config.REDIRECT_URL;
    const state = crypto.randomUUID();

    const authUrl =
      "https://www.linkedin.com/oauth/v2/authorization" +
      "?response_type=code" +
      "&client_id=" + clientId +
      "&redirect_uri=" + encodeURIComponent(redirectUri) +
      "&scope=" + encodeURIComponent("openid profile email") +
      "&state=" + state;

    window.location.href = authUrl;
  }
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");

    if (status === "success") {
      const data = params.get("data");

      if (data) {
        const account = JSON.parse(decodeURIComponent(data));
        const existing =
          JSON.parse(localStorage.getItem("linkedAccounts")) || [];

        const alreadyExists = existing.some(
          (acc) => acc.linkedinId === account.linkedinId
        );

        if (!alreadyExists) {
          localStorage.setItem(
            "linkedAccounts",
            JSON.stringify([...existing, account])
          );
          sessionStorage.setItem(
            "linkedAccount",
            JSON.stringify([...existing, account])
          )
          setAccounts((prev)=>[...prev, account])
        }
      }
      window.history.replaceState({}, "", "/heyreach?status=success");
    }

    if (status === "error") {
      window.history.replaceState({}, "", "/heyreach?status=error");
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get("status");

    if (!status) return;

    if (status === "success") {
      setAlert({ type: "success", message: "Account linked successfully" });
    }

    if (status === "error") {
      setAlert({ type: "error", message: "Failed to link account" });
    }

    window.history.replaceState({}, "", "/heyreach");
  }, []);
  useEffect(() => {
    const storedAccounts =
      JSON.parse(localStorage.getItem("linkedAccounts")) || [];
  
    setAccounts(storedAccounts);
  }, []);
  

  return (
    <div className="app-container">
      {/* Header */}
      <div className="header">
        <div className="header-text">
          <h2 className="page-title">Linked Accounts</h2>
          <p className="page-subtitle">
            Manage and monitor your connected LinkedIn accounts
          </p>
        </div>
  
        <div className="header-action">
          <button
            className="connect-btn"
            onClick={() => setShowSidebar(true)}
          >
            Connect Account
          </button>
        </div>
      </div>
  
      {/* Alert */}
      {isAlert && (
        <AlertBox
          type={isAlert.type}
          message={isAlert.message}
          onClose={() => setAlert(null)}
        />
      )}
  
      {/* Sidebar */}
      {showSidebar && (
        <ConnectSidebar
          onClose={() => setShowSidebar(false)}
          onVerify={verifyUser}
        />
      )}
      <div className="table-section">
        <LinkedAccountsTable accounts={accounts} />
      </div>
    </div>
  );}
export default App;
