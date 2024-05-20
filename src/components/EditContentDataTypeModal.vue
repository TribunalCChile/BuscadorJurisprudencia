<script>
    import axios from 'axios';
    import useVuelidate from '@vuelidate/core'
    import { required } from '@vuelidate/validators'
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';
    import ToastNotification from './ToastNotification.vue';
    
    export default {
        name: 'EditContentDataTypeModal',
        components: {
            CIcon,
            ToastNotification
        },
        emits: ['update:showEditModal','closeEditModal', 'updateContentData'], 
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
                    },
                    tipodato_id: {
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

        mounted() {
            this.getDataTypes(); 
        },

        methods: {
            getResultType() {
                return this.actionSuccess ? 'success' : 'error'; 
            },
            getResultMsg() {
                return this.actionSuccess ? 'Dato actualizado exitósamente.' : 'Error al añadir dato.'; 
            }, 
            setTouched(theModel) { 
                if(theModel == 'nombre' || theModel == 'all' ) {
                    this.v$.form.nombre.$touch()
                }

                if(theModel == 'estado' || theModel == 'all' ) {
                    this.v$.form.estado.$touch()
                }
                
                if(theModel == 'tipodato_id' || theModel == 'all' ){
                    this.v$.form.tipodato_id.$touch()
                }
                
            },

            restoreInitialData() {
                this.actionSuccess = false; 
                this.showNotification = false; 
                this.form.nombre = '';
                this.form.estado = false;
                this.form.tipodato_id = ''
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
                    this.form.tipodato_id = newConfig.tipodato_id; 
                    
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
                    this.failMsg = 'Error al obtener templates.'; 
                    this.fail = true;
                }
            },  
            async saveDataType() {
                this.setTouched('all');
                if(!this.v$.$invalid) {
                    try {
                        const response = await axios.put(
                            this.$store.state.backendUrl + '/tipodatocontenido/' + this.form.id,
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
                        
                    }
                    
                }
                
            },
    
        }

    }
    
</script>
<template>
    <CModal :visible="showEditModal" @close="closeModal">
        <CModalHeader>
            <CModalTitle>Editar [{{ datatype.nombre }}]
            </CModalTitle>
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