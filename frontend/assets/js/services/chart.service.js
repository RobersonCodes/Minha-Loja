function destroyChart(chartInstance) {
  if (chartInstance && typeof chartInstance.destroy === "function") {
    chartInstance.destroy();
  }
}

function getCanvasContext(canvasId) {
  const canvas = document.getElementById(canvasId);

  if (!canvas) {
    return null;
  }

  return canvas.getContext("2d");
}

export function createRevenueLineChart(canvasId, labels = [], values = [], currentChart = null) {
  destroyChart(currentChart);

  const ctx = getCanvasContext(canvasId);

  if (!ctx) {
    return null;
  }

  return new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Faturamento",
          data: values,
          borderWidth: 3,
          fill: true,
          tension: 0.35
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

export function createStatusBarChart(canvasId, labels = [], values = [], currentChart = null) {
  destroyChart(currentChart);

  const ctx = getCanvasContext(canvasId);

  if (!ctx) {
    return null;
  }

  return new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Pedidos",
          data: values,
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}

export function createCategoryDonutChart(canvasId, labels = [], values = [], currentChart = null) {
  destroyChart(currentChart);

  const ctx = getCanvasContext(canvasId);

  if (!ctx) {
    return null;
  }

  return new Chart(ctx, {
    type: "doughnut",
    data: {
      labels,
      datasets: [
        {
          data: values
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  });
}