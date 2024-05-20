export default [
  
  {
    component: 'CNavTitle',
    name: 'Buscador Jurisprudencia',
  },
  {
    component: 'CNavItem',
    name: 'Buscador',
    to: '/buscador',
    icon: 'cil-search',
  },

  
  {
    component: 'CNavTitle',
    name: 'Documentos',
  },

  {
    component: 'CNavGroup',
    name: 'Templates',
    to: '/pages',
    icon: 'cil-book',
    items: [
      {
        component: 'CNavItem',
        name: 'Ver Fichas',
        to: '/fichas',
        icon: 'cil-search',
      },
      {
        component: 'CNavItem',
        name: 'Ver Templates',
        icon: 'cil-search',
        to: '/templates',
      },
      {
        component: 'CNavItem',
        name: 'Crear Template',
        icon: 'cil-plus',
        to: '/parametros',
      },
      
    
      
    ],
  },
  {
    component: 'CNavTitle',
    name: 'Mantenedores',
  },
  {
    
    component: 'CNavGroup',
    name: 'Mantenedores',
    to: '/pages',
    icon: 'cil-cog',
    items: [
      {
        component: 'CNavItem',
        name: 'Parámetros',
        to: '/listar-parametros',
      },
      {
        component: 'CNavItem',
        name: 'Tipos de datos',
        to: '/listar-tipo-dato',
      },
        
        
        
    ],
  },
  

  // {
  //   component: 'CNavItem',
  //   name: 'Download CoreUI',
  //   href: 'http://coreui.io/vue/',
  //   icon: { name: 'cil-cloud-download', class: 'text-white' },
  //   _class: 'bg-success text-white',
  //   target: '_blank'
  // },
  // {
  //   component: 'CNavItem',
  //   name: 'Try CoreUI PRO',
  //   href: 'http://coreui.io/pro/vue/',
  //   icon: { name: 'cil-layers', class: 'text-white' },
  //   _class: 'bg-danger text-white',
  //   target: '_blank'
  // }
]
