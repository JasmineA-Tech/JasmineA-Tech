/*
The daily.js file is the bridge between the frontend and backend
It will talk to the express server api 
This is the frontend logic by being the brain of the user interface. 
It will make fetch() calls to the Express API to save, load, and delete moods 
from the database. 
*/

// Get the references to the form and mood list elements in DOM
const moodForm = document.getElementById("mood-form");
const moodList = document.getElementById("mood-list");

// Event listener for when the page content is fully loaded
document.addEventListener("DOMContentLoaded", function()
{
    // Load moods from the server when the page loads
    loadMoods();

    // Get references to the filter dropdown and add event listener for changes
    const filter = document.getElementById("filter");
    if (filter)
    {
        filter.addEventListener("change", function ()
        {
            filterMoods(this.value);
        });
    }

    // Get reference to the clear history button and add event listener for click
    const clearButton = document.getElementById("clear-history");
    if (clearButton)
    {
        clearButton.addEventListener("click", async function ()
        {
            // Get all moods and delete each one from the database
            const moods = await fetch("/api/moods").then(res => res.json());
            for (const entry of moods)
            {
                await deleteMood(entry.timestamp);
            }
            moodList.innerHTML = "";
        });
    }
});

// Event listener for form submission when a new mood is added
moodForm.addEventListener("submit", async function (e)
{
    e.preventDefault();

    const mood = document.getElementById("mood").value;
    const note = document.getElementById("note").value.trim();

    if (!mood) return;

    const entry =
    {
        mood,
        note,
        timestamp: new Date().toISOString()
    };

    // Save to the server first, then add to the page
    await saveMood(entry);
    addMoodToPage(entry);
    moodForm.reset();
});

// Function that will add mood entry to the page
function addMoodToPage(entry)
{
    const li = document.createElement("li");
    li.className = "mood-item";
    li.dataset.mood = entry.mood;
    li.innerText = `${getMoodEmoji(entry.mood)} ${entry.mood.toUpperCase()} - ${entry.note || "No note"}`;

    const deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete-Button";
    deleteButton.addEventListener("click", async function ()
    {
        await deleteMood(entry.timestamp);
        li.remove();
    });

    li.appendChild(deleteButton);
    moodList.appendChild(li);
}

// Function that will filter the moods accordingly from the dropdown
function filterMoods(selectedMood)
{
    const allItems = document.querySelectorAll(".mood-item");
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

// This function will get the corresponding emoji for a given mood
function getMoodEmoji(mood)
{
    switch (mood)
    {
        case "happy": return "😊";
        case "sad": return "😢";
        case "meh": return "😐";
        case "angry": return "😠";
        default: return "";
    }
}

// Save a mood entry to the server database
async function saveMood(entry)
{
    await fetch("/api/moods",
    {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry)
    });
}

// Load and display all saved moods from the server database
async function loadMoods()
{
    const moods = await fetch("/api/moods").then(res => res.json());
    moods.forEach(addMoodToPage);
}

// Delete a specific mood entry from the server database
async function deleteMood(timestamp)
{
    await fetch(`/api/moods/${encodeURIComponent(timestamp)}`,
    {
        method: "DELETE"
    });
}