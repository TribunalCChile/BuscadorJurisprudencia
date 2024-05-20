<script>
    import { useToast } from "vue-toastification";
    export default {
        name: 'ToastNotification',
        props: {
            type: String,
            duration: Number,
            message: String
        },
        data() {
            return {
                toast: null
            }
        },
        created() {
            this.toast = useToast(); 
            this.showToast(); 
        },

        methods: {
            showToast() {
                switch(this.type) {
                    case 'success':
                        this.toast.success(this.message, {
                            timeout: this.duration
                        });
                        break;

                    case 'error': 
                        this.toast.error(this.message, {
                            timeout: this.duration
                        });
                        break;
                }
                
            }
        }
    }
</script>

<template>
    
</template>