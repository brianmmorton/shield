import axios from 'axios'
import qs from 'qs'

const methods = ['get', 'post', 'put', 'patch', 'delete']

class ApiClient {
  constructor () {
    this.instance = this.initInstance();
    methods.forEach(method => (this[method] = this.instance[method]));
  }

  initInstance () {
    return axios.create({
      timeout: 8000,
      headers: {
        Authorization: `Bearer ${this.token}`
      },
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'brackets' }),
    });
  }

  get token () {
    return localStorage.getItem('json-token') || null;
  }

  set token (token) {
    return localStorage.setItem('json-token', token);
  }
}

export default new ApiClient()
