<template>
    <CModal :visible="showDeleteModal" @close="closeModal">
        <CModalHeader>
            <CModalTitle>
                Eliminar Tipo de dato: {{ datatype.nombre }}
            </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <b>Advertencia:</b> Se eliminará este tipo de dato junto con su información asociada. 
        </CModalBody>
        <CModalFooter>
            <CButton 
                @click="deleteDataType"
                color="danger"
                class="text-white">Eliminar
            </CButton>

            <CButton color="primary" @click="closeModal">Cancelar</CButton>
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
    import ToastNotification from './ToastNotification.vue';

    export default {
        name: 'DeleteDataTypeModal',
        components: {
            ToastNotification
        },
        emits: ['closeDeleteModal'],
        props: {   
            showDeleteModal: Boolean, 
            datatype: Object
        },
        data() {
            return {
                actionSuccess: false,
                showNotification: false,
                duration: 1500,
                resultMsg: '',
                resultType:'',
            }
        },
        mounted() {
            //this.getDataAccount(); 
        },
        methods: {
            restoreInitialData() {
                this.actionSuccess = false; 
                this.showNotification = false; 
                
            },
            getResultType() {
                return this.actionSuccess ? 'success' : 'error'; 
            },
            getResultMsg() {
                return this.actionSuccess ? 'Tipo de dato eliminado exitósamente.' : 'Error al eliminar tipo de dato'; 
            },
            closeModal() {
                this.$emit('closeDeleteModal');                
            },

            async getDataAccount() {
                const response = await axios.get(
                    this.$store.state.backendUrl + '/account',
                    {
                        headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                        }
                    }
                ); 

                this.profile = response.data; 
                console.log(this.profile); 
            },
           
            async deleteDataType() {
                /* if (this.user.id === this.profile.id) {
                    this.fail = true; 
                    setTimeout(() => {
                            this.closeModal(); 
                    }, 2000);
                
                } else { */
                    try {
                        const response = await axios.delete(
                            this.$store.state.backendUrl + '/tipodato/' + this.datatype.id,
                            {
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: 'Bearer ' + this.$store.state.token,
                                }
                            }
                        )
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
                                    
                                    
                                    
                                    
                                }
                            }
                        } */
                    }   
            }

        }
    }           
</script>