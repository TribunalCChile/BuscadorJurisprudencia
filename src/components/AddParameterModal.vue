<template>
    <CModal :visible="showModal" @close="closeModal">
        <CModalHeader>
            <CModalTitle>Nuevo Parámetro</CModalTitle>
        </CModalHeader>
        <CModalBody>
           
            <CForm>
                <label for="">Nombre</label>
                <CFormInput
                    type="text"
                    placeholder="Nombre parámetro"
                    aria-describedby="Inserte un nuevo parámetro"
                    @input="setTouched('nombre')"
                    v-model="form.nombre"
                    feedback="Rellene este campo por favor."
                    :invalid="v$.form.nombre.$error"
                    class="mt-1"
                    
                    
                />
                <label class="mt-3">Tipo de parámetro</label>
                <v-select
                    v-model="form.tipoparametro_id"
                    :options="types"
                    :reduce="type => type.id"
                    placeholder="Seleccione..."
                    label="name"
                    @option:selected="handleSelect"
                    class="mt-1"
                >
                </v-select>

                <div v-if="isTypeSelected">
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
                </div>

                <!-- <div v-else>
                    <label for="" class="mt-3">Tipo de Campo</label>
                    <v-select
                        v-model="form.codigo"
                        :options="fieldType"
                        :reduce="field => field.id.toString()"
                        placeholder="Seleccione..."
                        label="name"
                        class="mt-1"
                    >
                    </v-select>
                    
                </div> -->

                
                
            </CForm>
        </CModalBody>
        <CModalFooter>
            <CButton color="success" @click="saveParameter" class="text-white">
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
        name: 'AddClient',
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
        emits: ['closeAddParameterModal'],
        data() {
            return {
                form: {
                    nombre: '',
                    codigo: '1',
                    tipoparametro_id: null,
                    tipodato_id: null,
                    estado: 1

                },
                isTypeSelected: false,
                types: [
                    {
                        'id': 1,
                        'name': 'Campo Single'
                    },
                    {
                        'id': 2,
                        'name': 'Campo Multiple'
                    },
                    {
                        'id': 3,
                        'name': 'Campo TextArea'
                    },
                    {
                        'id':4,
                        'name': 'Campo Fixed Array'
                    }
                ],
                dataTypes: [],
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
                    codigo: {
                        required
                    },
                    
                }
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
                if (this.actionSuccess) {
                    return 'Parámetro guardado exitósamente.';
                } else {
                    return this.errorMsg ? this.errorMsg : 'Error al guardar Parámetro.'; 
                }
            }, 

            handleSelect(value) {
                if (value.id === 2 || value.id === 4) {
                    this.isTypeSelected = true;   
                
                } else {
                    this.form.tipodato_id = null;
                    this.isTypeSelected = false;
                }
            },
            restoreInitialData() {
                this.actionSuccess = false; 
                this.showNotification = false; 
                this.form.nombre = '';
                //this.form.estado = false;
                this.v$.$reset();
            },
            closeModal() {
                this.restoreInitialData(); 
                this.$emit('closeAddParameterModal'); 
                this.form.nombre = '';
                //this.form.codigo = '',
                this.form.tipoparametro_id = '';
                this.form.tipodato_id = ''; 
                this.v$.$reset();
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
                    console.log(this.dataTypes);
                    
                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                   
                }
            },
            
            async saveParameter() {
                this.setTouched('all');
                console.log(this.v$.$invalid); 
                if(!this.v$.$invalid) {
                    try {
                        const response = await axios.post(
                            this.$store.state.backendUrl + '/parametro',
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

    }
    
</script>