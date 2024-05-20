<template>
    <CModal :visible="showDeleteModal" @close="closeModal">
        <CModalHeader>
            <CModalTitle>
                Eliminar Ficha: {{ ficha.nombre }}
            </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <b>Advertencia:</b> Se eliminará esta ficha junto con su información asociada. 
        </CModalBody>
        <CModalFooter>
            <CButton 
                @click="deleteFicha"
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
        name: 'DeleteFichaModal',
        components: {
            ToastNotification
        },
        emits: ['closeDeleteFichaModal'],
        props: {   
            showDeleteModal: Boolean, 
            ficha: Object
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
                return this.actionSuccess ? 'Ficha eliminada exitósamente.' : 'Error al eliminar ficha'; 
            },
            closeModal() {
                this.$emit('closeDeleteFichaModal');                
            },

           
            async deleteFicha() {
                try {
                    const response = await axios.delete(
                        this.$store.state.backendUrl + '/ficha/' + this.ficha.id,
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
                        
                }   
            }

        }
    }           
</script>