import { http } from "./config";

export default {
  listar: () => {
    return http.get("alugueis");
  },
  salvar: (aluguel) => {
    return http.post("alugueis", aluguel);
  },
  atualizar: (aluguel) => {
    return http.put("alugueis/" + aluguel.id, aluguel);
  },
  excluir: (aluguel) => {
    return http.delete("alugueis/" + aluguel.id);
  },
};
