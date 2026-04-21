function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function getStatusLabel(status) {
  const labels = {
    pending: "Pendente",
    paid: "Pago",
    shipped: "Enviado",
    delivered: "Entregue",
    canceled: "Cancelado",
  };

  return labels[status] || status;
}

export function renderRecentOrders(orders = []) {
  const tbody = document.getElementById("adminRecentOrdersTableBody");

  if (!orders.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" class="table-empty">Nenhum pedido encontrado.</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = orders
    .map(
      (order) => `
        <tr>
          <td>#${order.id}</td>
          <td>
            <strong>${order.customerName || "-"}</strong><br>
            <small>${order.customerEmail || "-"}</small>
          </td>
          <td>${formatCurrency(order.total)}</td>
          <td>
            <span class="status-badge status-${order.status}">
              ${getStatusLabel(order.status)}
            </span>
          </td>
          <td>${formatDate(order.createdAt)}</td>
        </tr>
      `
    )
    .join("");
}