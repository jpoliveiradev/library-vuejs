<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8">
        <v-card class="elevation-6 mt-15">
          <v-window v-model="step">
            <v-window-item :value="1">
              <v-row>
                <v-card-text class="mt-15 mb-16">
                  <h1 class="text-center">Faça Login na sua conta</h1>
                  <v-row align="center" justify="center">
                    <v-col cols="10" sm="6">
                      <v-form class="px-2" ref="form1" lazy-validation>
                        <v-text-field v-model="login.username" :rules="[rules.username]" label="Username" outlined dense color="#004D40" autocomplete="false" class="mt-16 mb-5" />
                        <v-text-field
                          :rules="[rules.password]"
                          v-model="login.password"
                          label="Password"
                          :append-icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showPassword1 ? 'text' : 'password'"
                          outlined
                          dense
                          color="#004D40"
                          autocomplete="false"
                          @click:append="showPassword1 = !showPassword1" />
                        <a id="mudarSenha" @click="step3Senha()">Esqueceu a senha?</a>
                        <v-btn style="border-radius: 8px" color="#004D40" dark block tile @click="verificarLogin()">Entrar</v-btn>
                      </v-form>
                      <v-card-text align="center" justify="center">
                        <span>Não tem uma conta ainda?</span>
                        <v-btn color="#004D40" small dark text @click="step2Cadastro()">Cadastrar</v-btn>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-row>
            </v-window-item>
            <v-window-item :value="2">
              <v-row>
                <v-card-text class="mt-15">
                  <h1 class="text-center">Cadastrar Administrador</h1>
                  <v-row align="center" justify="center">
                    <v-col cols="10" sm="8">
                      <v-form class="px-2" ref="form2" lazy-validation>
                        <v-text-field
                          v-model="admin.nomeAdmin"
                          :rules="[rules.required, rules.maxValue, rules.minValue, rules.campoInvalido, rules.caractereInvalido]"
                          label="Nome"
                          outlined
                          dense
                          color="#004D40"
                          autocomplete="false"
                          class="mt-10" />
                        <v-text-field v-model="admin.email" :rules="[rules.required, rules.email]" label="Email" outlined dense color="#004D40" autocomplete="false" />
                        <v-text-field v-model="admin.endereco" :rules="[rules.required, rules.maxValue, rules.minValue]" label="Endereço" outlined dense color="#004D40" autocomplete="false" />
                        <v-text-field v-model="admin.userName" :rules="[rules.required, rules.maxValue, rules.minValue]" label="Username" outlined dense color="#004D40" autocomplete="false" />
                        <v-text-field
                          :rules="[rules.required, rules.minPassword]"
                          v-model="admin.password"
                          label="Senha"
                          :append-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showPassword2 ? 'text' : 'password'"
                          outlined
                          dense
                          color="#004D40"
                          autocomplete="false"
                          @click:append="showPassword2 = !showPassword2" />
                        <v-text-field
                          :rules="[this.admin.password === this.confirmPassword || 'A confirmação da senha não corresponde.']"
                          v-model="confirmPassword"
                          label="Confirme a Senha"
                          :append-icon="showPassword2 ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showPassword2 ? 'text' : 'password'"
                          outlined
                          dense
                          color="#004D40"
                          autocomplete="false"
                          class="mb-2"
                          @click:append="showPassword2 = !showPassword2" />
                      </v-form>
                      <v-btn style="border-radius: 8px" color="#004D40" dark block tile @click="salvar()">Cadastrar</v-btn>
                      <v-card-text align="center" justify="center">
                        <span>Já tem uma conta?</span>
                        <v-btn color="#004D40" small dark text @click="step1Login()">Login</v-btn>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-row>
            </v-window-item>
            <v-window-item :value="3">
              <v-row>
                <v-card-text class="mt-15 mb-16">
                  <h1 class="text-center">Recuperar senha</h1>
                  <v-row align="center" justify="center">
                    <v-col cols="10" sm="6">
                      <v-form class="px-2" ref="form3" lazy-validation>
                        <v-text-field v-model="mudarPassword.username" :rules="[rules.username]" label="Username" outlined dense color="#004D40" autocomplete="false" class="mt-16 mb-3" />
                        <v-text-field v-model="mudarPassword.email" :rules="[rules.required, rules.email]" label="Email" outlined dense color="#004D40" autocomplete="false" class="mb-3" />
                        <v-text-field
                          :rules="[rules.minPassword]"
                          v-model="mudarPassword.password"
                          label="Nova Senha"
                          :append-icon="showPassword1 ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showPassword3 ? 'text' : 'password'"
                          outlined
                          dense
                          color="#004D40"
                          autocomplete="false"
                          @click:append="showPassword3 = !showPassword3" />
                        <v-text-field
                          :rules="[this.mudarPassword.password === this.confirmPassword || 'A confirmação da senha não corresponde.']"
                          v-model="confirmPassword"
                          label="Confirme a Senha"
                          :append-icon="showPassword3 ? 'mdi-eye' : 'mdi-eye-off'"
                          :type="showPassword3 ? 'text' : 'password'"
                          outlined
                          dense
                          color="#004D40"
                          autocomplete="false"
                          class="mb-2"
                          @click:append="showPassword3 = !showPassword3" />
                        <v-btn style="border-radius: 8px" color="#004D40" dark block tile @click="alterarPassword()">Mudar Senha</v-btn>
                      </v-form>
                      <v-card-text align="left">
                        <v-btn color="#004D40" text dark @click="step1Voltar()"> <v-icon left dark> mdi-keyboard-return </v-icon> Voltar</v-btn>
                      </v-card-text>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-row>
            </v-window-item>
          </v-window>
        </v-card>
      </v-col>
    </v-row>
    <v-snackbar v-model="snackbar" :timeout="timeout" absolute right shaped top color="red accent-2">
      {{ textAlert }}
    </v-snackbar>
  </v-container>
