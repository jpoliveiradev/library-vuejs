import { http } from "./config";

export default {
  listar: () => {
    return http.get("livros");
  },
  listarMaisAlugados: () => {
    return http.get("livros/maisAlugados");
  },
  listarLivrosDisp: () => {
    return http.get("livros/livrosDisp");
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
