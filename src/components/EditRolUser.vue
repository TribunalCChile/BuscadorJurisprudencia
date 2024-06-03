<script>
    import axios from 'axios'; 
    import ToastNotification from './ToastNotification.vue';
    import { computed, onMounted, ref, watch, toRefs } from 'vue'
    import { useStore } from 'vuex'
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';

    export default {
        name: 'Editar Rol Usuario',
        props: {
            showModal: Boolean,
            user: Object,
        },
        components: {
           CIcon, 
           ToastNotification,
        },
        emits: ['update:showModal', 'closeEditRolModal'],
        setup(props, { emit }) {
            const { user, showModal } = toRefs(props); 
            const store = useStore();
            const allRoles = ref([]); 
            let  isLoading = ref(false); 
            let actionSuccess = ref(false);
            let showNotification = ref(false);
            let duration = ref(1000); 
            let form = ref({
                user_id: null,
                roles_ids: []
            })

            const setRolUser = (newConfig) => {
                if (newConfig) {
                    console.log(newConfig);
                    allRoles.value = newConfig.availableRoles; 
                    form.value.user_id = newConfig.id
                    if (newConfig.roles.length) {
                        form.value.roles_ids = newConfig.roles; 
                    }
                } 
            }

            watch(user, (newConfig) => {
                setRolUser(newConfig);
                }, {
                    deep: true,
                    immediate: true
            });

            // Watcher para 'showModal'
            watch(showModal, (newValue) => {
                if (!newValue) {
                    emit('update:showModal');
                }
            });
            
            
            const restoreInitialData = () =>  {
                actionSuccess.value = false; 
                showNotification.value = false; 
            }
            const getResultType = () => {
                return actionSuccess.value ? 'success' : 'error'; 
            }

            const getResultMsg = () => {
                return actionSuccess.value ? 'Usuario actualizado exitósamente.' : 'Error al actualizar usuario'; 
            }

            const handleSelectRol = (options) => {
                return;
            }

            const closeModal = () => {
                restoreInitialData(); 
                emit('closeEditRolModal'); 
            }; 
            const addRolUser = async (option) => {
                let finalForm = { 
                    'user_id': form.value.user_id,
                    'roles_ids': option.map(op => op.id)
                }
                isLoading.value = true;
                
                try {
                    const response = await axios.post(
                        store.state.backendUrl + '/user/addRoles',
                        finalForm, 
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + store.state.token,
                            }
                        }
                    )
                    console.log(response);
        
                    setTimeout(() => {
                        actionSuccess.value = true;
                        showNotification.value = true;
                        setTimeout(() => {
                            isLoading.value = false;
                            showNotification.value = false;
                            closeModal();
                             
                        }, duration.value);
                    }, 0);
                } catch (error) {
                    actionSuccess.value = false;
                    showNotification.value = true; 
                        
                    setTimeout(() => {
                        showNotification.value = false;
                        isLoading.value = false; 
                        //this.restoreInitialData();
                        closeModal(); 
                    }, duration.value);
                }      
            }

            const removeRolUser = async (option) => {
                let finalForm = {
                    'user_id': form.value.user_id, 
                    'roles_ids': [option.id]
                } 
                isLoading.value = true;
                console.log("form remove: ", finalForm);
                try {
                    const response = await axios.post(
                        store.state.backendUrl + '/user/removeRole',
                        finalForm, 
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + store.state.token,
                            }
                        }
                    )
                    console.log(response);
        
                    setTimeout(() => {
                        actionSuccess.value = true;
                        showNotification.value = true;
                        setTimeout(() => {
                            isLoading.value = false;
                            showNotification.value = false;
                            closeModal(); 
                             
                        }, duration.value);
                    }, 0);
                } catch (error) {
                    actionSuccess.value = false;
                    showNotification.value = true; 
                        
                    setTimeout(() => {
                        showNotification.value = false;
                        isLoading.value = false; 
                        //this.restoreInitialData();
                        closeModal(); 
                    }, duration.value);
                }
            }
        

            return {
                showModal,
                user,
                allRoles,
                form,
                closeModal,
                icon,
                handleSelectRol,
                getResultMsg,
                getResultType,
                ToastNotification,
                showNotification,
                isLoading,
                addRolUser,
                removeRolUser,
                duration
            }
        }
    }
</script>

<template>
    <CModal :visible="showModal" @close="closeModal">
        <CModalHeader>
            <CModalTitle>Editar Usuario [{{ user.name }}] </CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CForm>
                <label class="mt-3">Rol</label>
                <CRow>
                    <CCol class="col-10">
                        <v-select
                            v-model="form.roles_ids"
                            :options="allRoles"
                            :reduce="rol => rol.id"
                            placeholder="Seleccione..."
                            label="name"
                            @option:selected="addRolUser"
                            @option:deselected="removeRolUser"
                            class="mt-1"
                            multiple
                        >
                        </v-select>
                    </CCol>
                    <template v-if="isLoading">
                        <CCol class="col-2 mt-1">
                            <div class="spinner-border spinner-border-sm text-dark" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </CCol>
                    </template>
                    
                </CRow>
                
            </CForm>
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" @click="closeModal">
                Cerrar
            </CButton>
            <!-- <CButton color="primary" @click="saveRolUser" >Guardar</CButton> -->
        </CModalFooter>
    </CModal>
    <ToastNotification
        v-if="showNotification"
        :type="getResultType()"
        :duration="duration"
        :message="getResultMsg()" 
    />
</template>