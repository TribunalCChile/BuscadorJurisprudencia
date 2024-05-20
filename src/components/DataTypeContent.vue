<script>
    import axios from 'axios'; 
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';
    import EditContentDataTypeModal from './EditContentDataTypeModal.vue';
    import DeleteContentDataTypeModal from './DeleteContentDataTypeModal.vue';
    import AddDataTypeContentModal from './AddDataTypeContentModal.vue';
    
	  export default {
        name: 'DataTypeContent',
        emits: ['updateDataType'],
        components: {
        	CIcon,
          EditContentDataTypeModal,
          DeleteContentDataTypeModal,
          AddDataTypeContentModal,
        },
        setup() {
            return {
                icon
            } 
        }, 
        props: {
            detail: Object
        },
        
        data() {
            return {
                dataTypeContent: [],
                datatypeContentId: null,
                showEditContentModal: false,
                showDeleteContentModal: false,
                showAddContentModal: false,
                dataTypeDetail: null
            }
        },
        

        methods: {
          updateContentData() {
            this.$emit('updateDataType')
          },
          addDataTypeContent() {
            this.showAddContentModal = true;
            this.dataTypeDetail = this.detail; 
          
          },
          editContent(datatype) {
            this.showEditContentModal = true;
            this.datatypeContentId = datatype; 
          },
          deleteContent(datatype) {
            this.showDeleteContentModal = true;
            this.datatypeContentId = datatype;  
          },
          onCloseEdit() {
            this.showEditContentModal = false;
          },
          onCloseDelete() {
            this.showDeleteContentModal = false; 
          },
          onCloseAdd() {
            this.showAddContentModal = false;
        
            
          }
        }
}
</script>

<template>
    <CTable>
  <CTableHead color="dark">
	<CTableRow>
        <CTableHeaderCell scope="col">Tabla de elementos</CTableHeaderCell>
        <CTableHeaderCell scope="col" class="text-center">
			<CButton @click="addDataTypeContent" color="primary" class="mr-4">
                Agregar
            </CButton>
    	</CTableHeaderCell>
        </CTableRow>
    <CTableRow color="dark">
      <CTableHeaderCell scope="col">Nombre</CTableHeaderCell>
      <CTableHeaderCell scope="col" class="text-center">Acciones</CTableHeaderCell>
    </CTableRow>
	
  </CTableHead>
  <CTableBody>
    <template v-if="detail.tipo_dato_contenido.length">
      <CTableRow v-for="element in detail.tipo_dato_contenido" :key="element.id">
        <CTableDataCell>{{ element.nombre }}</CTableDataCell>
        <CTableDataCell class="text-center">
          <CButton @click="editContent(element)">
            <CIcon :icon="icon.cilPen" size="xl"/>
          </CButton>
          <CButton @click="deleteContent(element)">
            <CIcon :icon="icon.cilTrash" size="xl"/>
          </CButton>
        </CTableDataCell>
      </CTableRow>
    </template>
    <template v-else class="ml-5">
      <h5 class="text-center mt-4">No hay elementos para mostrar.</h5>
    </template>
    
    
  </CTableBody>
</CTable>
	<AddDataTypeContentModal
        :showAddModal="showAddContentModal"
        @closeAddModal="onCloseAdd"
        @updateContentData="updateContentData"
        :dataTypeDetail="dataTypeDetail"
       
    />
	<EditContentDataTypeModal
        :showEditModal="showEditContentModal"
        @closeEditModal="onCloseEdit"
        @updateContentData="updateContentData"
        :datatype="datatypeContentId"
    />
    <DeleteContentDataTypeModal
        :showDeleteModal="showDeleteContentModal"
        @closeDeleteModal="onCloseDelete"
        @updateContentData="updateContentData"
        :datatype="datatypeContentId"
    /> 

</template>