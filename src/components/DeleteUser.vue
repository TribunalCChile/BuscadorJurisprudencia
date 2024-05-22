<template>
    <CModal :visible="showDeleteModal" @close="closeModal">
        <CModalHeader>
            <CModalTitle>
                Eliminar [{{ user.name }}]
            </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <b>Advertencia:</b> Se eliminará este usuario junto con su información asociada. 
        </CModalBody>
        <CModalFooter>
            <CButton 
                @click="deleteUser"
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
        name: 'DeleteUserModal',
        components: {
            ToastNotification
        },
        emits: ['closeDeleteUserModal'],
        props: {   
            showDeleteModal: Boolean, 
            user: Object
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
                return this.actionSuccess ? 'Usuario eliminado exitósamente.' : 'Error al eliminar usuario'; 
            },
            closeModal() {
                this.$emit('closeDeleteUserModal');                
            },

           
            async deleteUser() {
                    try {
                        const response = await axios.delete(
                            this.$store.state.backendUrl + '/user/' + this.parameter.id,
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
                                    
                                    
                                    
                                    
                                }
                            }
                        } */
                    }   
            }

        }
    }           
</script>