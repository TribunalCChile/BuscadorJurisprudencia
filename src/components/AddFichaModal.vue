<template>
    <CModal :visible="showModal" @close="closeModal">
        <CModalHeader>
            <CModalTitle>Nueva Ficha</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CForm>
                <v-select
                    v-model="template_id"
                    searchable
                    :options="templates"
                    :reduce="template => template.id"
                    label="nombre"
                    placeholder="Seleccione un template"
                >

                </v-select>
            </CForm> 
        </CModalBody>
        <CModalFooter>
            <CButton 
                color="success" 
                class="text-white" 
                @click="useTemplate"
                :class="{'disabled': template_id === null}"
            >
                <CIcon :icon="icon.cilPlus" size="sm"/>
                Crear
            </CButton>
            <CButton color="secondary" @click="closeModal">Cerrar</CButton>
            
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
        name: 'AddDataType',
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
        emits: ['closeAddFicha'],
        data() {
            return {
                form: {
                    template_id: null
                },
                actionSuccess: false,
                showNotification: false,
                errorMsg: '',
                resultType:'',
                duration: 1500,
                templates: [],
                template_id: null,
            }
        },
        
        mounted() {
            this.getTemplates(); 
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
                return this.actionSuccess ? 'Ficha creada exitósamente.' : 'Error al añadir fecha.'; 
            }, 

            restoreInitialData() {
                this.actionSuccess = false; 
                this.showNotification = false; 
                this.template_id = null; 
                this.v$.$reset();
            },
            closeModal() {
                this.restoreInitialData(); 
                this.$emit('closeAddFicha'); 
                
            },

            closeModalOutside(event) {
                if (event.target === event.currentTarget) {
                    this.closeModal();
                }
            },
            async getTemplates() {
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/template',
                        { 
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    );
                    
                    this.templates = response.data;
                    console.log(this.templates);
                    
                } catch (error) {
                    this.failMsg = 'Error al obtener templates.'; 
                    this.fail = true;
                }
            },

            useTemplate() {
                console.log("template_id: ", this.template_id);
                const template = this.templates.filter(temp => temp.id === this.template_id)[0]; 
                
                this.closeModal();
        
                setTimeout(() => {
                    this.actionSuccess = true;
                    this.showNotification = true;
                    setTimeout(() => {
                        this.showNotification = false;                        
                    }, this.duration);
                }, 0);

                this.$store.commit("createTemplate", template);
                this.$router.push({
                    name: 'Crear Ficha', 
                    params: { 
                        idTemplate: template.id 
                    }}
                );
                
                      
                        

                        
                    
                    
                                    
                
                    
            }
        }

    }
    
</script>
