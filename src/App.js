import "./App.css";
import { useEffect, useState } from "react";
import LinkedAccountsTable from "./components/linkedAccountTable";
import AlertBox from "./components/alertBox";
import ConnectSidebar from "./components/connectSidebar";
function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isAlert, setAlert] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const verifyUser = async (method) => {
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const redirectUri = process.env.REACT_APP_REDIRECT_URL;
    const state = method;

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

        const index = existing.findIndex(
          (acc) => acc.linkedinId === account.linkedinId
        );
        if(index !== -1){
          existing?.splice(index,1,account)
        }else{
          existing?.push(account)
        }
          localStorage.setItem(
            "linkedAccounts",
            JSON.stringify(existing)
          );
          sessionStorage.setItem(
            "linkedAccount",
            JSON.stringify(existing)
          )
          setAccounts(existing)
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
          onVerify={(method)=>verifyUser(method)}
        />
      )}
      <div className="table-section">
        <LinkedAccountsTable accounts={accounts} setAlert={(alert)=>setAlert(alert)}/>
      </div>
    </div>
  );}
export default App;
