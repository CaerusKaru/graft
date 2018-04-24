import {cacheAdapterEnhancer} from 'axios-extensions';
import axios from 'axios';

const API_URL = `https://www.opensecrets.org/api`;
const API_KEY = 'eeda5650183bdcdb9892df240ee97d6d';
export const API_ADD = `/?output=json&apikey=${API_KEY}&method=`;

export const http = axios.create({
  baseURL: API_URL,
  // cache will be enabled by default
  adapter: cacheAdapterEnhancer(axios.defaults.adapter)
});
