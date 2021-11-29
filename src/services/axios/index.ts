import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.API_KEY) {
  throw Error("API_KEY in .env file should be set.");
}

if (!process.env.BASE_URL) {
  throw Error("BASE_URL in .env file should be set.");
}

const API_KEY = process.env.API_KEY;

const axiosApi = axios.create({
  baseURL: String(process.env.BASE_URL),
  headers: {
    ["x-api-key"]: String(API_KEY),
  },
});

export default axiosApi;
