<script setup>
import axios from "axios";
import { ref, computed, watch, defineEmits } from "vue";
let prop = defineProps({ skickadinfo: String, visa: Boolean });
let searchParams = ref([]);
let infor = ref({});
let shower = ref(false);
const emit = defineEmits(["hider"]);

function getinfo(ans) {
	axios
		.get(
			`https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&list=search&formatversion=2&explaintext=1&srsearch=${ans}&origin=* `
		)
		.then((res) => {
			searchParams.value = res.data.query.search;
		})
		.catch((error) => {
			alert(`error från get info: ${error.message}`);
		});
}

function getPage(page) {
	axios
		.get(
			`https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&pageids=${page}&origin=*`
		)
		.then((res) => {
			infor.value = res.data.query.pages[page];
			shower.value = true;
		})
		.catch((error) => {
			console.log("error", error);
			alert(`error från get info: ${error.message}`);
		});
}

// kolla om propen visa har ändras, gör den det hämta relevant information. givet att man tryckt på visa
watch(prop, (newX) => {
	if (prop.visa) {
		getinfo(prop.skickadinfo);
	}
});
function hider() {
	emit("hider");
}
const s = ref("https://www.wikipedia.org/wiki/");
</script>
<template>
	<div v-show="prop.visa" class="infromation">
		<h2>INFORMATION</h2>
		{{ prop.skickadinfo }}
		<button class="hider" @click="hider">Close X</button>

		<div v-for="(t, index) in searchParams">
			<h2>
				{{ t.title }}
			</h2>

			<p v-html="t.snippet"></p>
			<button v-show="!shower" @click="getPage(t.pageid)">Läs mer</button>
			<div v-show="infor.pageid == t.pageid && shower">
				<button @click="shower = false">hide text</button>
				<p>
					{{ infor.extract }}
				</p>
			</div>
		</div>
	</div>
</template>
<style>
.infromation {
	position: absolute;
	top: -20%;
	right: 0;
	margin: 20px;
	background-color: rgba(124, 121, 195, 0.373);
	padding: 20px;
	border-radius: 20px;
	border: dotted;
	backdrop-filter: blur(40px);
	overflow-x: scroll;
	max-height: 80vh;
}
.hider {
	position: sticky;
	top: 0px;
}
</style>
