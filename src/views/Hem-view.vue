<script setup>
import Choose from "../components/Choose-component.vue";
</script>

<template>
	<div>
		<h2>Hem</h2>
		<div class="textDiv">
			<p>
				Välkommen till Peters lilla quiz, under kan du välja kategori så
				skjutsas du raskt över till quizet. I headern här ovan kan du se den
				totala poängen av de quizen du spelat (givet att du inte uppdaterat
				sidan).
			</p>
		</div>
	</div>
	<Choose />
</template>
<style scoped>
.textDiv {
	padding: 20px;
}
</style>