</template>

<script>
import Admin from "../services/admin";

export default {
  name: "login",
  data: () => {
    return {
      rules: {
        required: (value) => !!value || "Este campo é obrigatório.",
        username: (value) => !!value || "Username é obrigatório.",
        password: (value) => !!value || "Password é obrigatório.",
        maxValue: (value) => (value && value.length <= 50) || "Máximo 50 caracteres",
        minValue: (value) => (value && value.length >= 3) || "Mínimo 3 caracteres",
        minPassword: (value) => (value && value.length >= 4) || "Mínimo 4 caracteres",
        confirmPassword: (value) => value == this.admin.password || "A confirmação da senha não corresponde.",
        campoInvalido: (value) => /^[^-\s]/.test(value) || "Este campo não pode ter espaçamento no início.",
        caractereInvalido: (value) => /[a-zA-ZÀ-ú ]+$/.test(value) || "Campo com caracteres inválidos.",
        email: (value) =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) || "Email Inválido.",
      },
      showPassword1: false,
      showPassword2: false,
      showPassword3: false,
      snackbar: false,
      textAlert: "",
      timeout: 2000,
      step: 1,
      login: {
        username: "",
        password: "",
      },
      mudarPassword: {
        username: "",
        email: "",
        password: "",
      },
      admin: {
        id: "",
        nomeAdmin: "",
        email: "",
        endereco: "",
        userName: "",
        password: "",
      },
      confirmPassword: "",
      admins: [],
    };
  },

  mounted() {},
  methods: {
    verificarLogin() {
      Admin.verificar(this.login).then((res) => {
        this.admins = res.data;
        if (res.data.length > 0) {
          localStorage.setItem("authAdmin", JSON.stringify(this.admins));
          this.$router.push({ name: "home" });

          //
        } else {
          this.textAlert = "Username e/ou Password incorretos";
          this.snackbar = true;
          this.login = {};
          this.$refs.form1.resetValidation();
        }
      });
    },
    salvar() {
      if (this.$refs.form2.validate()) {
        Admin.salvar(this.admin).then(() => {
          this.$swal("Admin Cadastrado com Sucesso", "", "success");
          this.admin = {};
          this.step--;
          this.$refs.form.resetValidation();
        });
      }
    },
    alterarPassword() {
      if (this.$refs.form3.validate()) {
        Admin.verificarEmail(this.mudarPassword)
          .then((res) => {
            this.admin = res.data;
            this.admin.password = this.mudarPassword.password;
            if (this.admin.userName == this.mudarPassword.username) {
              Admin.atualizarPassword(this.admin).then(() => {
                this.$swal("Senha Recuperada com Sucesso", "", "success");
                this.mudarPassword = {};
                this.confirmPassword = "";
                this.step -= 2;
                this.$refs.form3.resetValidation();
              });
            } else {
              this.snackbar = true;
              this.textAlert = "Email e/ou Username incorretos";
              this.mudarPassword = {};
              this.confirmPassword = "";
              this.$refs.form3.resetValidation();
            }
          })
          .catch((e) => {
            if (e.response.data) {
              this.textAlert = "Email e/ou Username incorretos";
              this.mudarPassword = {};
              this.confirmPassword = "";
              this.$refs.form3.resetValidation();
              this.snackbar = true;
            }
          });
      }
    },
    step2Cadastro() {
      this.step++;
      this.login = {};
      this.$refs.form1.resetValidation();
    },
    step3Senha() {
      this.step += 2;
      this.login = {};
      this.$refs.form1.resetValidation();
    },
    step1Login() {
      this.step--;
      this.admin = {};
      this.$refs.form2.resetValidation();
    },
    step1Voltar() {
      this.step -= 2;
      this.admin = {};
      this.$refs.form3.resetValidation();
    },
  },
};
</script>
<style scoped>
#mudarSenha {
  position: relative;
  left: 220px;
  bottom: 18px;
  color: #004d40;
  text-decoration: none;
}
</style>
