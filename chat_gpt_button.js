// Create the button element
const button = document.createElement("button");
button.innerText = "Submit File";
button.style.backgroundColor = "green";
button.style.color = "white";
button.style.padding = "5px";
button.style.border = "none";
button.style.borderRadius = "5px";
button.style.margin = "5px";

// Create the progress element
const progress = document.createElement("div");
progress.style.width = "99%";
progress.style.height = "5px";
progress.style.backgroundColor = "grey";

// Create the progress bar element
const progressBar = document.createElement("div");
progressBar.style.width = "0%";
progressBar.style.height = "100%";
progressBar.style.backgroundColor = "blue";

// Append the button and progress elements to the DOM
const targetElement = document.querySelector(".flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4");
targetElement.parentNode.insertBefore(button, targetElement);
targetElement.parentNode.insertBefore(progress, targetElement);

// Add event listener to the button
button.addEventListener("click", async () => {
  // Create the file input element
  const fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".txt, .js, .py, .html, .css, .json, .csv";
  
  // Function to handle file selection
  const handleFile = async (file) => {
    const reader = new FileReader();
    
    // Read the file as text
    reader.readAsText(file);
    
    reader.onload = async () => {
      const content = reader.result;
      const chunks = chunkText(content, 15000);
      const numChunks = chunks.length;
      
      for (let i = 0; i < numChunks; i++) {
        const chunk = chunks[i];
        
        // Update the progress bar
        progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;
        
        // Submit the chunk to the conversation
        await submitConversation(chunk, i + 1, file.name);
      }
      
      // Set the progress bar to blue
      progressBar.style.backgroundColor = "blue";
    };
  };
  
  // Listen for file selection
  fileInput.addEventListener("change", (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      handleFile(selectedFile);
    }
  });
  
  // Trigger the file input click event
  fileInput.click();
});

// Function to split text into chunks
function chunkText(text, chunkSize) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

// Function to submit a conversation chunk
async function submitConversation(text, part, filename) {
  const textarea = document.querySelector("textarea[tabindex='0']");
  const enterKeyEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });
  textarea.value = `Part ${part} of ${filename}:\n\n${text}`;
  textarea.dispatchEvent(enterKeyEvent);
}

// Check if chatgpt is ready
let chatgptReady = false;
const checkChatGPT = async () => {
  while (!chatgptReady) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    chatgptReady = !document.querySelector(".text-2xl > span:not(.invisible)");
  }
};

checkChatGPT();
