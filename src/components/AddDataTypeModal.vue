<template>
    <CModal :visible="showAddModal" @close="closeModal">
        <CModalHeader>
            <CModalTitle>Nuevo Tipo de Dato</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CForm>
                
                <CFormCheck
                    v-model="form.estado" 
                    label="Habilitado" 
                    class="mr-5"        
                />
                
                <CFormInput
                    type="text"
                    placeholder="Nombre"
                    aria-describedby="Nombre Tipo de Dato"
                    @input="setTouched('nombre')"
                    v-model="form.nombre"
                    feedback="Rellene este campo por favor."
                    :invalid="v$.form.nombre.$error"
                    class="mt-3"
                />
            </CForm> 
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" @click="closeModal">Cerrar</CButton>
            
            <CButton color="primary" @click="saveDataType">Guardar</CButton>
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
        name: 'AddDataType',
        props: {
            showAddModal: Boolean,
        },
        components: {
            ToastNotification
        },
        setup() {
            return { v$: useVuelidate() }
        },
        emits: ['closeAddModal'],
        data() {
            return {
                form: {
                    nombre: '',
                    estado: 0,
                },
                actionSuccess: false,
                showNotification: false,
                errorMsg: '',
                resultType:'',
                duration: 1500,
                
            }
        },
        validations() {
            return {
                form: {
                    nombre:{
                        required
                    },
                    estado: {
                        required
                    }
                }
            }
        },

        watch: {
            'form.estado': function(bool) {
                this.form.estado = bool ? 1 : 0; 
            }
        },
        methods: {
            getResultType() {
                return this.actionSuccess ? 'success' : 'error'; 
            },
            getResultMsg() {
                if (this.actionSuccess) {
                    return 'Tipo de dato guardado exitósamente.';
                } else {
                    return this.errorMsg ? this.errorMsg : 'Error al guardar Tipo de dato.'; 
                }
                
            }, 

            restoreInitialData() {
                this.actionSuccess = false; 
                this.showNotification = false; 
                this.form.nombre = '';
                this.form.estado = false;
                this.v$.$reset();
            },
            closeModal() {
                this.restoreInitialData(); 
                this.$emit('closeAddModal'); 
                
            },

            closeModalOutside(event) {
                if (event.target === event.currentTarget) {
                    this.closeModal();
                }
            },

            setTouched(theModel) { 
                if(theModel == 'nombre' || theModel == 'all' ) {
                    this.v$.form.nombre.$touch()
                }
                
                if(theModel == 'estado' || theModel == 'all' ) {
                    this.v$.form.estado.$touch()
                }
            },
            
            async saveDataType() {
                this.setTouched('all');
                if(!this.v$.$invalid) {
                    try {
                        const response = await axios.post(
                            this.$store.state.backendUrl + '/tipodato',
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
                            this.errorMsg = 'Error al guardar Ficha'; 
                        }
                        
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
                                    
                                    
                                    
                                    
                                }
                            }
                        } */
                    }
                    

                }
                    
            }
        }

    }
    
</script>
