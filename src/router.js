import QuizMain from "./views/QuizMain.vue";
import Hem from "./views/Hem.vue";
import Contact from "./views/Contact.vue";
import { createRouter, createWebHistory } from "vue-router";
export default createRouter({
	history: createWebHistory(),
	routes: [
		{ path: "/", component: Hem },
		{ path: "/Quiz/:quizCategory", component: QuizMain },
		{ path: "/contact", component: Contact },
	],
});
