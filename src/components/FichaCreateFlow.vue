<script>
    import { onMounted, ref } from 'vue'
    import { useStore } from 'vuex'
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';
    import { useRoute } from 'vue-router'; 

    export default {
        name: 'Flujo Creación Ficha',
        setup(props) {
            const route = useRoute(); 
            
            const isActive = (path) => {
                return route.path.split('/')[1] === path; 
            } 
            return {
                isActive,
                route,
            } 
        }
    }
</script>

<template>
    <CNav variant="underline-border" layout="justified" class="mb-4">
        <CNavItem>
            <CNavLink href="#" :class="{'custom-active': isActive('parametros')}">
                Crear Template
            </CNavLink>
        </CNavItem>
        <CNavItem>
            <CNavLink href="#" :class="{'custom-active': isActive('crear-ficha')}">Crear Ficha</CNavLink>
        </CNavItem>
        <CNavItem>
            <CNavLink href="#" id="fichaView" :class="{'custom-active': isActive('ver-ficha')}">Ver Ficha</CNavLink>
        </CNavItem>
        
    </CNav>
</template>

<style>

.custom-active {
    background-color: #3DAD5B;
    color: #ffffff; 
    border-color: #3DAD5B; 
}
.custom-active:hover,
.custom-active:focus,
.custom-active:active {
    color: #ffffff !important;
}
</style>