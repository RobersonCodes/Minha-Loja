import API_CONFIG from "../config/api.js";
import { saveToken, saveUser } from "../utils/storage.js";

export async function login(email, password) {

  const response = await fetch(`${API_CONFIG.BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email,
      password
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Erro no login");
  }

  const token = data.token || data.data?.token;
  const user = data.user || data.data?.user;

  if (!token) {
    throw new Error("Token não retornado pela API");
  }

  saveToken(token);

  if (user) {
    saveUser(user);
    localStorage.setItem("role", user.role);
  }

  return data;
}