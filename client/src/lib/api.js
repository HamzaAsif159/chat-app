import axios from "axios";
import { HOST } from "../utils.js/constant.js";

export const api = axios.create({
  baseURL: HOST,
  withCredentials: true,
});
