function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

export function renderSummaryCards(summary) {
  const container = document.getElementById("adminSummaryCards");

  container.innerHTML = `
    <article class="metric-card">
      <span class="metric-label">Faturamento Total</span>
      <strong class="metric-value">${formatCurrency(summary.totalRevenue)}</strong>
      <small class="metric-meta">Receita consolidada de pedidos válidos</small>
    </article>

    <article class="metric-card">
      <span class="metric-label">Total de Pedidos</span>
      <strong class="metric-value">${summary.totalOrders}</strong>
      <small class="metric-meta">Volume total de pedidos cadastrados</small>
    </article>

    <article class="metric-card">
      <span class="metric-label">Ticket Médio</span>
      <strong class="metric-value">${formatCurrency(summary.averageTicket)}</strong>
      <small class="metric-meta">Valor médio por compra concluída</small>
    </article>

    <article class="metric-card">
      <span class="metric-label">Clientes Únicos</span>
      <strong class="metric-value">${summary.totalCustomers}</strong>
      <small class="metric-meta">Quantidade distinta por e-mail</small>
    </article>
  `;
}