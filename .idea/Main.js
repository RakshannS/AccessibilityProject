//Speech recognition api
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (!SpeechRecognition) {
    alert("Sorry, your browser doesn't support Speech Recognition. Try using Google Chrome.");
}
const recognition = new SpeechRecognition();
//keep listening even after a command is done
recognition.continuous = true;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.onresult = function(event) {
    var command = event.results[event.resultIndex][0].transcript.toLowerCase(); //Speech to text
    console.log('Command received: ' + command); // Log the command for debugging
    var bg = document.querySelector('body');

    //Checks if the transcript contains any commands and executes them
    if (command.includes('nhl') || command.includes('hockey')) {
        showNHL();
    } else if (command.includes('nba') || command.includes('basketball')) {
        showNBA();
    } else if (command.includes('home')) {
        showHome();
    } else if (command.includes('font size')) {
        if(command.includes('big')){
            document.querySelector('.NBA').style.fontSize = '40pt';
            document.querySelector('.NHL').style.fontSize = '40pt';
        } else if (command.includes('reset') || command.includes('normal')) {
            document.querySelector('.NBA').style.fontSize = '20pt';
            document.querySelector('.NHL').style.fontSize = '20pt';
        }
    } else if (command.includes('stats')  || command.includes('scores')) {
        if(document.querySelector('.NBA').style.display === 'flex'){
            document.querySelector('#statsNBA').scrollIntoView({ behavior: 'smooth' });
        } else if(document.querySelector('.NHL').style.display === 'flex'){
            document.querySelector('#statsNHL').scrollIntoView({ behavior: 'smooth' });
        }
    } else if (command.includes('scroll')) {
        if(command.includes('up')){
            window.scrollBy(0,300);
        } else if (command.includes('down')){
            window.scrollBy(0,-300);
        }
    } else if(command.includes('more recent')){
        if(document.querySelector('.NBA').style.display === 'flex'){
            let iframe = document.getElementById("NBAgames");
        } else if(document.querySelector('.NHL').style.display === 'flex'){
            let iframe = document.getElementById("NHLgames");
        }
        iframe.contentWindow.scrollBy({ top: 300, behavior: 'smooth' });
    } else if(command.includes('less recent')){
        if(document.querySelector('.NBA').style.display === 'flex'){
            let iframe = document.getElementById("NBAgames");
        } else if(document.querySelector('.NHL').style.display === 'flex'){
            let iframe = document.getElementById("NHLgames");
        }
        iframe.contentWindow.scrollBy({ top: -300, behavior: 'smooth' });
    }

    if(checkPM()){
        document.querySelector('.transcript').innerHTML ='text transcripted: ' + command;
    }
    console.log('Confidence: ' + event.results[event.resultIndex][0].confidence); //confidence level of what was recognized
}

recognition.onend = function() {
    console.log('Speech recognition ended.');
    if (recActive) {
        console.log('Restarting recognition...');
        recognition.start();
    }
};

function checkPM() {
    const checkbox = document.querySelector('input[name="Physical\\/Motor"]');
    return checkbox.checked;
}

function checkTTS() {
    const checkbox = document.querySelector('input[name="Vision"]');
    return checkbox.checked;
}

function speakAllText() {
    // Get all visible text from body
    const pageText = document.body.innerText;
    const utterance = new SpeechSynthesisUtterance(pageText);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
}

function settings() {
    document.getElementsByClassName("settings")[0].style.display = "block";
}

let recActive = false;
let ttsActive = false;
function saveAndClose() {
    document.getElementsByClassName("settings")[0].style.display = "none";
    if(checkPM()){
        if(!recActive){
            recognition.start();
            recActive = true;
            console.log('Voice command on');
            document.querySelector('.transcript').innerText = 'listening..';
        }
    } else {
        if(recActive){
            recognition.stop();
            recActive = false;
            console.log('Voice command off');
        }
        document.querySelector('.transcript').innerText = '';
    }
    if(checkTTS()){
        if(!ttsActive){
            speakAllText();
        }
    } else {
        if(ttsActive){
            window.speechSynthesis.cancel();
        }
    }
}

function showNHL(){
    document.querySelector('.NHL').style.display = 'flex';
    document.querySelector('.NBA').style.display = 'none';
    document.querySelector('.Home').style.display = 'none';
}

function showNBA(){
    document.querySelector('.NHL').style.display = 'none';
    document.querySelector('.NBA').style.display = 'flex';
    document.querySelector('.Home').style.display = 'none';
}

function showHome(){
    document.querySelector('.Home').style.display = 'block';
    document.querySelector('.NHL').style.display = 'none';
    document.querySelector('.NBA').style.display = 'none';
}

function scroll(){
    console.log("Scrolling..."); // Check if it's called
    window.scrollBy(0,300);
}

document.querySelector('.logo').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default behavior (e.g., link navigating)
    scroll(); // Call the scroll function
});
