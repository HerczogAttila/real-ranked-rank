import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://api.backendless.com/5E2DD80B-40DD-EC59-FFD3-A40D85EC7000/41C857C8-8E57-F279-FF16-E57FEE4E1200/services/backend'
});

export default instance;
