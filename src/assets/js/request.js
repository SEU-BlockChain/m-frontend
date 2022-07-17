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
  error => {
    if(error.response.status !== 404){
      console.log(1);
    }else {
      Promise.error(error)

    }
  }
)

export default {
  api,
  axios
}