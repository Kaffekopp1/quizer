<script setup>
import { ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
const router = useRouter(),
	categoru = ref({}),
	selectedCategory = ref({});

// omvandla den valda kategorin till en string.
const selectedCategoryString = computed(() =>
	JSON.stringify(selectedCategory.value.option)
);

//hämta möjliga quiz kategorier:
function getCategories() {
	fetch("https://opentdb.com/api_category.php")
		.then((response) => response.json())
		.then((result) => {
			categoru.value = result;
		});
}

// kolla när kategorin ändras och när det sker byt sida till quizet med den valda kategorin stringified
// här hade det varit lämpligt att köra json stringify direkt men jag ville få med extra.
watch(selectedCategory, () => {
	router.push(`/Quiz/${selectedCategoryString.value}`);
});
getCategories();
</script>
<template>
	<div>
		<h2>Välj en kategori</h2>
		<select v-model="selectedCategory">
			<option
				v-for="(option, index) in categoru.trivia_categories"
				:key="index"
				:value="{ option }">
				{{ option.name }}
			</option>
		</select>
		<div>
			<div>
				<p>välj kategori ovan</p>
			</div>
		</div>
	</div>
</template>
