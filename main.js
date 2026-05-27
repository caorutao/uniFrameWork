import { createSSRApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import persistedstate from "pinia-plugin-persistedstate";

export function  createApp(){
	const app = createSSRApp(App);
	const pinia = createPinia();
	pinia.use(persistedstate, {
		storage: {
			getItem: (key)=>uni.getStorageSync(key),
			setItem: (key, value) => uni.setStorageSync(key, value),
			removeItem: (key) => uni.removeStorageSync(key)
		}
	});
	app.use(pinia);
	return {
		app,
		pinia
	}
}