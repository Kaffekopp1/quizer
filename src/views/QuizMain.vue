<script setup>
import axios from "axios";
import { ref, computed, watch, defineEmits } from "vue";
import { useRoute } from "vue-router";
import { useRouter } from "vue-router";
import Choose from "../components/Choose.vue";
import Information from "../components/Information.vue";
const router = useRouter();

const route = useRoute();

const quizQuestion = ref([]),quizPoints = ref(0), questionNumber = ref(0),finishQuiz = ref(false), answered = ref({
	wasRight: true,
	answered: false,
	yourAnswer: "",
}), visa= ref(false), loading = ref(false)
const emit = defineEmits(["sendpoint"]);


//skicka poängen till headern och visa att spelet är slut
function sendpoint() {
	answered.value.answered = false
	finishQuiz.value = true;
	emit("sendpoint", quizPoints.value);
}

//nollställ poängen och starta ett nytt spel
function nGame(){
	quizPoints.value = 0;
	questionNumber.value = 0;
	finishQuiz.value = false;
	getQuiz();
}

// ta den kategorin som är skickad från url, om ingen kategori finns ta kategori 20.

function findCategory() {
	try {
		let l = JSON.parse(route.params.quizCategory);
		return l.id;
	} catch {
		return 20;
	}
}

// Hämta frågor ifrån opentdb
function getQuiz() {
loading.value = true
	let category = findCategory();
	axios
		.get(
			`https://opentdb.com/api.php?amount=10&type=multiple&category=${category}`
		)
		.then((res) => {;
			quizQuestion.value = res.data.results;
			loading.value = false
		})
		.catch((error) => {
			console.log("error", error);
			alert(
				`jag valde ett kinkigt api, alltid för många calls kolla här: ${error.message},men klicka på ok nedan så slussas du tillbaka till hem och kan välja igen`,router.push("/")
			);
		});
}


// fisher-yates för att blanda svaren
function shuffelAnswers(ar) {
	for (let i = ar.length - 1; i >0; i--){
		const j = Math.floor(Math.random()* (i+1));
		const temp = ar[i]
		ar[i] = ar[j]
		ar[j] = temp;
	}
	return ar;
}

// ta varje fråga och skär bort onödig information så som kategori, lägg sedan in
// rätta svaret tillsammans med de felaktiga svaret i samma array och blanda.
const questionFixed = computed(() => {
	if (quizQuestion?.value) {
		let l = quizQuestion.value.map((l) => {
			//lägg till alla svar i en array även det korrekta
			let arr = [...l.incorrect_answers, l.correct_answer];
			//blanda svaren
			arr = shuffelAnswers(arr);
			return {
				category: l.category,
				question: l.question,
				difficulty: l.difficulty,
				answers: arr,
				correctAnswer: l.correct_answer,
			};
		});
		//returnerar decodeQuiz för att svaren från api hade tecken som ska bort
		return l;
	}
});

// om man svarat rätt ge poäng och visa att svaret var rätt
function answer(answ, que) {
	questionNumber.value++;

	// registrera att frågan är besvarad
	answered.value.answered = true;
	// kolla om svaret är korrekt
	que.correctAnswer == answ ? (quizPoints.value++,
		answered.value.wasRight = true) : (answered.value.yourAnswer = answ,
		answered.value.wasRight = false)

	// ändra svaret till det snare
	answered.value.yourAnswer = answ;
	answered.value.rightAnswer = que.correctAnswer;
}

//kolla så att nr på frågan inte överstiger antalet frågor i quizet, om det gör detta avsluta quizet.
watch(questionNumber, (newX) => {
	if (newX >= questionFixed.value.length) {
		finishQuiz.value = true;
	}
});
// kolla om routen ändrats om den har det, kör findcatee behövs ej längre
// watch(route, (newX) => {
// 	findCategory();
// });
//hämta ett quiz då sidan laddas
getQuiz();
// dölj info
function hideInfo(){
visa.value = ! visa.value
}
</script>

<template>
	<div v-if="loading">LADDAR.....</div>
	<div v-else>

		<h2 v-html="questionFixed[questionNumber]?.category"></h2>

		fråga: {{ questionNumber }} av {{ questionFixed.length }} poäng:
		{{ quizPoints }}
		<div>
			<div class="fin" v-if="finishQuiz">
				<h2>Grattis</h2>
				<p>Du fick {{ quizPoints }} av {{ questionFixed.length }} rätt</p>
				<button @click="nGame">spela</button>
				<Choose></Choose>
			</div>
			<div
			:class="{ wrong: !answered.wasRight, right: answered.wasRight }"
			class="answeded"
			v-if="answered.answered">
			<div class="answeredTextContainer">
				<p>Du svarade:</p>
				<p v-html= "answered.yourAnswer" ></p>
				<p>
					rätt svar var:
					<p v-html="answered.rightAnswer">
					</p>
					<!--br kändes rimligt här:-->
					<button @click="hideInfo" >Läs mer om: <br> <span v-html="answered.rightAnswer"></span></button>
				</p>
				<Information 	@hider="hideInfo"   :skickadinfo="answered.rightAnswer" :visa="visa"/>
			</div>
			<button
			v-if="!finishQuiz"
			@click="answered.answered = !answered.answered">
			Nästa fråga
		</button>
		<button v-else @click="sendpoint">
			Klart
		</button>
	</div>
	<div v-else>
		<h3 v-html="questionFixed[questionNumber]?.question"></h3>
		<div class="answerDiv">
			<button
			v-for="quest in questionFixed[questionNumber]?.answers"
			@click="answer(quest, questionFixed[questionNumber])">
			<p v-html="quest"></p>
		</button>
	</div>
</div>
</div>
</div>
</template>
<style scoped>
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
