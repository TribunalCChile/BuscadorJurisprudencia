import { defineComponent, h, onMounted, ref, resolveComponent } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useStore } from 'vuex'; 
import axios from 'axios'; 
import { CBadge, CSidebarNav, CNavItem, CNavGroup, CNavTitle } from '@coreui/vue'
import nav from '@/_nav.js'

import simplebar from 'simplebar-vue'
import 'simplebar-vue/dist/simplebar.min.css'

const normalizePath = (path) =>
  decodeURI(path)
    .replace(/#.*$/, '')
    .replace(/(index)?\.(html)$/, '')

const isActiveLink = (route, link) => {
  if (link === undefined) {
    return false
  }

  if (route.hash === link) {
    return true
  }

  const currentPath = normalizePath(route.path)
  const targetPath = normalizePath(link)

  return currentPath === targetPath
}

const isActiveItem = (route, item) => {
  if (isActiveLink(route, item.to)) {
    return true
  }

  if (item.items) {
    return item.items.some((child) => isActiveItem(route, child))
  }

  return false
}

const AppSidebarNav = defineComponent({
  name: 'AppSidebarNav',
  components: {
    CNavItem,
    CNavGroup,
    CNavTitle,
  },
  setup() {
	const store = useStore();
    const route = useRoute();
    const firstRender = ref(true);
    const menuItems = ref([]); 
    
    onMounted(async () => {
		firstRender.value = false;
		/* 
			Se obtiene desde api el menú 
			Luego se formatea según estructura de CoreUI 
		*/
		try {
			const response = await axios.get(
        store.state.backendUrl + '/menu',
        {
          headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + store.state.token,
          }
        }
			);
      console.log(response.data);
			const data = response.data;
      console.log("data desde api", data);

			/* const navTitles = data.map(category => ({
				component: 'CNavTitle',
				name: category.categoria,
				isTitle: true
			})); 
 */
			const formattedMenu = data.map(category => ({
				name: category.categoria,
				to: '/pages',
				icon: `cil-${category.categoria_icon}`,
				items: category.menus.map(item => ({
					component: 'CNavItem',
					name: item.name,
					icon: '',
					to: item.routerTo
				})),
			}));
			menuItems.value = formattedMenu; 
			console.log('Menu formateado: ', menuItems.value);
			
		} catch (error) {
			console.error("Error en response de MENU", error); 
		}

		
    });

    const renderItem = (item) => {
      if (item.items) {
        return h(
          CNavGroup,
          {
            as: 'div',
			class: 'mb-3',
            compact: true,
            ...(firstRender.value && {
              visible: item.items.some((child) => isActiveItem(route, child)),
            }),
          },
          {
            togglerContent: () => [
              h(resolveComponent('CIcon'), {
                customClassName: 'nav-icon',
                name: item.icon,
              }),
              item.name,
            ],
            default: () => item.items.map((child) => renderItem(child)),
          },
        )
      }

      return item.to
        ? h(
            RouterLink,
            {
              to: item.to,
              custom: true,
            },
            {
              default: (props) =>
                h(
                  resolveComponent(item.component),
                  {
                    active: props.isActive,
                    as: 'div',
                    href: props.href,
                    onClick: () => props.navigate(),
                  },
                  {
                    default: () => [
                      item.icon
                        ? h(resolveComponent('CIcon'), {
                            customClassName: 'nav-icon',
                            name: item.icon,
                          })
                        : h('span', { class: 'nav-icon' }, h('span', { class: 'nav-icon-bullet' })),
                      item.name,
                      item.badge &&
                        h(
                          CBadge,
                          {
                            class: 'ms-auto',
                            color: item.badge.color,
                          },
                          {
                            default: () => item.badge.text,
                          },
                        ),
                    ],
                  },
                ),
            },
          )
        : h(
            resolveComponent(item.component),
            {
              as: 'div',
            },
            {
              default: () => item.name,
            },
          )
    }

    return () =>
      h(
        CSidebarNav,
        {
          as: simplebar,
        },
        {
          default: () => menuItems.value.map((item) => renderItem(item)),
        },
      )
  },
})
export { AppSidebarNav }
