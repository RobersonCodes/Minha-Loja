import { login } from "../services/auth.service.js";
import { createProduct, getProducts } from "../services/product.service.js";
import { getOrders, updateOrderStatus } from "../services/order.service.js";
import { uploadProductImage } from "../services/upload.service.js";

import { isAuthenticated, removeToken } from "../utils/storage.js";
import { formatPrice } from "../utils/format.js";
import { showToast } from "../utils/toast.js";

import { fetchAdminMetrics } from "../api/admin.api.js";

import {
  createRevenueLineChart,
  createStatusBarChart,
  createCategoryDonutChart
} from "../services/chart.service.js";

/* ELEMENTOS */

const loginForm = document.getElementById("loginForm");
const productForm = document.getElementById("productForm");

const dashboard = document.getElementById("dashboard");
const loginBox = document.getElementById("loginBox");

const productsContainer = document.getElementById("productsContainer");
const ordersContainer = document.getElementById("ordersContainer");

const totalOrdersBadge = document.getElementById("totalOrdersBadge");
const totalProductsBadge = document.getElementById("totalProductsBadge");

const metricRevenue = document.getElementById("metricRevenue");
const metricOrders = document.getElementById("metricOrders");
const metricTicket = document.getElementById("metricTicket");
const metricCustomers = document.getElementById("metricCustomers");
const metricsContainer = document.getElementById("metricsContainer");

const imageFileInput = document.getElementById("imageFile");
const imagePreview = document.getElementById("imagePreview");
const imagePreviewName = document.getElementById("imagePreviewName");
const imagePreviewInfo = document.getElementById("imagePreviewInfo");
const submitProductButton = document.getElementById("submitProductButton");

const FALLBACK_PRODUCT_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='220'><rect width='100%25' height='100%25' fill='%23f3f4f6'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23667085' font-size='20'>Minha Loja</text></svg>";

const FALLBACK_ORDER_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'><rect width='100%25' height='100%25' fill='%23f3f4f6'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23667085' font-size='12'>Produto</text></svg>";

const FALLBACK_PREVIEW_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='280'><rect width='100%25' height='100%25' fill='%23f3f4f6'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23667085' font-size='22'>Preview da Imagem</text></svg>";

let revenueChartInstance = null;
let statusChartInstance = null;
let categoryChartInstance = null;

/* =========================
HELPERS
========================= */

function showDashboard() {
  if (loginBox) loginBox.style.display = "none";
  if (dashboard) dashboard.style.display = "block";
}

function showLogin() {
  if (loginBox) loginBox.style.display = "block";
  if (dashboard) dashboard.style.display = "none";
}

function formatDate(dateValue) {
  if (!dateValue) return "Data indisponível";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleString("pt-BR");
}

function getStatusLabel(status) {
  const map = {
    pending: "Pendente",
    paid: "Pago",
    shipped: "Enviado",
    delivered: "Entregue",
    canceled: "Cancelado"
  };

  return map[status] || status;
}

function getStatusBadgeClass(status) {
  const map = {
    pending: "admin-status-badge--pending",
    paid: "admin-status-badge--paid",
    shipped: "admin-status-badge--shipped",
    delivered: "admin-status-badge--delivered",
    canceled: "admin-status-badge--canceled"
  };

  return map[status] || "admin-status-badge--pending";
}

function getProductTypeBadge(product) {
  if (Number(product?.is_affiliate || 0) === 1) {
    return `<span class="admin-product-card__tag admin-product-card__tag--affiliate">Afiliado</span>`;
  }

  return `<span class="admin-product-card__tag">Interno</span>`;
}

/* =========================
PREVIEW IMAGEM
========================= */

function resetImagePreview() {
  if (imagePreview) imagePreview.src = FALLBACK_PREVIEW_IMAGE;
  if (imagePreviewName) imagePreviewName.textContent = "Nenhum arquivo selecionado";

  if (imagePreviewInfo) {
    imagePreviewInfo.textContent = "Escolha uma imagem JPG, PNG ou WEBP de até 5MB.";
  }
}

