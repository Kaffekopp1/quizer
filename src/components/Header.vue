<script setup>
// ta emot poängen.
defineProps({ point: Number });
</script>

<template>
	<div>
		<nav>
			<ul>
				<li><router-link to="/">Hem</router-link></li>
				<li>
					<router-link to='/Quiz/{"id":9,"name":"General Knowledge"}'
						>Quiz</router-link
					>
				</li>
				<li><router-link to="/contact">Contact</router-link></li>
				<li>Total Poäng: {{ point }}</li>
			</ul>
		</nav>
		<h2>Quizer</h2>
	</div>
</template>

<style scoped>
ul {
	display: flex;
	gap: 20px;
}

li {
	list-style: none;
}
</style>
