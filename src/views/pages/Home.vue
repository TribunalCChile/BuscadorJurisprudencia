<script>
    import { onMounted, ref } from 'vue'
    import { useStore } from 'vuex'
    import axios from 'axios'; 
    import  logoTC  from '@/assets/brand/tc-negro.webp'
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';

    export default {
        name: 'Inicio',
        components: {
            CIcon
        },
        props: {},
        setup() {
            return {
                logoTC,
                icon
            }
        }
    }
</script>

<template>
    <section>
        <CImage align="center" custom-class-name="sidebar-brand-full" :src="logoTC" rounded  width="250" class="mt-5"/>
        <div class="text-center mt-4 mb-5">
            <h3 class="font-home">Dashboard Buscador de Jurisprudencia</h3>
            <h5 class="font-home text-secondary">Sistema para administrar causas de jurisprudencia.</h5>
        </div>
        <div class="mt-4" style="text-align: center;">
            <ul style="padding: 0 0 0 20px; display: inline-block; text-align: left;">
                <li class="font-home size-font-home">Creación, edición y vista de fichas</li>
                <li class="font-home size-font-home">Creación, edición y vista de templates</li>
                <li class="font-home size-font-home">Administración de usuarios y perfiles</li>
            </ul>
        </div>


        <!-- <div class="container mt-5">
        <div class="row text-center">
            <div class="col"></div>
            <div class="col">
            <button class="btn btn-primary btn-block rounded-pill">Botón 1</button>
            </div>
            <div class="col">
            <button class="btn btn-secondary btn-block rounded-pill">Botón 2</button>
            </div>
            <div class="col"></div>
        </div>
        </div> -->




        
    </section>


    

</template>

<style>
    body {
        background-color: #ffffff !important;
    }

    .font-home {
        font-family: "Montserrat", sans-serif;
        font-optical-sizing: auto;
        font-weight: 600; 
        font-style: normal;
    }
    .size-font-home {
        font-size: 18px;
    }
    .btn-circle {
        width: 45px;
        height: 45px;
        line-height: 45px;
        text-align: center;
        padding: 0;
        border-radius: 50%;
        }

    .btn-circle i {
        position: relative;
        top: -1px;
    }
    .btn-circle-xl {
        width: 70px;
        height: 70px;
        line-height: 70px;
        font-size: 1.3rem;
    }
    
</style>