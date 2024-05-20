<script>
    import ToastNotification from './ToastNotification.vue';
    import axios from 'axios'; 

    export default {
        name: 'EditFichaState',
        data() {
            return {
                actionSuccess: false,
                showNotification: false,
                duration: 1500,
                resultMsg: '',
                resultType:'',
                selectedState: null,
                form: {
                    ficha_id: null
                }
            }
        },
        props: {
            showModal: Boolean,
            ficha: Object,
            states: Array            
        },
        components: {
            ToastNotification
        },
        emits: ['closeChangeStateFicha', "update:showModal"],
        watch: {
            states: {
                handler(newValue) {
                    this.setStates(newValue);
                },
                deep: true,
                immediate: true
            },
            showModal(newValue) {
                // Si la modal se cierra, restablecer el valor de showModal
                if (!newValue) {
                    this.$emit('update:showModal');
                }
            },
            
        },
        
        methods: {
            setStates(newValue) {
                console.log(this.states); 
            },
            getResultType() {
                return this.actionSuccess ? 'success' : 'error'; 
            },
            getResultMsg() {
                return this.actionSuccess ? 'Estado de ficha actualizado exitósamente.' : 'Error al actualizar estado de ficha'; 
            },
            restoreInitialData() {
                this.actionSuccess = false; 
                this.showNotification = false; 
                this.selectedState = null;
            },
            closeModal() {
                this.restoreInitialData(); 
                this.$emit('closeChangeStateFicha'); 
                
            },
            async changeStateAxiosRequest(path, ficha_id) {
                console.log(ficha_id); 
                try {
                    const response = await axios.post(
                        `${this.$store.state.backendUrl}/${path}`,
                        ficha_id,
                        {
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    );
                    this.closeModal(); // Cerrar el modal primero
        
                    setTimeout(() => {
                        this.actionSuccess = true;
                        this.showNotification = true;
                        setTimeout(() => {
                            this.showNotification = false;
                        }, this.duration);
                    }, 0);

                } catch(error) {
                    console.error('Error cambio estado: ', error); 
                    this.actionSuccess = false;
                    this.showNotification = true; 
                        
                    setTimeout(() => {
                        this.showNotification = false;
                        //this.restoreInitialData();
                        this.closeModal(); 
                    }, this.duration);
                }
                
                
            },
            async saveState() {
                let actualState = this.ficha.estado_id; 
                let newState = this.selectedState; 
                this.form.ficha_id = this.ficha.id; 

                if (actualState === 1 && newState === 2) {
                    await this.changeStateAxiosRequest('fichaprocesar', this.form); 
                   
                } else if ((actualState === 1 || actualState === 2) && newState === 3) {
                    await this.changeStateAxiosRequest('fichaanular', this.form); 
                    
                } else if (actualState === 3 && newState === 1) {
                    await this.changeStateAxiosRequest('fichareingresar', this.form); 
                    
                } 
                                   
            },
            
        }
    }
</script>

<template>
    <CModal :visible="showModal" @close="closeModal">
        <CModalHeader>
            <CModalTitle>Editar Estado de Ficha [{{ ficha.nombre }}] </CModalTitle>
        </CModalHeader>
        
           
            <CForm>
                <CModalBody>
                    <div
                        
                        class="d-flex justify-content-center mx-auto"
                    >
                    <CButton
                        v-for="state in states"
                        :key="state.id"
                        :class="{ 'btn-secondary': selectedState === state.id, 'btn-outline-secondary': selectedState !== state.id }"
                        class="mr-5"
                        @click="() => { selectedState = state.id }"
                    >
                        {{ state.nombre }}
                    </CButton>
                        
                    </div>
                    
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" @click="closeModal">
                        Cerrar
                    </CButton>
                    <CButton color="success" class="text-white" @click="saveState">Guardar</CButton>
                </CModalFooter>
                
            </CForm>
        
    </CModal>
    <ToastNotification
        v-if="showNotification"
        :type="getResultType()"
        :duration="duration"
        :message="getResultMsg()" 
    />
</template>