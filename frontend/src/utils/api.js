// api.js - API service with authentication
const API_BASE_URL = 'http://localhost:5000/api';

// Function to get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Generic API request function that includes auth token
const apiRequest = async (endpoint, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add authorization header if token exists
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // If response is 401 (unauthorized), remove token and redirect (handled by context)
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return null;
    }
    
    return response;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  logout: async () => {
    const response = await apiRequest('/auth/logout', {
      method: 'POST',
    });
    return response.json();
  },

  getMe: async () => {
    const response = await apiRequest('/auth/me');
    if (response) {
      return response.json();
    }
    return null;
  },
};

// Expense API functions
export const expenseAPI = {
  getExpenses: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await apiRequest(`/expenses${queryParams ? `?${queryParams}` : ''}`);
    if (response) {
      return response.json();
    }
    return null;
  },

  getExpense: async (id) => {
    const response = await apiRequest(`/expenses/${id}`);
    if (response) {
      return response.json();
    }
    return null;
  },

  createExpense: async (expenseData) => {
    const formData = new FormData();
    
    // Add all expense data to FormData
    Object.keys(expenseData).forEach(key => {
      if (expenseData[key] !== undefined && expenseData[key] !== null) {
        formData.append(key, expenseData[key]);
      }
    });

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: {
        // For multipart form data, don't set Content-Type header - let browser set it with boundary
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return null;
    }

    return response.json();
  },

  updateExpense: async (id, expenseData) => {
    const formData = new FormData();
    
    // Add all expense data to FormData
    Object.keys(expenseData).forEach(key => {
      if (expenseData[key] !== undefined && expenseData[key] !== null) {
        formData.append(key, expenseData[key]);
      }
    });

    const token = getAuthToken();
    const response = await fetch(`${API_BASE_URL}/expenses/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return null;
    }

    return response.json();
  },

  deleteExpense: async (id) => {
    const response = await apiRequest(`/expenses/${id}`, {
      method: 'DELETE',
    });
    if (response) {
      return response.json();
    }
    return null;
  },

  getExpensesByType: async (type) => {
    const response = await apiRequest(`/expenses/type/${type}`);
    if (response) {
      return response.json();
    }
    return null;
  },
};

// Budget API functions
export const budgetAPI = {
  getBudgets: async () => {
    const response = await apiRequest('/budgets');
    if (response) {
      return response.json();
    }
    return null;
  },

  getBudget: async (id) => {
    const response = await apiRequest(`/budgets/${id}`);
    if (response) {
      return response.json();
    }
    return null;
  },

  createBudget: async (budgetData) => {
    const response = await apiRequest('/budgets', {
      method: 'POST',
      body: JSON.stringify(budgetData),
    });
    if (response) {
      return response.json();
    }
    return null;
  },

  updateBudget: async (id, budgetData) => {
    const response = await apiRequest(`/budgets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(budgetData),
    });
    if (response) {
      return response.json();
    }
    return null;
  },

  deleteBudget: async (id) => {
    const response = await apiRequest(`/budgets/${id}`, {
      method: 'DELETE',
    });
    if (response) {
      return response.json();
    }
    return null;
  },

  getBudgetSummary: async (category) => {
    const response = await apiRequest(`/budgets/summary/${category}`);
    if (response) {
      return response.json();
    }
    return null;
  },
};

// Recurring API functions
export const recurringAPI = {
  getRecurring: async (pattern = null) => {
    const endpoint = pattern ? `/recurring/${pattern}` : '/recurring';
    const response = await apiRequest(endpoint);
    if (response) {
      return response.json();
    }
    return null;
  },

  createRecurring: async (recurringData) => {
    const response = await apiRequest('/recurring', {
      method: 'POST',
      body: JSON.stringify(recurringData),
    });
    if (response) {
      return response.json();
    }
    return null;
  },

  updateRecurring: async (id, recurringData) => {
    const response = await apiRequest(`/recurring/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recurringData),
    });
    if (response) {
      return response.json();
    }
    return null;
  },

  deleteRecurring: async (id) => {
    const response = await apiRequest(`/recurring/${id}`, {
      method: 'DELETE',
    });
    if (response) {
      return response.json();
    }
    return null;
  },
};

// Export CSV function
export const exportCSV = async (type = null, category = null, startDate = null, endDate = null) => {
  const params = new URLSearchParams();
  if (type) params.append('type', type);
  if (category) params.append('category', category);
  if (startDate) params.append('startDate', startDate);
  if (endDate) params.append('endDate', endDate);

  const token = getAuthToken();
  const url = `${API_BASE_URL}/expenses/export/csv?${params.toString()}`;

  // Create a temporary link to trigger the download
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('Authorization', `Bearer ${token}`);
  link.setAttribute('target', '_blank');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};