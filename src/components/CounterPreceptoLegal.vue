<script>
    import { computed, onMounted, ref, watch } from 'vue'
    import { CIcon } from '@coreui/icons-vue';
    import * as icon from '@coreui/icons';
    export default {
        name: 'Contador Precepto Legal',
        components: {
            CIcon
        },
        props: {
            parameter: Number
        },
        setup(props, context) {
            const parameterId = props.parameter; 
            const counter = ref(1);

            const incrementCounter = () => {
                counter.value++;
                preceptoCounter(); 
            }

            const decrementCounter = () => {
                if (counter.value > 0) {
                    counter.value--;
                    preceptoCounter(); 
                }
                 
            }

            const preceptoCounter = (value) => {
                context.emit('preceptoCounter', {
                    counter: counter.value,
                    parameterId: parameterId,
                })
            }

            return {
                counter,
                icon,
                incrementCounter,
                decrementCounter,
            }
        }
    }
</script>

<template>
    <div class="d-flex counter-container">
        <CButton @click="decrementCounter"><CIcon :icon="icon.cilMinus" size="sm"/></CButton>
        <div class="mt-1">{{ counter }}</div>
        <CButton @click="incrementCounter"><CIcon :icon="icon.cilPlus" size="sm"/></CButton>
    </div>
</template>

<style>
    .counter-container {
            border: 1px solid #4f5d75;
            border-radius: 10px;
            padding: 1px;
            text-align: center;
            margin: 1px;
        }
</style>