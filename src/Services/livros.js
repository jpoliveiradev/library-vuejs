import { http } from "./config";

export default {
  listar: () => {
    return http.get("livros");
  },
  salvar: (livro) => {
    return http.post("livros", livro);
  },
  atualizar: (livro) => {
    return http.put("livros/" + livro.id, livro);
  },
  excluir: (livro) => {
    return http.delete("livros/" +livro.id)
  }
};
