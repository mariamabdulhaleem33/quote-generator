let quote = document.querySelector(".qoute");
let author = document.querySelector(".author");
let generateBtn = document.querySelector(".regenerate");
let favoritesBtn = document.querySelector(".fav");
let startBtn = document.querySelector(".start-btn");
let pauseBtn = document.querySelector(".pause-btn");
let stopBtn = document.querySelector(".stop-btn");
let showFavBtn = document.querySelector(".show-favorites");
let container = document.querySelector(".container");
const scrollUp = document.getElementById("scrollUp");
const scrollDown = document.getElementById("scrollDown");
let savedSec = document.querySelector(".saved-quotes");

let savedQuotes= JSON.parse(localStorage.getItem("savedQuotes")) || [];
let currentQuote = null;

async function getQuote() {
  const loading = document.getElementById("loading");
  loading.style.display = "block";
  generateBtn.disabled = true;
  quote.textContent = "";
  author.textContent = "";

  try {
    const response = await fetch("https://api.api-ninjas.com/v1/quotes", {
      headers: { 'X-Api-Key': 'hnjTRjQBCxKLP60LsTBmXA==DPO3qew33ivIsFlW' }
    });

    const [data] = await response.json();
    currentQuote = data;

    quote.textContent = currentQuote.quote;
    author.textContent = currentQuote.author;
    favoritesBtn.innerHTML = `<i class="fa-regular fa-heart fa-xl" style="color: #fafd23;"></i>`;
  } catch (error) {
    quote.textContent = "Failed to load quote. Try again.";
    author.textContent = "";
  } finally {
    loading.style.display = "none";
    generateBtn.disabled = false;
  }
}





function checkDuplicates(q, quotesArr){
  return quotesArr.some(el => el?.content === q?.content && el?.author === q?.author);
}

function saveNewQuote() {
  if (!currentQuote){
    showAlert("No quote to save. Please generate one first");
    return;
  }

  savedQuotes = JSON.parse(localStorage.getItem("savedQuotes")) || [];
  
  if (checkDuplicates(currentQuote, savedQuotes)){
    showAlert("You've already added this quote to your favorites.");
    return;
  } 

  savedQuotes.push(currentQuote);
  localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));
  favoritesBtn.innerHTML =`<i class="fa-solid fa-heart fa-xl" style="color: #fafd23;"></i>`;
  showNotification("Quote added to favorites successfully!");
}

addEventListener('load', getQuote);

generateBtn.addEventListener('click', getQuote);

favoritesBtn.addEventListener('click',saveNewQuote);


const synth = window.speechSynthesis;
let currentUtterance = null;

startBtn.addEventListener("click", () => {
  synth.cancel();
  
  currentUtterance = new SpeechSynthesisUtterance();
  currentUtterance.text = `${quote.textContent} by ${author.textContent}`;
  
  synth.speak(currentUtterance);
});

function pauseSpeech() {
  if (synth.paused) {
    synth.resume();  
  } else {
    synth.pause();   
  }
}

function stopSpeech() {
  synth.cancel();   
  currentUtterance = null;
}

pauseBtn.addEventListener('click', pauseSpeech);
stopBtn.addEventListener('click', stopSpeech);


let show = false;

showFavBtn.addEventListener('click', () => {
  show = !show
  if (show){
    savedSec.style.display = "flex";
    container.style.display ="none";
    showFavBtn.innerHTML ="Back";
    showFavBtn.style.alignSelf ="flex-start";
    showFav();
  }else{
    savedSec.style.display = "none";
    container.style.display ="flex";
    showFavBtn.innerHTML ="Show Favorites";
    showFavBtn.style.alignSelf ="center";
    scrollUp.style.display = "none";
    scrollDown.style.display = "none";
  }
})



function showAlert(message){
  const notification = document.getElementById("notification");
  const notificationText = document.getElementById("notification-text");
  const okBtn = document.getElementById("ok-but");

  notification.style.display = "flex";
  okBtn.style.display = "block"

  notificationText.textContent = message;
  okBtn.addEventListener('click', () => {
    notification.style.display = "none";
  })
}

function showNotification(message){
  const notification = document.getElementById("notification");
  const notificationText = document.getElementById("notification-text");
  const okBtn = document.getElementById("ok-but");
  okBtn.style.display = "none";

  notification.style.display = "flex";

  notificationText.textContent = message;

  setTimeout(() => {notification.style.display = "none"},2000);
}

function showFav(){
  savedSec.innerHTML = "";
  if(savedQuotes.length === 0){
    savedSec.textContent ="Your favorites list is empty.";
    savedSec.style.color="white";
    showFavBtn.style.alignSelf="center";
    favoritesBtn.innerHTML =`<i class="fa-regular fa-heart fa-xl" style="color: #fafd23;"></i>`;
  }else{
    savedQuotes.forEach(el => createLi(el.quote));
    isOverFlowing(savedSec);
  }
}

function isOverFlowing(ele){
     setTimeout(()=>{
        if(ele.scrollHeight > ele.clientHeight){
        scrollUp.style.display = "block";
        scrollDown.style.display = "block";
        }else{
            scrollUp.style.display = "none";
            scrollDown.style.display = "none";
        }
    }, 100);
}

function createLi(cont){
  const li = document.createElement("li");
  const delBTN = document.createElement("button");

  delBTN.classList.add("delete");
  delBTN.innerHTML = `<i class="fa-solid fa-trash " style="color: #fafd23;"></i>`;

    delBTN.addEventListener('click', () => {
    li.remove();
    savedQuotes = savedQuotes.filter(q => q.quote !== cont);
    localStorage.setItem("savedQuotes", JSON.stringify(savedQuotes));
    isOverFlowing(savedSec);

    showFav();
  });

  savedSec.appendChild(li);
  li.textContent = cont;
  li.appendChild(delBTN);
}

scrollUp.addEventListener("click", () => {
  savedSec.scrollBy({ top: -50, behavior: "smooth" });
});

scrollDown.addEventListener("click", () => {
  savedSec.scrollBy({ top: 50, behavior: "smooth" });
});