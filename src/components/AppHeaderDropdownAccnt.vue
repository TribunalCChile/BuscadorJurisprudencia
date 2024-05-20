<template>
  <CDropdown placement="bottom-end" variant="nav-item">
    <CDropdownToggle class="py-0 pe-0" :caret="false">
      <CAvatar :src="avatar" size="lg" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      
      <CDropdownHeader
        component="h6"
        class="bg-body-secondary text-body-secondary fw-semibold my-2"
      >
        Ajustes
      </CDropdownHeader>
      <!-- <CDropdownItem>
        <CButton @click="logout()">
          <CIcon icon="cil-user" /> Perfil
          
        </CButton>
        
      </CDropdownItem> -->
      
      <CDropdownDivider />
      
      <CDropdownItem>
        <CButton @click="logout()">
          <CIcon icon="cil-lock-locked" />
          Cerrar sesión
        </CButton>
        
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>

<script>
import avatar from '@/assets/brand/tc-negro.webp'
export default {
  name: 'AppHeaderDropdownAccnt',
  setup() {
    return {
      avatar: avatar,
      itemsCount: 42,
    }
  },

  methods: {
    logout() {
      this.$store.commit('logOut')
      this.$router.push('/auth/login')
    },
  }
}
</script>
