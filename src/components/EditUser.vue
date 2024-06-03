<template>
    <CModal :visible="showEditModal" @close="closeModal">
        <CModalHeader>
            <CModalTitle>Editar Usuario [{{ user.name }}] </CModalTitle>
        </CModalHeader>
        <CModalBody>
           
            <CForm>
                <CFormCheck label="LDAP" v-model="form.ldap" />
                <label for="">Nombre</label>
                <CFormInput
                    type="text"
                    placeholder="Nombre"
                    aria-describedby="Inserte un nuevo parámetro"
                    v-model="form.name"
                    class="mt-1"
                />

                <label class="mt-3">Correo electrónico</label>
                <CFormInput
                    type="text"
                    placeholder="Correo electrónico"
                    aria-describedby="Inserte su correo electrónico"
                    v-model="form.email"
                    class="mt-1"
                />
                
            </CForm>
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" @click="closeModal">
                Cerrar
            </CButton>
            <CButton color="primary" @click="saveUser" >Guardar</CButton>
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
    
    export default {
        name: 'EditUserModal',
        components: {
            ToastNotification
        },
        props: {
            showEditModal: Boolean,
            user: Object
        },
        setup() {
            return { v$: useVuelidate() }
        },
        emits: ['closeEditUserModal', "update:showEditModal"],
        data() {
            return {
                form: {
                    id: null,
                    name: '',
                    email: '',
                    roles: [],
                    ldap: 0,
                },
                isTypeSelected: false,
                actionSuccess: false,
                showNotification: false,
                duration: 1500,
                resultMsg: '',
                resultType:'',
                allRoles: [],
                
            }
        },
        
        computed: {
           /*  isDisabledButton() {
                return !this.form.name.length || this.form.email.length || !this.form.roles.length; 
            } */
        },
        watch: {
            user: {
                handler(newConfig) {
                    this.setUser(newConfig);
                },
                deep: true,
                immediate: true     
            },
            showEditModal(newValue) {
                // Si la modal se cierra, restablecer el valor de showModal
                if (!newValue) {
                    this.$emit('update:showEditModal');
                }
            },
            
        },

        mounted() {
            //this.getRoles(); 
        }, 
        methods: {
            handleSelectRol() {
                return; 
            },
            setUser(newConfig) {
                if (newConfig) {
                    this.allRoles = newConfig.availableRoles; 
                    this.form.id = newConfig.id;
                    this.form.name = newConfig.name;
                    this.form.email = newConfig.email;
                    this.form.ldap = newConfig.ldap; 
                    
                    if (newConfig.roles.length) {
                        this.form.roles = newConfig.roles; 
                    }
                } 
            },
            
            restoreInitialData() {
                this.actionSuccess = false; 
                this.showNotification = false; 
            },
            getResultType() {
                return this.actionSuccess ? 'success' : 'error'; 
            },
            getResultMsg() {
                return this.actionSuccess ? 'Usuario actualizado exitósamente.' : 'Error al actualizar usuario'; 
            },
            closeModal() {
                this.restoreInitialData(); 
                this.$emit('closeEditUserModal'); 
                this.form.name = '';
                this.form.email = '',
                this.form.password = '';
                this.form.password_confirmation = ''; 
            },

            closeModalOutside(event) {
                if (event.target === event.currentTarget) {
                    this.closeModal();
                }
            },

            async saveUser() {
                try {
                    const response = await axios.put(
                        this.$store.state.backendUrl + '/user/' + this.form.id,
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
                        
                    setTimeout(() => {
                        this.showNotification = false;
                        //this.restoreInitialData();
                        this.closeModal(); 
                    }, this.duration);
                        /* if (error.response) {
                            const errors = error.response.data.errors; 
                            for (const key in errors) {
                                if (errors.hasOwnProperty(key)) {
                                    const errMsg = errors[key];
                                    this.failMsg = this.failMsg.concat(errMsg, "\n");  
                                    this.fail = true; 
                                    this.toast.error(this.failMsg, {
                                        timeout: 2000
                                    });

                                    setTimeout(() => {
                                        this.restoreInitialData();
                                    //    this.closeModal(); 
                                    }, 1000);
                                    
                                }
                            }
                        } */
                    }
                    
            }
        }

    }
    
</script>