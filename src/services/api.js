const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:3001";

export async function getProductBySlug(slug) {
  const response = await fetch(
    `${API_URL}/api/produtos/${slug}`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Erro ao buscar produto."
    );
  }

  return data.product;
}