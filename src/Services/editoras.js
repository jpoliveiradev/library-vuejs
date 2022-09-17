import { http } from "./config";

export default {
  listar: () => {
    return http.get("editoras");
  },
  salvar: (editora) => {
    return http.post("editoras", editora);
  },
  atualizar: (editora) => {
    return http.put("editoras/" + editora.id, editora);
  },
  excluir: (editora) =>{
    return http.delete("editoras/" + editora.id);
    
  }
};
