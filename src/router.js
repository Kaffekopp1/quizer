import QuizMain from "./views/Quiz-main.vue";
import Hem from "./views/Hem-view.vue";
import Contact from "./views/Contact-view.vue";
import { createRouter, createWebHistory } from "vue-router";
export default createRouter({
	history: createWebHistory(),
	routes: [
		{ path: "/", component: Hem },
		{ path: "/Quiz/:quizCategory", component: QuizMain },
		{ path: "/contact", component: Contact },
	],
});
