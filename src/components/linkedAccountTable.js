function LinkedAccountsTable({accounts}) {
// Updated JSX Component (minimal changes needed)
return (
  <div className="accounts-container">
    {accounts.length === 0 ? (
      <div className="no-account-card full-width">
        No account added
      </div>
    ) : (
      accounts.map((acc, i) => (
        <div className="account-card linkedin-style" key={i}>
          <div className="account-image-wrapper">
            {acc.profile && (
              <img
                src={acc.profile}
                alt={acc.name}
                className="account-image"
              />
            )}
          </div>

          <div className="account-info">
            <h3 className="account-name">{acc.name}</h3>
            <p className="account-email">{acc.email}</p>
          </div>
        </div>
      ))
    )}
  </div>
);
}
export default LinkedAccountsTable;