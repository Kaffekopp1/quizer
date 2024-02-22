<script setup>
import Header from "./components/Header-component.vue";
import Footer from "./components/Footer-component.vue";

import { ref } from "vue";

let point = ref(0);
function pointcollect(d) {
	point.value = point.value + d;
}
</script>
<template>
	<Header :point="point" />
	<router-view v-slot="{ Component }">
		<component
			:is="Component"
			v-if="
				Component !== undefined &&
				Component.type.emits &&
				Component.type.emits.indexOf('sendpoint') !== -1
			"
			@sendpoint="pointcollect" />
		<component v-else-if="Component !== undefined" :is="Component" />
	</router-view>
	<!-- <getUser></getUser> -->
	<Footer class="fot" />
</template>

<style scoped>
.fot {
	position: fixed;
	right: 0;
	left: 0;

	bottom: 0;
}
.logo {
	height: 6em;
	padding: 1.5em;
	will-change: filter;
	transition: filter 300ms;
}
.logo:hover {
	filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
	filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
