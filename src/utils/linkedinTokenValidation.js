export async function getValidLinkedInAccessToken(linkedinId) {
  const accounts =
    JSON.parse(localStorage.getItem("linkedAccounts")) || [];

  const account = accounts.find(
    (acc) => acc.linkedinId === linkedinId
  );

  if (!account) {
    throw new Error("ACCOUNT_NOT_FOUND");
  }

  const accessTokenExpiresAt =
    account.token_issued_at + account.access_token_exp * 1000;
  if (Date.now() < accessTokenExpiresAt) {
    return account.access_token;
  }
  if (!account.refresh_token) {
    throw new Error("RELOGIN_REQUIRED");
  }

  const res = await fetch("/api/linkedin/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refresh_token: account.refresh_token,
    }),
  });

  if (!res.ok) {
    throw new Error("REFRESH_FAILED");
  }

  const refreshed = await res.json();

  const updatedAccount = {
    ...account,
    access_token: refreshed?.access_token,
    refresh_token: refreshed?.refresh_token,
    refresh_token_exp : refreshed?.refresh_token_exp,
    access_token_exp: refreshed?.access_token_exp,
    token_issued_at: Date.now(),
  };

  const index = accounts.findIndex(
    (acc) => acc.linkedinId === linkedinId
  );

  accounts.splice(index, 1, updatedAccount);

  localStorage.setItem(
    "linkedAccounts",
    JSON.stringify(accounts)
  );

  return refreshed.access_token;
}