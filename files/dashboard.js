// Empty state setup without sample data
let orders = JSON.parse(localStorage.getItem('caravan_admin_orders')) || [];
let salesChartInstance = null;
let statusChartInstance = null;

// Synchronize state with LocalStorage and re-render the view
function syncState() {
  localStorage.setItem('caravan_admin_orders', JSON.stringify(orders));
  renderTable();
  renderMetrics();
  renderCharts();
}

// Render dynamic table rows
function renderTable() {
  const tbody = document.getElementById('ordersTableBody');
  tbody.innerHTML = '';

  if (orders.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-cell">No orders available. Click "New Order" to add one.</td></tr>`;
    return;
  }

  orders.forEach((order, index) => {
    let badgeClass = 'badge-pending';
    if (order.status === 'Delivered') badgeClass = 'badge-delivered';
    if (order.status === 'Failed') badgeClass = 'badge-failed';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td><strong>${order.id}</strong></td>
      <td>${order.customer}</td>
      <td>${order.items}</td>
      <td>₱${order.amount.toFixed(2)}</td>
      <td><span class="badge ${badgeClass}" onclick="toggleStatus(${index})">${order.status}</span></td>
      <td><button class="btn-delete" onclick="deleteOrder(${index})"><i class="fa-solid fa-trash"></i></button></td>
    `;
    tbody.appendChild(row);
  });
}

// Calculate summary metrics
function renderMetrics() {
  const sales = orders.filter(o => o.status === 'Delivered').reduce((sum, o) => sum + o.amount, 0);
  const pending = orders.filter(o => o.status === 'Pending').length;
  const failed = orders.filter(o => o.status === 'Failed').length;

  document.getElementById('totalSales').innerText = `₱${sales.toFixed(2)}`;
  document.getElementById('totalOrders').innerText = orders.length;
  document.getElementById('pendingOrders').innerText = pending;
  document.getElementById('failedOrders').innerText = failed;
}

// Cycle between statuses
function toggleStatus(index) {
  const states = ['Pending', 'Delivered', 'Failed'];
  const currentIdx = states.indexOf(orders[index].status);
  orders[index].status = states[(currentIdx + 1) % states.length];
  syncState();
}

// Remove an entry
function deleteOrder(index) {
  orders.splice(index, 1);
  syncState();
}

// Handle Form Modal Submission
function addNewOrder() {
  const name = document.getElementById('custName').value;
  const items = document.getElementById('orderItems').value;
  const amount = parseFloat(document.getElementById('orderAmount').value);
  const status = document.getElementById('orderStatus').value;

  if (!name || !items || isNaN(amount)) return alert('Please enter valid order details');

  const id = `#${Math.floor(8000 + Math.random() * 1000)}`;
  orders.push({ id, customer: name, items, amount, status });
  
  toggleModal(false);
  syncState();

  document.getElementById('custName').value = '';
  document.getElementById('orderItems').value = '';
  document.getElementById('orderAmount').value = '';
}

function toggleModal(show) {
  document.getElementById('orderModal').classList.toggle('active', show);
}

// Render dynamic charts via Chart.js
function renderCharts() {
  const ctxSales = document.getElementById('salesChart').getContext('2d');
  const ctxStatus = document.getElementById('statusChart').getContext('2d');

  if (salesChartInstance) salesChartInstance.destroy();
  if (statusChartInstance) statusChartInstance.destroy();

  salesChartInstance = new Chart(ctxSales, {
    type: 'bar',
    data: {
      labels: orders.map(o => o.id),
      datasets: [{
        label: 'Amount (₱)',
        data: orders.map(o => o.amount),
        backgroundColor: '#6F4E37'
      }]
    },
    options: { responsive: true }
  });

  const statusCounts = [
    orders.filter(o => o.status === 'Delivered').length,
    orders.filter(o => o.status === 'Pending').length,
    orders.filter(o => o.status === 'Failed').length
  ];

  statusChartInstance = new Chart(ctxStatus, {
    type: 'doughnut',
    data: {
      labels: ['Delivered', 'Pending', 'Failed'],
      datasets: [{
        data: statusCounts,
        backgroundColor: ['#28a745', '#ffc107', '#dc3545']
      }]
    },
    options: { responsive: true }
  });
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  syncState();
});