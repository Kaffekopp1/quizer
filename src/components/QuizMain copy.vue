<!--DU KAN BORTSE FRÅN DENNA VUE; JAG VILLE BEHÅLLA KODEN KRING DECODED QUIZ -->

<script setup>
import axios from "axios";
import { ref, computed, watch, defineEmits } from "vue";
import { useRoute } from "vue-router";
import Choose from "./Choose.vue";
const route = useRoute();

// Accessing route parameters
const routeParams = route.params;

const quizQuestion = ref([]);
const quizPoints = ref(0);
const questionNumber = ref(0);
const finishQuiz = ref(false);
const answered = ref({
	wasRight: true,
	answered: false,
	yourAnswer: "",
});

// let testar = ref("tt");

const emit = defineEmits(["sendpoint", "quizPoints"]);

function sendpoint() {
	finishQuiz.value = false;
	questionNumber.value = 0;
	emit("sendpoint", quizPoints.value);
	quizPoints.value = 0;
	getQuiz();
}

const selectedCategoryobj = () => {
	console.log("routeParams.quizCategory", routeParams.quizCategory);
	try {
		let l = JSON.parse(routeParams.quizCategory);
		return l;
	} catch (e) {
		return { name: "Mytologi" };
	}
};

//TODO "Watch vilken kategori" du valt från choose // nollställ poäng // vuerouter från vad?

function findCategory() {
	try {
		let l = JSON.parse(route.params.quizCategory);
		return l.id;
	} catch {
		return 20;
	}
}

function getQuiz() {
	let category = findCategory();
	console.log("xat", category);
	axios
		.get(
			`https://opentdb.com/api.php?amount=10&type=multiple&category=${category}`
		)
		.then((res) => {
			console.log("resultat", res.data.results);
			quizQuestion.value = res.data.results;
		})
		.catch((error) => {
			console.log("error", error);
			alert(
				`jag valde ett kinkigt api, alltid för många calls kolla här: ${error.message}`
			);
		});
}
//quizen kommer med olika typer av html tecken kolla detta för decodning:
// https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
function decodeQuiz(quiz) {
	try {
		const decodedArray = quiz.map((quizItem) => {
			const decoded = {};
			for (const [key, value] of Object.entries(quizItem)) {
				const parser = new DOMParser();
				const decodedString = parser.parseFromString(
					`<!doctype html><body>${value}`,
					"text/html"
				).body.textContent;
				decoded[key] = decodedString;
			}
			//splittar answer för att få svaren i en array
			decoded.answers = decoded.answers.split(",");
			//vissa frågor innehöll , tecken jag gör det elementet till falskt.
			if (decoded.answers.length > 4) {
				return false;
			}
			return decoded;
		});
		//filtrerar ut de falska elementen, dvs de med felaktiga svar.
		return decodedArray.filter((x) => x);
	} catch (ca) {
		console.log("catched", ca);
	}
}
function test() {
	console.log("test");
	console.log(route.params);
	routeParams.value = route.params;
	console.log(routeParams.value);
	findCategory();
}
function test2() {
	console.log("test2");
	finishQuiz.value = true;
	// quizPoints.value = 5;
	// emit("sendpoint", quizPoints.value);
}

// fisher-yates för att blanda svaren
function shuffleArray(ar) {
	for (let i = ar.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		const temp = ar[i];
		ar[i] = ar[j];
		ar[j] = temp;
	}
	return ar;
}

// ta varje fråga och skär bort onödig information så som kategori, lägg sedan in
// rätta svaret tillsammans med de felaktiga svaret i samma array och blanda.
const questionFixed = computed(() => {
	if (quizQuestion?.value) {
		//returnerar decodeQuiz för att svaren från api hade tecken som ska bort
		return decodeQuiz(
			quizQuestion.value.map((l) => {
				//lägg till alla svar i en array även det korrekta
				let arr = [...l.incorrect_answers, l.correct_answer];
				//blanda svaren
				arr = shuffleArray(arr);
				return {
					category: l.category,
					question: l.question,
					difficulty: l.difficulty,
					answers: arr,
					correctAnswer: l.correct_answer,
				};
			})
		);
	}
});

function answer(answ, que) {
	questionNumber.value++;
	answered.value.answered = true;
	// check if answer is correkt
	if (que.correctAnswer == answ) {
		quizPoints.value++;
		answered.value.wasRight = true;
	} else {
		answered.value.yourAnswer = answ;
		answered.value.wasRight = false;
	}
	answered.value.yourAnswer = answ;
	answered.value.rightAnswer = que.correctAnswer;

	console.log(answ, que.correctAnswer);
}

//kolla så att nr på frågan inte överstiger antalet frågor
watch(questionNumber, (newX) => {
	if (newX >= questionFixed.value.length) {
		console.log("ALL QUESTIN AR QNUEISNA");
		finishQuiz.value = true;
	}
});
watch(route, (newX) => {
	findCategory();
});
getQuiz();
</script>
<template>
	<h2>{{ questionFixed[questionNumber]?.category }}</h2>

	fråga: {{ questionNumber }} av {{ questionFixed.length }} poäng:
	{{ quizPoints }}
	<button @click="test()">Test</button>
	<button @click="test2()">Test2</button>
	<div>
		<div class="fin" v-if="finishQuiz">
			<h2>Grattis</h2>
			<p>Du fick {{ quizPoints }} av {{ questionFixed.length }} rätt</p>
			<button @click="sendpoint">Spela igen</button>
			<Choose></Choose>
		</div>
		<div
			:class="{ wrong: !answered.wasRight, right: answered.wasRight }"
			class="answeded"
			v-if="answered.answered">
			<div class="answeredTextContainer">
				<p>Du svarade {{ answered.yourAnswer }}</p>
				<p>
					rätt svar var:
					{{ answered.rightAnswer }}
				</p>
			</div>
			<button
				v-if="!finishQuiz"
				@click="answered.answered = !answered.answered">
				Nästa fråga
			</button>
			<button v-else @click="answered.answered = !answered.answered">
				Klart
			</button>
		</div>
		<div v-else>
			<h3>Fråga: {{ questionFixed[questionNumber]?.question }}</h3>
			<div class="answerDiv">
				<button
					v-for="quest in questionFixed[questionNumber]?.answers"
					@click="answer(quest, questionFixed[questionNumber])">
					{{ quest }}
				</button>
			</div>
		</div>
	</div>
</template>
<style>
.wrong {
	border-color: red;
}
.right {
	border-color: blue;
}
.answeded {
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	margin-left: auto;
	margin-right: auto;
	background-color: #242424;
	border-style: dotted;
	border-radius: 20px;
	left: 0;
	right: 0;
	top: 100px;
	height: 50vh;
	width: 50vw;
	text-align: center;
	padding: 20px;
}
.answeredTextContainer {
	margin: 20px;
}
.fin {
	border: solid;
	padding: 20px;
	border-style: dotted;
	border-radius: 20px;
}
.answerDiv {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 20px;
}
</style>
