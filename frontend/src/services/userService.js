import axios from "axios";

const userService = {
  findId: (data) => axios.post("/api/auth/find-id", data),
  resetPassword: (data) => axios.post("/api/auth/password/reset", data),
};

export default userService;
