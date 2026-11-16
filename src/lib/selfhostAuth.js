async function request(path, options = {}) {
  const response = await fetch(`/api/auth/${path}`, {
    credentials: "same-origin",
    ...options,
    headers: { "content-type": "application/json", ...options.headers },
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error || "Authentication request failed");
    error.status = response.status;
    throw error;
  }
  return payload;
}
const post = (path, data) => request(path, {
  method: "POST",
  body: JSON.stringify(data),
});
export const selfhostAuth = {
  async register(email, password) {
    return post("register", { email, password });
  },
  async login(email, password) {
    return post("login", { email, password });
  },
  async logout() {
    return post("logout", {});
  },
  async me() {
    return (await request("me")).user;
  },
};
