//since the variable we are playing with is the energy bar that dynamically changes for every task, lets define it for the full value

let energy = 100;

//grabbing my elements now that is setup on html by id

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
    

//when a task is clicked
function handleTaskClick(taskName) {
    const task = taskData.find((t) => t.task === taskName);
    //look through my json file
    if (!task) return; //for error

    energy -= task.energy_cost;
    if (energy < 0) energy = 0;  //reduce energy, but dont let it go below zero
    updateEnergyUI(); //update energy bar logic
    showFeedback(task.feedback); //return the feedback that i have put
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
    updateEnergyUI();
  });
  
    
  

  