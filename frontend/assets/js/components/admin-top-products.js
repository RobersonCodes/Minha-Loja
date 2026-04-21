function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

export function renderTopProducts(products = []) {
  const container = document.getElementById("adminTopProducts");

  if (!products.length) {
    container.innerHTML = `<p class="empty-state">Nenhum produto vendido até o momento.</p>`;
    return;
  }

  container.innerHTML = products
    .map(
      (product, index) => `
        <div class="ranking-item">
          <div class="ranking-left">
            <span class="ranking-position">#${index + 1}</span>
            <div>
              <strong>${product.name}</strong>
              <small>${product.category || "Sem categoria"}</small>
            </div>
          </div>

          <div class="ranking-right">
            <strong>${product.quantitySold} vendas</strong>
            <small>${formatCurrency(product.revenue)}</small>
          </div>
        </div>
      `
    )
    .join("");
}