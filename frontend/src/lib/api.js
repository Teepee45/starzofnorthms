import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({ baseURL: API });

export const getAdminToken = () => localStorage.getItem("starz_admin_token") || "";
export const setAdminToken = (t) => localStorage.setItem("starz_admin_token", t);
export const clearAdminToken = () => localStorage.removeItem("starz_admin_token");
