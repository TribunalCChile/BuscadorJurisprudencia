

<script>
    import axios from 'axios'; 
    import ToastNotification from './ToastNotification.vue';

    export default {
        name: 'DeleteDataTypeModal',
        components: {
            ToastNotification
        },
        emits: ['closeDeleteModal', 'updateContentData'],
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
                fail: false,
                success: false,
            }
        },
        mounted() {
           
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

            async deleteDataType() {
                /* if (this.user.id === this.profile.id) {
                    this.fail = true; 
                    setTimeout(() => {
                            this.closeModal(); 
                    }, 2000);
                
                } else { */
                console.log(this.datatype);
                try {
                    const response = await axios.delete(
                        this.$store.state.backendUrl +'/tipodatocontenido/' + this.datatype.id,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": 'Bearer ' + this.$store.state.token,
                            }
                        }
                    ); 
                    
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

        }
    }           
</script>

<template>
    <CModal :visible="showDeleteModal" @close="closeModal">
        <CModalHeader>
            <CModalTitle>
                Eliminar [{{ datatype.nombre }}]
            </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <b>Advertencia:</b> Se eliminará este dato junto con su información asociada. 
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