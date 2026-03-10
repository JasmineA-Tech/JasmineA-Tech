/*I have neither given nor received unauthorized assistance on this assignment.
 During the prepartion of this assignment, Jasmine Alabi used
ChatGPT in understanding on how to use Local Storage within the JavaScript in order to have the
data be saved within the page after being reloaded. After using this tool, 
I reviewed and edited the content as needed to ensure its accuracy
and take full responsibility for the content in relation to grading.
*/

//Get the references to the form and mood list elemtnts in DOM
const moodForm = document.getElementById("mood-form");
const moodList = document.getElementById("mood-list");

//Event listener for when the page content is fully loaded
document.addEventListener("DOMContentLoaded", function()
{
    //loads the moods from the localStorage when the page happens to load
    loadMoods();

    //Get references to the filter dropdown and add even listener for changes
    const filter = document.getElementById("filter");
    if (filter)
    {
        filter.addEventListener("change", function ()
        {
            //filter moods based on the selected value
            filterMoods(this.value);
        });
    }

    //Get reference to the clear history button and add event listener for click
    const clearButton = document.getElementById("clear-history");
    if (clearButton)
    {
        clearButton.addEventListener("click", function ()
        {
            //will remove the moods from the localStorage and clear the list that is displayed
            localStorage.removeItem("moods");
            moodList.innerHTML = "";
        });
    }
});

//event listener for form submision when a new mood is added
moodForm.addEventListener("submit", function (e) 
{
    //prevents the default form submission behavior
    e.preventDefault();

    //get the selected mood and note value from the form
    const mood = document.getElementById("mood").value;
    const note = document.getElementById("note").value.trim();

    //if the mood is not selected then exit the function
    if (!mood) return; 

    //create an entry object that contains the mood, note, and timestamp
    const entry = 
    {
        mood,
        note,
        timestamp: new Date().toISOString()
    };

    //add the new mood entry to the page and save it to the LocalStorage
    addMoodToPage(entry);
    saveMood(entry); 
    //will reset the form fields
    moodForm.reset();
});


//function that will add mood entry to the page
function addMoodToPage(entry)
{
    //create a new list item element for the mood entry
    const li = document.createElement("li");
    li.className = "mood-item";
    li.dataset.mood = entry.mood;
    li.innerText = `${getMoodEmoji(entry.mood)} ${entry.mood.toUpperCase()} - ${entry.note || "No note"}`;
    
    //Create a delete button for the mood entry for users that don't want it 
    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete"; 
    deleteButton.className = "delete-Button"
    deleteButton.addEventListener("click", function () 
    {
        //Calls the deleteMood function when the button to delete is clicked
        deleteMood(entry.timestamp);
    });

    //append the delete button to the list item and list the item to the mood list
    li.appendChild(deleteButton);
    moodList.appendChild(li);
}


//Function that will filter the moods accordingly from the dropdown to the page
function filterMoods(selectedMood)
{
    //get al the moods items on the page
    const allItems = document.querySelectorAll(".mood-item");
    
    //loop through each mood item and hide or show based on the filter
    allItems.forEach(item =>
    {
        if (selectedMood == "all" || item.dataset.mood === selectedMood)
        {
            item.style.display = "";
        }
        else 
        {
            item.style.display = "none";
        }
    });
}


//This function will get the corresponding emoji for a given mood
function getMoodEmoji(mood)
{
    //return the emoji based on the mood string
    switch (mood)
    {
        case "happy": return "😊";
        case "sad": return "😢";
        case "meh": return "😐";
        case "angry": return "😠";
        default: return "";

    }
}

//function to save a mood entry to the localStorage
function saveMood(entry)
{
    //get the existing moods from the localStorage or initialize an empty array
    let moods = JSON.parse(localStorage.getItem("moods")) || []; 
    //add new mood entry to the array
    moods.push(entry); 
    //save the updated array of moods back to the localStorage
    localStorage.setItem("moods", JSON.stringify(moods));

}

//function to load and display all the saved moods from the localStorage
function loadMoods()
{    
    //retrieve the stored moods from localStorage
    const moods = JSON.parse(localStorage.getItem("moods")) || [];
    //add loaded mood to the page
    moods.forEach(addMoodToPage)
}

/*
Function to delete specific mood entry 
*/
function deleteMood(timestamp)
{
    //get the existing moods from the localStorage
    let moods = JSON.parse(localStorage.getItem("moods")) || [];
    //fitler the mood entry with matching timestamp
    moods = moods.filter(entry => entry.timestamp !== timestamp);
    //save the updated list of moods back to localstorage
    localStorage.setItem("moods", JSON.stringify(moods));
    //clear the displayed mood lsit and reload the moods from the localStorage
    moodList.innerHTML = "";
    moods.forEach(addMoodToPage); 
}