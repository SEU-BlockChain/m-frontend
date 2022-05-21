import {api_url} from "./settings";
import axios from "axios";

let api = axios.create({
  baseURL: api_url,
  timeout: 5000,
})


api.interceptors.request.use(
  config => {
    config.url = config.url.replace("http://chain", "")
    const token = window.localStorage.getItem("token")
    token && (config.headers.Authorization = token);
    return config;
  },
  error => Promise.error(error)
)

export default {
  api,
  axios
}