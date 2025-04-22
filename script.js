
//to have latest time on system crash modal
const clickedTimes = [];


//clickcount0 for metadata nav bar
let clickedCount = 0;


//since the variable we are playing with is the energy bar that dynamically changes for every task, lets define it for the full value

let energy = 100;
let normalEnergy = 100;




//grabbing normal energy level elements from HTML by ID
const normalEnergyBar = document.getElementById("normal-energy-bar");
const normalEnergyValue = document.getElementById("normal-energy-value");
const cutoffMessage = document.getElementById("cutoff-message");

//grabbing my t1d elements now that is setup on html by id
const energyBar = document.getElementById("energy-bar");
const energyValue = document.getElementById("energy-value");
const feedbackBox = document.getElementById("feedback");

//now we need to hold the JSON value (an empty list)
let taskData = [];

//fetch function to get stuff from JSON file, convert it usable data and then store it in the variable we created above

fetch("t1d-tasks.json")
  .then((res) => res.json())
  .then((data) => {
    taskData = data;
    setupButtons();
  })
  .catch((err) => {
    console.error("Failed to load JSON:", err); //just so  if there's an error we catch it
  });

  //cool, now that data is here, lets setup the buttons we interact with
  function setupButtons() {
    const buttons = document.querySelectorAll("#task-buttons button");
// when button is clicked, get the resp task and call this handletask func
    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
          const taskName = btn.dataset.task;
          btn.disabled = true;
          handleTaskClick(taskName);
        });
      });
    }
    

    
/// when a task is clicked
function handleTaskClick(taskName) {
    const task = taskData.find((t) => t.task === taskName);
    // look through my json file
    if (!task) return; // for error
  
    // Subtract energy for both T1D (me) and normal user
    energy -= task.energy_cost;
    normalEnergy -= task.normal_energy_cost;
  
    // reduce energy, but don’t let it go below zero
    if (energy < 0) energy = 0;
    if (normalEnergy < 0) normalEnergy = 0;


    //trying to dynamic metadata nav bar
    clickedCount++;


  
    // update energy bar logic
    updateEnergyUI();
  

//function to dynamic metadata navbar
document.getElementById("sim-time").textContent = `Time: ${task.time}`;
document.getElementById("tasks-done").textContent = `Tasks: ${clickedCount}/5`;


clickedTimes.push(task.time); //to update system crash modal time

let breakdown = "Stable";
let breakdownClass = "stable";
if (energy < 60) {
  breakdown = "Slight fatigue";
  breakdownClass = "fatigue";
}
if (energy < 30) {
  breakdown = "Crying for help";
  breakdownClass = "crash";
}

const breakdownEl = document.getElementById("breakdown");
breakdownEl.textContent = `Breakdown: ${breakdown}`;
breakdownEl.className = breakdownClass;





    // return the feedback that I have put
    showFeedback(task.feedback);



  
    // If my energy hits zero for the first time, then message is
    if (energy === 0 && cutoffMessage.textContent === "") {
      // cutoffMessage.textContent = `You ran out of energy by ${task.time}. A non-diabetic person still had ${normalEnergy}% left.`;
      const sortedTimes = clickedTimes.sort(
        (a, b) => new Date("1970/01/01 " + a) - new Date("1970/01/01 " + b)
      );
      const latestTime = sortedTimes[sortedTimes.length - 1];
      
      cutoffMessage.textContent = `You ran out of energy by ${latestTime}. A non-diabetic person still had ${normalEnergy}% left.`;
      
      triggerSystemCrash();
    }
  }
  
    



 //energy bar function and logic
 function updateEnergyUI() {
    energyValue.textContent = `Energy: ${energy}`; //update energy bar value
    energyBar.style.width = `${energy}%`; //visually shrink the energy bar

    //playing with UI visuals - might not keep it
    if (energy > 60) {
        energyBar.style.background = "green";
      } else if (energy > 30) {
        energyBar.style.background = "orange";
      } else {
        energyBar.style.background = "red";
      }

      // Normal bar update
        normalEnergyValue.textContent = `Energy: ${normalEnergy}`;
        normalEnergyBar.style.width = `${normalEnergy}%`;
    }


//make breakdown = stable at start always on page load
const breakdownEl = document.getElementById("breakdown");
breakdownEl.textContent = "Breakdown: Stable";
breakdownEl.className = "stable";



//last but not the least, show the feedback text
// function showFeedback(feedback) {
//     const p = document.createElement("p");
//     p.textContent = feedback;
//     feedbackBox.appendChild(p);
//   }
  
function showFeedback(feedback) {
  if (Array.isArray(feedback)) {
    feedback.forEach((line, index) => {
      setTimeout(() => {
        const p = document.createElement("p");
        p.textContent = line;
        feedbackBox.appendChild(p);
      }, index * 800);
    });
  } else {
    const p = document.createElement("p");
    p.textContent = feedback;
    feedbackBox.appendChild(p);
  }
}








  //to reset the energy bar to 100 again
  document.getElementById("restart-day").addEventListener("click", () => {
    energy = 100;
    normalEnergy = 100;
    updateEnergyUI();
    feedbackBox.innerHTML = "";
    cutoffMessage.textContent = "";

    // go through all buttons and remove disabled attribute
    btns.forEach(btn => btn.disabled = false)
  });
  
    
  




  
// Entry Modal Logic
const entryModal = document.getElementById("entryModal");
const startBtn = document.getElementById("startSimulation");
const closeEntry = document.getElementById("closeEntry");

// Show on load
window.onload = () => {
  entryModal.style.display = "flex";
};

startBtn.onclick = () => {
  entryModal.style.display = "none";
};

// Exit Modal Logic
const exitModal = document.getElementById("exitModal");
const resetBtn = document.getElementById("resetExperience");
const closeExit = document.getElementById("closeExit");

function triggerSystemCrash() {
  exitModal.style.display = "flex";
}

// Demo reset (you can update this to refresh or restart simulation)
resetBtn.onclick = () => {
  exitModal.style.display = "none";
  location.reload(); // or reset your variables
};

// Optional: close buttons
closeEntry.onclick = () => entryModal.style.display = "none";
closeExit.onclick = () => exitModal.style.display = "none";







// function addPill(text) {
//     const container = document.getElementById('pill-container');
//     const pill = document.createElement('div');
//     pill.className = 'pill';
//     pill.innerText = text;
//     container.appendChild(pill);
  
//     // Optionally remove after it falls
//     setTimeout(() => {
//       pill.remove();
//     }, 4000);
//   }
  
//   // Example: trigger a pill
//   addPill("Woke up groggy from a sugar crash");
  



//live clock? asked gpt to help
function updateClock() {
  const now = new Date();
  const hours = now.getHours() % 12 || 12;
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");
  const ampm = now.getHours() >= 12 ? "PM" : "AM";
  const timeStr = `Time: ${hours}:${minutes}:${seconds} ${ampm}`;
  document.getElementById("sim-time").textContent = timeStr;
}

setInterval(updateClock, 1000); // update every second
updateClock(); // initial call



//random glucose calculator lol
let glucose = 146;

function updateGlucose() {
  const change = Math.floor(Math.random() * 11) - 5; // -5 to +5
  glucose = Math.max(70, glucose + change); // keep it realistic
  document.getElementById("glucose-level").textContent = `Glucose: ${glucose} mg/dL`;
}

setInterval(updateGlucose, 1000);
updateGlucose(); // initial

