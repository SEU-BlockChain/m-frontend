import {api_url} from "./settings";
import axios from "axios";

let api = axios.create({
  baseURL: api_url,
  timeout: 5000,
})


api.interceptors.request.use(
  config => {
    const token = document.cookie.match(/token=(.*?)(;|$)/)
    token && (config.headers.Authorization = token[1]);
    return config;
  },
  error => Promise.error(error)
)

export default {
  api,
  axios
}