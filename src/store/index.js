import { createStore } from 'vuex'

export default createStore({
  	state: {
		sidebarVisible: '',
		sidebarUnfoldable: false,
		theme: 'light',
		token: '',
		name: '',
		backendUrl: 'http://192.168.1.16:8087/api',
		environment: 'Desarrollo',
		template: {},
		ficha: {},
		
  	},
  	mutations: {
		createTemplate(state, payload) {
			state.template = payload; 
		},
		editFicha(state, payload) {
			state.ficha = payload; 
		},
		watchFicha(state, payload) {
			state.ficha = payload; 
		},
		initialiseStore(state) {
			if (localStorage.getItem('access_token')) {
				state.token = localStorage.getItem('access_token');
			}
			if (localStorage.getItem('name')) {	
				state.name = localStorage.getItem('name'); 
			}
			if (state.token == "") {
				return false; 
			}

			return true; 
		},
			saveLogin(state, loginData) {
			state.token = loginData.token; 
			state.name = loginData.name; 

			localStorage.setItem('access_token', loginData.token); 
			localStorage.setItem('name', loginData.name); 
		},

		logOut(state) {
			state.token = ""; 
			state.name = ""; 

			localStorage.removeItem('access_token'); 
			localStorage.removeItem('name'); 
		}, 
		toggleSidebar(state) {
			state.sidebarVisible = !state.sidebarVisible
		},
		toggleUnfoldable(state) {
			state.sidebarUnfoldable = !state.sidebarUnfoldable
		},
		updateSidebarVisible(state, payload) {
			state.sidebarVisible = payload.value
		},
	},
	actions: {},
	modules: {},
})
