// Utility functions for exporting data

/**
 * Export transactions as CSV
 * @param {string} type - Filter by type (expense/income/all)
 * @param {string} category - Filter by category
 * @param {string} startDate - Filter from date
 * @param {string} endDate - Filter to date
 */
export const exportTransactionsCSV = (type, category, startDate, endDate) => {
  let url = 'http://localhost:5000/api/expenses/export/csv';
  
  // Build query parameters
  const params = [];
  if (type) params.push(`type=${type}`);
  if (category) params.push(`category=${category}`);
  if (startDate) params.push(`startDate=${startDate}`);
  if (endDate) params.push(`endDate=${endDate}`);
  
  if (params.length > 0) {
    url += '?' + params.join('&');
  }
  
  // Create a temporary link and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = 'transactions.csv';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};