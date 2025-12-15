import axios from "axios";

const userService = {
  findId: (data) => axios.post(`/users/find-id`, data),
  resetPassword: (data) => axios.post(`/users/password-reset`, data),
};

export default userService;