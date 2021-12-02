const axios = require('axios');
const axiosRetry = require('axios-retry');

const api = axios.create({ baseURL: 'http://kaldir.vc.in.tum.de:8080' });
axiosRetry(api, { retries: 100, retryDelay: axiosRetry.exponentialDelay });

module.exports = api;