function updateImagePreview(file) {
  if (!file) {
    resetImagePreview();
    return;
  }

  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    showToast({
      type: "error",
      title: "Formato inválido",
      message: "Envie JPG, JPEG, PNG ou WEBP."
    });

    if (imageFileInput) imageFileInput.value = "";
    resetImagePreview();
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    showToast({
      type: "error",
      title: "Arquivo muito grande",
      message: "A imagem deve ter no máximo 5MB."
    });

    if (imageFileInput) imageFileInput.value = "";
    resetImagePreview();
    return;
  }

  const reader = new FileReader();

  reader.onload = (event) => {
    if (imagePreview) imagePreview.src = event.target.result;
    if (imagePreviewName) imagePreviewName.textContent = file.name;

    if (imagePreviewInfo) {
      imagePreviewInfo.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB`;
    }
  };

  reader.readAsDataURL(file);
}

/* =========================
PRODUTOS
========================= */

function renderProducts(products) {
  if (!productsContainer) return;

  productsContainer.innerHTML = "";

  if (!products.length) {
    productsContainer.innerHTML = `
      <div class="admin-empty-state">
        <h3>Nenhum produto cadastrado</h3>
        <p>Cadastre produtos para popular sua loja e fortalecer o portfólio.</p>
      </div>
    `;
    return;
  }

  productsContainer.innerHTML = products
    .map(
      (product) => `
        <article class="admin-product-card">
          <div class="admin-product-card__image-wrapper">
            <img
              class="admin-product-card__image"
              src="${product.image || FALLBACK_PRODUCT_IMAGE}"
              alt="${product.name}"
              onerror="this.onerror=null;this.src='${FALLBACK_PRODUCT_IMAGE}'"
            >
          </div>

          <div class="admin-product-card__content">
            <div class="admin-product-card__top">
              <span class="admin-product-card__category">${product.category || "Sem categoria"}</span>
              ${getProductTypeBadge(product)}
            </div>

            <h3 class="admin-product-card__title">${product.name}</h3>

            <p class="admin-product-card__price">${formatPrice(product.price)}</p>

            ${
              Number(product?.is_affiliate || 0) === 1 && product?.affiliate_url
                ? `<a
                    class="admin-product-card__link"
                    href="${product.affiliate_url}"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir link afiliado
                  </a>`
                : ""
            }
          </div>
        </article>
      `
    )
    .join("");
}

async function loadProducts() {
  const products = await getProducts();
  const normalizedProducts = Array.isArray(products?.data) ? products.data : products;

  renderProducts(normalizedProducts || []);

  if (totalProductsBadge) {
    totalProductsBadge.textContent = String((normalizedProducts || []).length);
  }
}

/* =========================
PEDIDOS
========================= */

function createOrderItemsMarkup(items = []) {
  if (!items.length) {
    return `
      <div class="admin-order-items-empty">
        Nenhum item encontrado para este pedido.
      </div>
    `;
  }

  return `
    <div class="admin-order-items">
      ${items
        .map(
          (item) => `
            <div class="admin-order-item">
              <div class="admin-order-item__left">
                <img
                  class="admin-order-item__image"
                  src="${item.product_image || FALLBACK_ORDER_IMAGE}"
                  alt="${item.product_name}"
                  onerror="this.onerror=null;this.src='${FALLBACK_ORDER_IMAGE}'"
                >
              </div>

              <div class="admin-order-item__content">
                <h4>${item.product_name}</h4>
                <p>Categoria: ${item.product_category || "Sem categoria"}</p>
                <p>Quantidade: <strong>${item.quantity}</strong></p>
                <p>Unitário: <strong>${formatPrice(item.unit_price)}</strong></p>
                <p>Subtotal: <strong>${formatPrice(item.line_total)}</strong></p>
              </div>
            </div>
          `
        )
        .join("")}
    </div>
  `;
}

function bindOrderStatusActions() {
  const buttons = document.querySelectorAll("[data-update-order-status]");

  buttons.forEach((button) => {
    button.addEventListener("click", async () => {
      const orderId = button.getAttribute("data-order-id");
      const select = document.querySelector(`[data-order-status-select="${orderId}"]`);

      if (!select) return;

      const status = select.value;

      try {
        button.disabled = true;
        button.textContent = "Salvando...";

        await updateOrderStatus(orderId, status);
        await loadOrders();
        await loadMetrics();

        showToast({
          type: "success",
          title: "Pedido atualizado",
          message: "Status do pedido atualizado com sucesso."
        });
      } catch (error) {
        showToast({
          type: "error",
          title: "Erro ao atualizar",
          message: error.message || "Erro ao atualizar status."
        });
      } finally {
        button.disabled = false;
        button.textContent = "Salvar status";
      }
    });
  });
}

function renderOrders(orders) {
  if (!ordersContainer) return;

  ordersContainer.innerHTML = "";

  if (!orders.length) {
    ordersContainer.innerHTML = `
      <div class="admin-empty-state">
        <h3>Nenhum pedido encontrado</h3>
        <p>Os pedidos realizados no checkout aparecerão aqui.</p>
      </div>
    `;
    return;
  }

  ordersContainer.innerHTML = orders
    .map(
      (order) => `
        <article class="admin-order-card">
          <div class="admin-order-card__header">
            <div>
              <span class="admin-order-card__label">Pedido #${order.id}</span>
              <h3 class="admin-order-card__title">${order.customer_name}</h3>
              <p class="admin-order-card__subtitle">${order.customer_email}</p>
            </div>

            <div class="admin-order-card__status">
              <span class="admin-status-badge ${getStatusBadgeClass(order.status || "pending")}">
                ${getStatusLabel(order.status || "pending")}
              </span>
            </div>
          </div>

          <div class="admin-order-card__grid">
            <div class="admin-order-info">
              <span class="admin-order-info__label">Telefone</span>
              <strong>${order.customer_phone}</strong>
            </div>

            <div class="admin-order-info">
              <span class="admin-order-info__label">CPF</span>
              <strong>${order.customer_cpf}</strong>
            </div>

            <div class="admin-order-info">
              <span class="admin-order-info__label">Pagamento</span>
              <strong>${order.payment_method}</strong>
            </div>

            <div class="admin-order-info">
              <span class="admin-order-info__label">Itens</span>
              <strong>${order.items_count} item(s)</strong>
            </div>

            <div class="admin-order-info">
              <span class="admin-order-info__label">Subtotal</span>
              <strong>${formatPrice(order.subtotal)}</strong>
            </div>

            <div class="admin-order-info">
              <span class="admin-order-info__label">Frete</span>
              <strong>${formatPrice(order.freight)}</strong>
            </div>

            <div class="admin-order-info">
              <span class="admin-order-info__label">Total</span>
              <strong class="admin-order-info__total">${formatPrice(order.total)}</strong>
            </div>

            <div class="admin-order-info">
              <span class="admin-order-info__label">Data</span>
              <strong>${formatDate(order.created_at)}</strong>
            </div>
          </div>

          <div class="admin-order-address">
            <span class="admin-order-info__label">Entrega</span>
            <p>
              ${order.street}, ${order.number} - ${order.neighborhood}, ${order.city}/${order.state}
              <br>
              CEP: ${order.zip_code}
            </p>
          </div>

          <div class="admin-order-status-editor">
            <div class="form-group">
              <label>Status do pedido</label>
              <select class="admin-order-status-select" data-order-status-select="${order.id}">
                <option value="pending" ${order.status === "pending" ? "selected" : ""}>Pendente</option>
                <option value="paid" ${order.status === "paid" ? "selected" : ""}>Pago</option>
                <option value="shipped" ${order.status === "shipped" ? "selected" : ""}>Enviado</option>
                <option value="delivered" ${order.status === "delivered" ? "selected" : ""}>Entregue</option>
                <option value="canceled" ${order.status === "canceled" ? "selected" : ""}>Cancelado</option>
              </select>
            </div>

            <button
              class="btn btn--primary"
              type="button"
              data-update-order-status
              data-order-id="${order.id}"
            >
              Salvar status
            </button>
          </div>

          <div class="admin-order-details">
            <h4>Itens do pedido</h4>
            ${createOrderItemsMarkup(order.items)}
          </div>
        </article>
      `
    )
    .join("");

  bindOrderStatusActions();
}

async function loadOrders() {
  const response = await getOrders();
  const orders = Array.isArray(response?.data) ? response.data : response;

  renderOrders(orders || []);

  if (totalOrdersBadge) {
    totalOrdersBadge.textContent = String((orders || []).length);
  }
}

/* =========================
MÉTRICAS
========================= */

function renderMetricsCards(summary = {}) {
  if (metricRevenue) metricRevenue.textContent = formatPrice(summary.totalRevenue || 0);
  if (metricOrders) metricOrders.textContent = String(summary.totalOrders || 0);
  if (metricTicket) metricTicket.textContent = formatPrice(summary.averageTicket || 0);
  if (metricCustomers) metricCustomers.textContent = String(summary.totalCustomers || 0);
}

function renderMetricsCharts(data) {
  revenueChartInstance = createRevenueLineChart(
    "revenueChart",
    (data.salesByDay || []).map((item) => item.date),
    (data.salesByDay || []).map((item) => item.revenue),
    revenueChartInstance
  );

  statusChartInstance = createStatusBarChart(
    "statusChart",
    Object.keys(data.ordersByStatus || {}),
    Object.values(data.ordersByStatus || {}),
    statusChartInstance
  );

  categoryChartInstance = createCategoryDonutChart(
    "categoryChart",
    (data.salesByCategory || []).map((item) => item.category),
    (data.salesByCategory || []).map((item) => item.revenue),
    categoryChartInstance
  );
}

async function loadMetrics() {
  if (!metricsContainer) return;

  try {
    const data = await fetchAdminMetrics();

    renderMetricsCards(data.summary || {});
    renderMetricsCharts(data);
  } catch (error) {
    console.error("Erro ao carregar métricas:", error);

    metricsContainer.innerHTML = `
      <div class="admin-empty-state">
        <h3>Não foi possível carregar as métricas</h3>
        <p>${error.message || "Erro ao buscar métricas administrativas."}</p>
      </div>
    `;
  }
}

/* =========================
DASHBOARD
========================= */

async function loadDashboardData() {
  await Promise.all([loadProducts(), loadOrders(), loadMetrics()]);
}

/* =========================
LOGIN
========================= */

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email")?.value || "";
  const password = document.getElementById("password")?.value || "";

  try {
    await login(email, password);

    showDashboard();
    await loadDashboardData();

    showToast({
      type: "success",
      title: "Login realizado",
      message: "Bem-vindo ao painel administrativo."
    });
  } catch (error) {
    showToast({
      type: "error",
      title: "Erro no login",
      message: error.message || "Erro ao fazer login."
    });
  }
});

/* =========================
UPLOAD
========================= */

imageFileInput?.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  updateImagePreview(file);
});

/* =========================
CRIAR PRODUTO
========================= */

productForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nameInput = document.getElementById("name");
  const priceInput = document.getElementById("price");
  const categoryInput = document.getElementById("category");
  const descriptionInput = document.getElementById("description");

  const oldPriceInput = document.getElementById("old_price");
  const stockInput = document.getElementById("stock");
  const ratingInput = document.getElementById("rating");
  const reviewsCountInput = document.getElementById("reviews_count");
  const featuredInput = document.getElementById("featured");
  const badgeInput = document.getElementById("badge");

  const affiliateUrlInput = document.getElementById("affiliate_url");
  const isAffiliateInput = document.getElementById("is_affiliate");

  try {
    if (submitProductButton) {
      submitProductButton.disabled = true;
      submitProductButton.textContent = "Enviando...";
    }

    let imageUrl = "";

    if (imageFileInput?.files?.length) {
      const uploadedImage = await uploadProductImage(imageFileInput.files[0]);
      imageUrl = uploadedImage.url;
    }

    const product = {
      name: nameInput?.value || "",
      price: Number(priceInput?.value || 0),
      category: categoryInput?.value || "",
      image: imageUrl,
      description: descriptionInput?.value || "",

      old_price: oldPriceInput?.value ? Number(oldPriceInput.value) : null,
      stock: stockInput?.value ? Number(stockInput.value) : 10,
      rating: ratingInput?.value ? Number(ratingInput.value) : 4.5,
      reviews_count: reviewsCountInput?.value ? Number(reviewsCountInput.value) : 0,

      featured: featuredInput?.checked ? 1 : 0,
      badge: badgeInput?.value || "",

      affiliate_url: affiliateUrlInput?.value || "",
      is_affiliate: isAffiliateInput?.checked ? 1 : 0
    };

    await createProduct(product);

    showToast({
      type: "success",
      title: "Produto criado",
      message: "Produto cadastrado com sucesso."
    });

    productForm.reset();
    resetImagePreview();

    await loadProducts();
    await loadMetrics();
  } catch (error) {
    showToast({
      type: "error",
      title: "Erro ao criar produto",
      message: error.message || "Erro ao criar produto."
    });
  } finally {
    if (submitProductButton) {
      submitProductButton.disabled = false;
      submitProductButton.textContent = "Cadastrar Produto";
    }
  }
});

/* =========================
LOGOUT
========================= */

document.getElementById("logoutBtn")?.addEventListener("click", () => {
  removeToken();
  showLogin();

  showToast({
    type: "info",
    title: "Sessão encerrada",
    message: "Você saiu do painel administrativo."
  });
});

/* =========================
INIT
========================= */

if (isAuthenticated()) {
  showDashboard();

  loadDashboardData().catch((error) => {
    console.error("Erro ao carregar dashboard:", error);

    showToast({
      type: "error",
      title: "Erro ao carregar painel",
      message: "Não foi possível carregar os dados do dashboard."
    });
  });
} else {
  showLogin();
  resetImagePreview();
}