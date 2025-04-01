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
  
    // update energy bar logic
    updateEnergyUI();
  
    // return the feedback that I have put
    showFeedback(task.feedback);
  
    // If my energy hits zero for the first time, then message is
    if (energy === 0 && cutoffMessage.textContent === "") {
      cutoffMessage.textContent = `You ran out of energy by ${task.time}. A non-diabetic person still had ${normalEnergy}% left.`;
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


//last but not the least, show the feedback text
function showFeedback(feedback) {
    const p = document.createElement("p");
    p.textContent = feedback;
    feedbackBox.appendChild(p);
  }
  

  //to reset the energy bar to 100 again
  document.getElementById("restart-day").addEventListener("click", () => {
    energy = 100;
    normalEnergy = 100;
    updateEnergyUI();
    feedbackBox.innerHTML = "";
    cutoffMessage.textContent = "";
  });
  
    
  

  