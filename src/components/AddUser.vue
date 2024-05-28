<template>
    <CModal :visible="showModal" @close="closeModal">
        <CModalHeader>
            <CModalTitle>Nuevo Usuario</CModalTitle>
        </CModalHeader>
        <CModalBody>
           
            <CForm>
                <CFormCheck label="LDAP" v-model="form.ldap" />
                <label for="">Nombre</label>
                <CFormInput
                    type="text"
                    placeholder="Nombre usuario"
                    aria-describedby="Inserte su correo electrónico"
                    v-model="form.name"
                    class="mt-1"
                />

                <label class="mt-3">Correo electrónico</label>
                <CFormInput
                    type="email"
                    placeholder="Correo electrónico"
                    aria-describedby="Inserte su correo electrónico"
                    v-model="form.email"
                    class="mt-1"
                    autocomplete="off"
                />

                <label class="mt-3">Contraseña</label>
                <CFormInput
                    type="password"
                    placeholder="Contraseña"
                    aria-describedby="Inserte una contraseña"
                    v-model="form.password"
                    class="mt-1"
                    autocomplete="off"
                />        
                
            </CForm>
        </CModalBody>
        <CModalFooter>
            <CButton color="success" @click="saveUser" class="text-white" :class="{'disabled': isDisabledButton}">
                <CIcon :icon="icon.cilSave" size="lg"/>
                Guardar
            </CButton>
            <CButton color="secondary" @click="closeModal">
                Cerrar
            </CButton>
            
        </CModalFooter>
    </CModal>
    <ToastNotification
        v-if="showNotification"
        :type="getResultType()"
        :duration="duration"
        :message="getResultMsg()" 
    />
</template>

<script>
    import axios from 'axios';
    import useVuelidate from '@vuelidate/core'
    import { required } from '@vuelidate/validators'
    import ToastNotification from './ToastNotification.vue'; 
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';
    
    export default {
        name: 'AddUser',
        props: {
            showModal: Boolean,
        },
        components: {
            ToastNotification,
            CIcon
        },
        setup() {
            return { v$: useVuelidate(), icon }
        },
        emits: ['closeAddUserModal'],
        data() {
            return {
                form: {
                    name: '',
                    email: '',
                    password: '',
                    ldap: false,
                },
                actionSuccess: false,
                showNotification: false,
                errorMsg: '',
                resultType:'',
                duration: 1500,

            }
        },
        computed: {
            isDisabledButton() {
                return !this.form.name.length || !this.form.email.length || !this.form.password.length; 
            }
        },
        mounted() { 
        }, 
        methods: {
            getResultType() {
                return this.actionSuccess ? 'success' : 'error'; 
            },
            getResultMsg() {
                if (this.actionSuccess) {
                    return 'Usuario guardado exitósamente.';
                } else {
                    return this.errorMsg ? this.errorMsg : 'Error al guardar Usuario.'; 
                }
            }, 

            restoreInitialData() {
                this.actionSuccess = false; 
                this.showNotification = false; 
                //this.form.nombre = '';
                //this.form.estado = false;
                
            },
            closeModal() {
                this.restoreInitialData(); 
                this.$emit('closeAddUserModal'); 
                this.form.name = '';
                this.form.email = '',
                this.form.password = '';
                this.form.ldap = 0; 
                
            },

            closeModalOutside(event) {
                if (event.target === event.currentTarget) {
                    this.closeModal();
                }
            },
            
            async saveUser() { 
                try {
                    const response = await axios.post(
                        this.$store.state.backendUrl + '/user',
                        this.form,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    )
                    console.log(response);
                    this.closeModal(); // Cerrar el modal primero
                    setTimeout(() => {
                        this.actionSuccess = true;
                        this.showNotification = true;
                        setTimeout(() => {
                            this.showNotification = false;
                        }, this.duration);
                    }, 0);
                        

                } catch (error) {
                    this.actionSuccess = false;
                    this.showNotification = true; 

                    if (error.response && error.response.data && error.response.data.errors) {
                        const errors = error.response.data.errors; 
                        this.errorMsg = Object.values(errors).join('\n');
                        
                    } else {
                        this.errorMsg = 'Error al guardar Usuario'; 
                    }
                        
                    setTimeout(() => {
                        this.showNotification = false;
                            //this.restoreInitialData();
                        this.closeModal(); 
                    }, this.duration);
                } 
                    
                    
            }
        }

    }
    
</script>