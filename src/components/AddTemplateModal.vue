<template>
    <CModal :visible="showModal" @close="closeModal">
        <CModalHeader>
            <CModalTitle>Nuevo Template</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CForm>
                <label for="">Nombre</label>
                <CFormInput
                    type="text"
                    placeholder="Nombre Template"
                    aria-describedby=""
                    @input="setTouched('nombre')"
                    v-model="form.nombre"
                    feedback="Rellene este campo por favor."
                    :invalid="v$.form.nombre.$error"
                    class="mt-1"
                />
                <label for="" class="mt-3">Código</label>
                <CFormInput
                    type="text"
                    placeholder="Código template"
                    aria-describedby=""
                    @input="setTouched('codigo')"
                    v-model="form.codigo"
                    feedback="Rellene este campo por favor."
                    :invalid="v$.form.codigo.$error"
                    class="mt-1"
                />
                
                
                </CForm>

            <CTable class="mt-3">
                <CTableHead>
                    <CTableRow>
                        <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Código</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Tipo de Parámetro</CTableHeaderCell>
                    </CTableRow>
                </CTableHead>
                <CTableBody>
                    <CTableRow v-for="parameter in selectedParameters" :key="parameter.id">
                        <CTableDataCell>{{ parameter.nombre }}</CTableDataCell>
                        <CTableDataCell class="text-center">{{ parameter.codigo }}</CTableDataCell>
                        <CTableDataCell class="text-center">  {{ setParameterType(parameter.tipoparametro_id) }}</CTableDataCell>
                    </CTableRow>
                </CTableBody>
            </CTable>
        </CModalBody>
        <CModalFooter>
            <div v-if="crudOperation === 1">
                <CButton color="success" class="text-white"  @click="saveTemplate">
                    <CIcon :icon="icon.cilSave" size="lg"/>
                    Guardar
                </CButton>
            </div>
            <div v-else>
                <CButton color="success" class="text-white" @click="updateTemplate">
                    <CIcon :icon="icon.cilSave" size="lg"/>
                    Actualizar
                </CButton>
            </div>
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
        name: 'AddClient',
        components: {
            ToastNotification,
            CIcon
        },
        props: {
            showModal: Boolean,
            selectedParameters: Array,
            idTemplate: String,
            crudOperation: Number
        },
        setup() {
            return { v$: useVuelidate(), icon }
        },
        emits: ['closeAddTemplateModal','update:showModal'],
        data() {
            return {
                form: {
                    id:'',
                    nombre: '',
                    codigo: '',
                    tipo: '1',
                    fecha_ingreso: '2024-03-20 11:16:20',
                    estado: 1,
                    parametros: []
                },
                actionSuccess: false,
                showNotification: false,
                resultMsg: '',
                resultType:'',
                duration: 1500,
                templateData: []
                
            }
        },
        validations() {
            return {
                form: {
                    nombre:{
                        required
                    },
                    codigo:{
                        required
                    },
                }
            }
        },
        mounted() {
            this.getTemplateData(this.idTemplate).then(() => {
                if (this.crudOperation == '1') {
                    this.form.nombre = ''
                    this.form.codigo = ''
                } else {
                    this.form.nombre = this.templateData[0].nombre; 
                    this.form.codigo = this.templateData[0].codigo;
                }
                 
            }); 
            console.log(this.form.nombre);
        },
        watch: {
            selectedParameters: {
                handler(newConfig) {
                    this.setDataParameters(newConfig);
                },
                deep: true,
                immediate: true // Esto llama a setDataConfig() inmediatamente después de montar el componente
            },
           
            showModal(newValue) {
                // Si la modal se cierra, restablecer el valor de showModal
                if (!newValue) {
                    this.$emit('update:showModal', false);
                }
            }
        },

        
        methods: {
            getResultType() {
                return this.actionSuccess ? 'success' : 'error'; 
            },
            getResultMsg() {
                if (this.actionSuccess) {
                    return 'Template guardado exitósamente.';
                } else {
                    return this.errorMsg ? this.errorMsg : 'Error al guardar Template.'; 
                } 
            }, 
            async getTemplateData(id) {
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/template',
                        {
                            params: {
                                'filter': JSON.stringify({ id: id })
                            }, 
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    );
                    
                    this.templateData = response.data;
                    
                
                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                    this.failMsg = 'Error al obtener templates.'; 
                    this.fail = true;
                }

            },
            setParameterType(type) { 
                return type == 1 ? 'Single' : 'Multiple'; 
            },
            restoreInitialData() {
                this.actionSuccess = false; 
                this.showNotification = false; 
                
                this.v$.$reset();
            },
            closeModal() {
                this.restoreInitialData(); 
                this.$emit('closeAddTemplateModal'); 
            },

            closeModalOutside(event) {
                if (event.target === event.currentTarget) {
                    this.closeModal();
                }
            },

            setTouched(theModel) { 
                if(theModel == 'nombre' || theModel == 'all' ){
                    this.v$.form.nombre.$touch()
                }
                if(theModel == 'codigo' || theModel == 'all' ){
                    this.v$.form.codigo.$touch()
                }
                
            },

            setDataParameters(newConfig) {
                if(newConfig) {
                    console.log("Config desde setDataParameters: ", newConfig); 
                }
            },

            async saveTemplate() {
                // se da formato a parametros para enviarse solo id y prioridad según API
                this.form.parametros = this.selectedParameters.map(
                    ({ id, prioridad }) => ({ id, prioridad })
                ); 

                this.setTouched('all');
                if(!this.v$.$invalid) {
                    try {
                        const response = await axios.post(
                            this.$store.state.backendUrl + '/template',
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
                    } 
                    

                }
            },
            
            async updateTemplate() {
                // se da formato a parametros para enviarse solo id y prioridad según API
                this.form.parametros = this.selectedParameters.map(
                    ({ id, prioridad }) => ({ id, prioridad })
                ); 

                this.setTouched('all');
                if(!this.v$.$invalid) {
                    try {
                        const response = await axios.put(
                            this.$store.state.backendUrl + '/template/' + this.idTemplate,
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
                    } 
                    

                }
                    
            }
        }

    }
    
</script>