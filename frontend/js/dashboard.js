// dashboard.js

// Wait until the DOM is fully loaded before fetching the dashboard totals
document.addEventListener('DOMContentLoaded', () => {
  fetchSummary();
});

// Function to fetch income, expenses, and balance from the backend
function fetchSummary() {
  fetch('http://localhost:5000/api/dashboard/totals') // ✅ Correct API route
    .then(response => response.json())
    .then(data => {
      // Update DOM elements with the fetched totals
      document.getElementById('total-income').textContent = `₹${data.totalIncome}`;
      document.getElementById('total-expenses').textContent = `₹${data.totalExpenses}`;
      document.getElementById('balance').textContent = `₹${data.balance}`;
    })
    .catch(error => {
      console.error('Error fetching summary:', error);
    });
}
