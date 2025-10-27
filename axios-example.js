// Axios Example - Making HTTP Requests

// First, we need to import axios
import axios from 'axios';

// Example 1: Basic GET Request
console.log('Example 1: Basic GET Request');
axios.get('https://jsonplaceholder.typicode.com/posts/1')
  .then(function (response) {
    console.log('Response Status:', response.status);
    console.log('Post Title:', response.data.title);
  })
  .catch(function (error) {
    console.error('Error:', error.message);
  })
  .finally(function () {
    console.log('GET request completed');
  });

// Example 2: POST Request with Data
console.log('\nExample 2: POST Request');
axios.post('https://jsonplaceholder.typicode.com/posts', {
    title: 'Axios Example Post',
    body: 'This is a sample post created with Axios',
    userId: 1
  })
  .then(function (response) {
    console.log('Created Post ID:', response.data.id);
    console.log('Response Status:', response.status);
  })
  .catch(function (error) {
    console.error('Error:', error.message);
  });

// Example 3: Using async/await syntax (modern approach)
console.log('\nExample 3: Async/Await Syntax');
async function fetchUserData() {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users/1');
    console.log('User Name:', response.data.name);
    console.log('User Email:', response.data.email);
  } catch (error) {
    console.error('Error fetching user data:', error.message);
  }
}

fetchUserData();

// Example 4: Creating an Axios instance with default configuration
console.log('\nExample 4: Axios Instance with Default Configuration');
const apiClient = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Using the instance
apiClient.get('/todos/1')
  .then(function (response) {
    console.log('Todo Title:', response.data.title);
  })
  .catch(function (error) {
    console.error('Error fetching todo:', error.message);
  });

// Example 5: Adding request and response interceptors
console.log('\nExample 5: Using Interceptors');

// Add a request interceptor
apiClient.interceptors.request.use(
  function (config) {
    console.log('Request sent to:', config.url);
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
apiClient.interceptors.response.use(
  function (response) {
    console.log('Response received:', response.status);
    return response;
  },
  function (error) {
    console.error('Response error:', error.response?.status);
    return Promise.reject(error);
  }
);

// Make a request to see interceptors in action
apiClient.get('/posts/2')
  .then(function (response) {
    console.log('Post Title:', response.data.title);
  })
  .catch(function (error) {
    console.error('Error:', error.message);
  });