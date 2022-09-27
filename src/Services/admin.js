import { http } from "./config";

export default {
  verificar: (admin) => {
    return http.get(`admins?userName=${admin.username}&password=${admin.password}`);
  },
  salvar: (admin) => {
    return http.post("admins", admin);
  },
  verificarEmail: (admin) => {
    return http.get("admins/alterarPassword/" + admin.email, admin);
  },
  atualizarPassword: (admin) => {
    return http.put("admins/" + admin.id, admin);
  },
};
