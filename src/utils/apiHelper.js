const BASE_URL = import.meta.env.VITE_BASE_URL; // Laravel API URL

// Fungsi untuk dapatkan header biasa
function getHeaders() {
  const headers = {
    'Content-Type': 'application/json'
    // ,
    // "ngrok-skip-browser-warning": "true"
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// Fungsi untuk handle response JSON dan ralat
async function handleResponse(response) {
  const data = await response.json();
  if (!response.ok) {
    // Baling ralat dengan mesej dari server
    const error = new Error(data.message || 'Ralat berlaku');
    error.status = response.status;
    error.errors = data.errors || null;
    throw error;
  }
  return data;
}

// GET
export async function get(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'GET',
    headers: getHeaders(), //ade token
  });
  return handleResponse(res);
}

// POST
export async function post(path, body) {

  if(body){
    body = JSON.stringify(body)
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: getHeaders(),
    body: body ,
  });
  return handleResponse(res);
}

// PUT
export async function put(path, body) {
  if (body) {
    body = JSON.stringify(body);
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: body,
  });
  return handleResponse(res);
}

// DELETE
export async function del(path) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  return handleResponse(res);
}

// Untuk upload file (multipart/form-data) - digunakan di edit profil
export async function postFormData(path, formData) {
  const headers = {
  };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers:headers,// jangan set Content-Type, browser akan set dengan boundary
    body: formData,
  });
  return handleResponse(res);
}