<template>
    <div>
        <CFormInput @input="search" 
            :placeholder="placeholder" 
            aria-label="busquedaInput"
            class="rounded-search-input"
            
        />
    </div>
</template>

<script setup>
     import { defineProps, defineEmits } from 'vue';

    const props = defineProps({
        placeholder: String
    });
    const emit = defineEmits(['search']); 
     
    const search = (e) => {
        emit('search', e.target.value);
    }
</script>

<style>
    .rounded-search-input {
    border-radius: 50px !important; /* Esto hace que el borde sea redondeado */
    padding: 10px 20px; /* Ajusta el padding para que se vea bien */
    border: 1px solid #ccc; /* Opcional: color del borde */
    box-shadow: 0 1px 2px rgba(32, 33, 36, 0.28); /* Sombra similar a la de Google */
    outline: none; /* Elimina el borde azul al hacer clic */
    transition: box-shadow 0.3s ease-in-out; /* Suaviza el cambio de sombra */
    }

    .rounded-search-input:focus {
    box-shadow: 0 1px 6px rgba(32, 33, 36, 0.48); /* Sombra más intensa al enfocar */
    }
</style>