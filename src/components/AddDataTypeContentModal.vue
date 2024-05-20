<script>
    import axios from 'axios';
    import useVuelidate from '@vuelidate/core'
    import { required } from '@vuelidate/validators'
    import ToastNotification from './ToastNotification.vue'; 
    export default {
        name: 'AddDataTypeContentModal',
        props: {
            showAddModal: Boolean,
            dataTypeDetail: Object
        },
        components: {
            ToastNotification
        },
        setup() {
            return { v$: useVuelidate() }
        },
        emits: ['closeAddModal', 'updateContentData'],
        data() {
            return {
                form: {
                    nombre: '',
                    estado: false,
                    tipodato_id: null
                },
                dataTypes: [],
                actionSuccess: false,
                showNotification: false,
                resultMsg: '',
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
                    },
                    tipodato_id:{
                        required
                    }
                }
            }
        },

        watch: {
            dataTypeDetail: {
                handler(newConfig) {
                    this.setDataTypeDetail(newConfig);
                },
                immediate: true     
            },
            
        },

        
        mounted() {
            this.getDataTypes();
        },
        methods: {
            setDataTypeDetail(newConfig) {
                if (newConfig) {
                    this.form.tipodato_id = newConfig.id; 
                }
            },
            getResultType() {
                return this.actionSuccess ? 'success' : 'error'; 
            },
            getResultMsg() {
                return this.actionSuccess ? 'Dato añadido exitósamente.' : 'Error al añadir tipo de dato'; 
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
                if(theModel == 'tipodato_id' || theModel == 'all' ) {
                    this.v$.form.tipodato_id.$touch()
                }
            },
            async getDataTypes() {
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/tipodato',
                        { 
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    );
                    
                    this.dataTypes = response.data;
                    console.log("datatipes: ",this.dataTypes);
                    
                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                   
                }
            },  
            
            async saveDataType() {
                this.form.estado = this.form.estado ? 1 : 0;

                this.setTouched('all');
                if(!this.v$.$invalid) {
                    try {
                        const response = await axios.post(
                            this.$store.state.backendUrl + '/tipodatocontenido',
                            this.form,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer ' + this.$store.state.token,
                                }
                            }
                        )
                        console.log(response);
                        this.actionSuccess = true;
                        this.showNotification = true;
                         // Cerrar el modal primero
                        
                        setTimeout(() => {
                            this.showNotification = false;
                            this.closeModal();
                            this.$emit('updateContentData'); 

                        }, this.duration);

                        
                        

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
                                    
                                    
                                    
                                    
                                }
                            }
                        } */
                    }
                    

                }
                    
            }
        }

    }
</script>
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
                <label class="mt-3">Tipo de dato</label>
                <v-select
                    v-model="form.tipodato_id"
                    :options="dataTypes"
                    :reduce="dataType => dataType.id"
                    placeholder="Seleccione..."
                    label="nombre"
                    class="mt-1"
                >
                </v-select>
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