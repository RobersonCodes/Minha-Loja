import { getToken } from "../utils/storage.js";

const API_URL = "http://localhost:3000/api/v1";

export async function uploadProductImage(file) {
  if (!file) {
    throw new Error("Selecione uma imagem antes de enviar.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_URL}/uploads/products/image`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    body: formData
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Erro ao enviar imagem.");
  }

  return result.data;
}