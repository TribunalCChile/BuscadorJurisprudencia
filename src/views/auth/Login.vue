<template>
    <section class="vh-100 backG">
      <div class="container py-5 h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col col-xl-10">
            <div class="card" style="border-radius: 1rem;">
              <div class="row g-0">
                <div class="col-md-6 col-lg-5 d-none d-md-block">
                  <img :src="sideLoginImage" alt="login form" class="img-fluid" style="border-radius: 1rem 0 0 1rem;" />
                </div>
                <div class="col-md-6 col-lg-7 d-flex align-items-center">
                  <div class="card-body p-4 p-lg-5 text-black">
                    <CForm @submit="onSubmit" @keyup.enter="onSubmit">
                      <div class="d-flex align-items-center mb-3 pb-1">
                        <img class="img-fluid logo_main" :src="logoTC">
                        <span style='font-family: "Montserrat", sans-serif !important;' class="h1 fw-bold mb-0">Tribunal Constitucional</span>
                      </div>
                      <h5 class="fw-normal mb-3 pb-3 pt-4" style="letter-spacing: 1px;">Inicio de sesión Buscador</h5>
                      <div class="form-outline mb-4">
                        <label class="form-label" for="Usuario">Email</label>
                        <CInputGroup class="mb-3">
                          <CInputGroupText>
                            <CIcon icon="cil-user" />
                          </CInputGroupText>
                          <CFormInput  
								class="form-control form-control-lg inputs" 
								v-model.trim="form.username" 
								@input="setTouched('username')" 
								type="email" placeholder="Email"  
								feedback="Ingresa un email válido." 
								:invalid="v$.form.username.$error"
								autocomplete="off" 
							/>
                        </CInputGroup>
                      </div>
                      <div class="form-outline mb-4">
                        <label class="form-label" for="Clave">Contraseña</label>
                        <CInputGroup class="mb-4">
                          <CInputGroupText>
                            <CIcon icon="cil-lock-locked" />
                          </CInputGroupText>
                          <CFormInput 
						  		v-model.trim="form.password" 
								@input="setTouched('password')" 
								type="password" 
								placeholder="Contraseña"  
								feedback="Ingrese su contraseña." 
								:invalid="v$.form.password.$error" 
								class="form-control form-control-lg inputs"
								autocomplete="off" 
							/>
                        </CInputGroup>
                      </div>
                      <div class="pt-2 mb-4 d-grid gap-2 col-6 ">
                        <CButton
							class="custom-button"
                            color="dark" 
                            size="lg"
                            @click="onSubmit"
                        > Ingresar 
                        </CButton>
                      </div>
                      <!-- <a class="small text-muted" href="#!">Olvidaste tu contraseña?</a> -->
                    </CForm>
                    <CAlert color="danger" :visible="showError" dismissible @close="() => { showError = false }">
                      {{ errorMsg }}
                    </CAlert>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
    

<script>
/* eslint-disable */
import axios, { AxiosError } from "axios";
import useVuelidate from '@vuelidate/core'
import { required, email } from '@vuelidate/validators'
import SubmitButton from '@/components/SubmitButton.vue'
import logoTC from '@/assets/brand/logo-tc.jpg';
import sideLoginImage from '@/assets/images/tc_2.png'


export default {
    
    name: 'Login',
    setup() {
        return { 
            v$: useVuelidate(), 
            logoTC,
            sideLoginImage 
            
        }
    },
    components: {
        SubmitButton
    },
    data() {
        return {
            form: {
                username: '',
                password: '',
            },
            errorMsg: '', 
            showError: false,
            isSendingForm: false, 
        
        }
    },
    validations() {
        return {
            form: {
                username: {
                    required,
                    email,
                },
                
                password: {
                    required,
                },
            },
        }
    },
    methods: {
        setTouched(theModel) {
            if(theModel == 'username' || theModel == 'all' )
                {this.v$.form.username.$touch()}

            if(theModel == 'password' || theModel == 'all'){
                this.v$.form.password.$touch()
            } 
        },

        handleErrors(error) { 
            console.log("Error: ", error);
            this.showError=true;
            const statusCode = error.response.status; 
            
            if (error instanceof AxiosError && error.response) {
                if (statusCode == 404) {    
                    this.errorMsg = "No se encontró el recurso solicitado."
                
                } else if (statusCode == 401) {
                    this.errorMsg = "Email y/o Contraseña inválida."
                
                } else if (statusCode == 500) {
                    this.errorMsg = "Error del servidor: Ha ocurrido un error interno en el servidor."
                }

            } else if (error.request) {
                this.errorMsg = "No se recibió respuesta del servidor.";

            } else {
                this.errorMsg = "Ha ocurrido un error: " + error; 
            }
            this.isSendingForm = false;
        },

        onSubmit(event) {
            event.preventDefault();
            this.setTouched('all');
            
            if (!this.v$.$invalid) {
                this.isSendingForm = true;
				
                axios.post(
                    this.$store.state.backendUrl+'/login',
                    this.form, 
                    {
                        headers: {
                            "Content-Type": "application/json",
                            
                        }
                    })
                .then((response) => {
                    let resp = response.data; 
                    console.log("RESP: ",resp);
                   
                    this.$store.commit('saveLogin',
                    {
                        "token":resp.access_token,
                        "name":resp.name,
                    });
                 
                    this.$router.push('/')
                    this.isSendingForm = false;
            
                })
                .catch( (error) => {
                    this.handleErrors(error); 
                    
                });
            
            }
        },
    },
}
</script>

<style>
    .background-login {
        background-color: #595959;  
    }

	

    
</style>