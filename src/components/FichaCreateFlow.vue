<script>
    import { onMounted, ref } from 'vue'
    import { useStore } from 'vuex'
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';

    export default {
        name: 'Flujo Creación Ficha',
        props: {
            
        },
        components: {

        },
        setup() {
            const isActive = ref(true);
            return {
                isActive
            } 
        }
    }
</script>

<template>
    <CNav variant="pills" layout="justified">
        <CNavItem>
            <CNavLink href="#" :class="{'custom-active': isActive}">
                Crear Template
            </CNavLink>
        </CNavItem>
        <CNavItem>
            <CNavLink href="#">Crear Ficha</CNavLink>
        </CNavItem>
        <CNavItem>
            <CNavLink href="#">Ver Ficha</CNavLink>
        </CNavItem>
        
    </CNav>
</template>

<style>

.custom-active {
    background-color: #212631;
    color: #ffffff; 
    border-color: #212631; 
}
.custom-active:hover,
.custom-active:focus,
.custom-active:active {
    color: #ffffff !important;
}
</style>