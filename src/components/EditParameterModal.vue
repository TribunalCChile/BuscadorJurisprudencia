<template>
    <CModal :visible="showEditModal" @close="closeModal">
        <CModalHeader>
            <CModalTitle>Editar Parámetro [{{ parameter.nombre }}] </CModalTitle>
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
                    @input="setTouched('tipoparametro_id')"
                    feedback="Rellene este campo por favor."
                    :invalid="v$.form.tipoparametro_id.$error"
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
            <CButton color="secondary" @click="closeModal">
                Cerrar
            </CButton>
            <CButton color="primary" @click="saveParameter">Guardar</CButton>
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
        name: 'EditParamaterModal',
        components: {
            ToastNotification
        },
        props: {
            showEditModal: Boolean,
            parameter: Object
        },
        setup() {
            return { v$: useVuelidate() }
        },
        emits: ['closeEditParameterModal', "update:showEditModal"],
        data() {
            return {
                form: {
                    id: null,
                    nombre: '',
                    codigo: '',
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
                        'id': 4,
                        'name': 'Campo Fixed Array'
                    }
                ],
                /* fieldType: [
                    {
                        'id': 1,
                        'name': 'Tipo Text'
                    },
                    {
                        'id': 2,
                        'name': 'Tipo TextArea'
                    }
                ], */
                dataTypes: [], 
                actionSuccess: false,
                showNotification: false,
                duration: 1500,
                resultMsg: '',
                resultType:'',
                
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
                    tipoparametro_id: {
                        required
                    },
                }
            }
        },

        watch: {
            parameter: {
                handler(newConfig) {
                    this.setParameter(newConfig);
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
            this.getDataTypes(); 
        }, 
        methods: {
            setParameter(newConfig) {
                if (newConfig) {
                    this.form.id = newConfig.id;
                    this.form.nombre = newConfig.nombre;
                    this.form.estado = newConfig.estado;
                    this.form.codigo = newConfig.codigo; 
                    this.form.tipoparametro_id = newConfig.tipoparametro_id;
                    this.form.tipodato_id = newConfig.tipodato_id;
                    
                    if (this.form.tipoparametro_id === 2 || this.form.tipoparametro_id === 4) {
                        this.isTypeSelected = true; 
                    }
                } 
            },
            handleSelect(value) {
                if (value.id == 2 || value.id === 4) {
                    this.isTypeSelected = true;   
                } else {
                    this.form.tipodato_id = null;
                    this.isTypeSelected = false;
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
                return this.actionSuccess ? 'Parámetro actualizado exitósamente.' : 'Error al actualizar parámetro'; 
            },
            closeModal() {
                this.restoreInitialData(); 
                this.$emit('closeEditParameterModal'); 
                this.form.nombre = '';
                this.form.codigo = '',
                this.form.tipoparametro_id = '';
                this.form.tipodato_id = ''; 
                this.isTypeSelected = false;
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
                if(theModel == 'tipoparametro_id' || theModel == 'all' ){
                    this.v$.form.tipoparametro_id.$touch()
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
                if(!this.v$.$invalid) {
                    try {
                        const response = await axios.put(
                            this.$store.state.backendUrl + '/parametro/' + this.form.id,
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

    }
    
</script>