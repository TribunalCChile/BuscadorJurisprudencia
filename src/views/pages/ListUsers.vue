
<script>
    import axios from 'axios'; 
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';
    import EditUserModal from '../../components/EditUser.vue';
    import DeleteUserModal from '../../components/DeleteUser.vue';
    import AddParameterModal from '../../components/AddParameterModal.vue';
    import SearchBarFilter from '../../components/SearchBarFilter.vue';

    export default {
        name: 'Listar Usuarios',
        components: {
            CIcon,
            AddParameterModal,
            EditUserModal,
            DeleteUserModal,
            SearchBarFilter
        },
        setup() {
            return {
                icon
            }
            
        }, 
        data() {
            return {
                users: [],
                showDeleteModal: false,
                showAddModal: false,
                showEditModal: false,
                userId: null,
                searchFilter: '',
                
            }
        },
        mounted() {
            this.getUsers();   
        },

        computed: {
            filteredUsers() {
                let filteredUsers = this.users; 

                if (this.searchFilter !== '') {
                    filteredUsers = filteredUsers.filter(user => 
                        user.name.toLowerCase().includes(this.searchFilter.toLowerCase())
                    );
                }

                return filteredUsers; 
            }
        },
        methods: {
            handleSearch(search) {
                this.searchFilter = search; 
            },

            setRolColor(rol) {
                switch(rol) {
                    case 1:
                        return 'danger';
                    case 2:
                        return 'warning';
                    case 3:
                        return 'primary';
                    case 4:
                        return 'success'; 
                    case 5:
                        return 'info';
                }
            },
            
            async getUsers() {
                try {
                    const response = await axios.get(
                        this.$store.state.backendUrl + '/user',
                        { 
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + this.$store.state.token,
                            }
                        }
                    );
                    
                    this.users = response.data;
                    
                } catch (error) {
                    console.error('Error en la solicitud a la API:', error);
                }
            },
            addUser() {
                this.showAddModal = true; 
            },
            editUser(user) {
                this.showEditModal = true;
                this.userId = user; 
            },
            deleteUser(user) {
                this.showDeleteModal = true; 
                this.userId = user; 
            },
            onCloseAdd() {
                this.showAddModal = false;
                this.getUsers(); 
            },
            onCloseEdit() {
                this.showEditModal = false;
                this.getUsers(); 
            },
            onCloseDelete() {
                this.showDeleteModal = false;
                this.getUsers();            
            },
            
        }
    }
</script>

<template>
    
    <CRow>
        <CCol class="col-xl-3">
        </CCol>
        <CCol class="col-xl-6">
            <div class="text-center">
                <h3 class="mt-2 font-home">Usuarios</h3>
            </div>
    
        </CCol>
        <CCol class="col-xl-3">
            <CButton color="success"  class="mt-2 text-white" @click="addUser">
                <CIcon :icon="icon.cilUserPlus" size="lg"/>
                Usuario
            </CButton>
        </CCol>
    </CRow>
    <!-- <div class="mt-5">
        <SearchBarFilter @search="handleSearch" placeholder="Buscar parámetro..." />
    
    </div> -->
    <div>
        <CTable class="mt-4">
            <CTableHead>
                <CTableRow color="dark">
                    <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
                    <CTableHeaderCell class="text-center" scope="col">Email</CTableHeaderCell>
                    <CTableHeaderCell class="text-center" scope="col">Roles</CTableHeaderCell>
                    <CTableHeaderCell class="text-center" scope="col">Acciones</CTableHeaderCell>
                </CTableRow>
            </CTableHead>
            <CTableBody>
                <CTableRow v-for="(user, index) in filteredUsers" :key="user.id">
                    <CTableDataCell>{{ user.name }} </CTableDataCell>
                    <CTableDataCell class="text-center">{{ user.email }} </CTableDataCell>
                    <template v-if="user.roles.length > 0">
                        <template v-for="(rol, index) in user.roles">
                            <CTableDataCell class="text-center">
                                <CButton 
                                    size="sm" 
                                    :color="setRolColor(rol.id)"
                                    variant="outline"
                                    
                                >
                                    {{ rol.name }}
                                </CButton>
                            </CTableDataCell>
                        </template>
                    </template>
                    <template v-else>
                        <CTableDataCell class="text-center">
                            <CButton 
                                size="sm" 
                                color="secondary" 
                                variant="outline"
                            >
                                    NO ASIGNADO
                            </CButton>
                        </CTableDataCell>
                    </template>
                    <CTableDataCell class="text-center">
                        <CButton @click="editUser(user)">
                            <CIcon :icon="icon.cilPen" size="xl"/>
                        </CButton>
                        <CButton @click="deleteUser(user)">
                            <CIcon :icon="icon.cilTrash" size="xl"/>
                        </CButton>
                    </CTableDataCell>
                    
                </CTableRow>
            </CTableBody>
        </CTable>
        <AddParameterModal 
            :showModal="showAddModal"
            @closeAddParameterModal="onCloseAdd"
        />

        <EditUserModal
            :showEditModal="showEditModal"
            @closeEditUserModal="onCloseEdit"
            :user="userId"
        />
        <DeleteUserModal
            :showDeleteModal="showDeleteModal"
            @closeDeleteUserModal="onCloseDelete"
            :user="userId"
        />
    </div>
</template>