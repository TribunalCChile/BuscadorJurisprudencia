<template>
    <CModal :visible="showEditModal" @close="closeModal">
        <CModalHeader>
            <CModalTitle>Editar Tipo de Dato</CModalTitle>
        </CModalHeader>
        <CModalBody>
        
            <CForm class="mt-3">
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
            <CButton color="secondary" @click="closeModal">
                Cerrar
            </CButton>
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
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';
    import ToastNotification from './ToastNotification.vue';
    
    export default {
        name: 'EditDataTypeModal',
        components: {
            CIcon,
            ToastNotification
        },
        emits: ['update:showEditModal','closeEditModal'], 
        props: {
            showEditModal: Boolean,
            datatype: Object
        },
        setup() {
            return { 
                v$: useVuelidate(),
                icon
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
                },
                
            }
        },
        data() {
            return {
                form: {
                    id: '',
                    nombre: '',
                    estado: 0,
                },
                actionSuccess: false,
                showNotification: false,
                resultMsg: '',
                resultType:'',
                duration: 1500,
                
                
            }
        },
        watch: {
            datatype: {
                handler(newConfig) {
                    this.setDataType(newConfig);
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
            'form.estado': function(bool) {
                this.form.estado = bool ? 1:0; 
            }
        },
        methods: {
            getResultType() {
                return this.actionSuccess ? 'success' : 'error'; 
            },
            getResultMsg() {
                return this.actionSuccess ? 'Tipo de dato actualizado exitósamente' : 'Error al añadir tipo de dato'; 
            }, 
            setTouched(theModel) { 
                if(theModel == 'nombre' || theModel == 'all' )
                {this.v$.form.nombre.$touch()}

                if(theModel == 'estado' || theModel == 'all' )
                {this.v$.form.estado.$touch()}
                
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
                this.$emit('closeEditModal'); 
            },

            closeModalOutside(event) {
                if (event.target === event.currentTarget) {
                    this.closeModal();
                }
            },
            setDataType(newConfig) {
                if (newConfig) {
                    this.form.id = newConfig.id;
                    this.form.nombre = newConfig.nombre;
                    this.form.estado = newConfig.estado; 
                    
                } 
            },

            async saveDataType() {
                this.setTouched('all');
                if(!this.v$.$invalid) {
                    try {
                        const response = await axios.put(
                            this.$store.state.backendUrl + '/tipodato/' + this.form.id,
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

                                    setTimeout(() => {
                                        this.restoreInitialData();
                                    //    this.closeModal(); 
                                    }, 2000);
                                    
                                }
                            }
                        } */
                    }
                    
                }
                
            },
    
        }

    }
    
</script>