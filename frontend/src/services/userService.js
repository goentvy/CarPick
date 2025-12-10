import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const userService = {
  findId: (data) => axios.post(`${API_URL}/users/find-id`, data),
  resetPassword: (data) => axios.post(`${API_URL}/users/password-reset`, data),
};

export default userService;