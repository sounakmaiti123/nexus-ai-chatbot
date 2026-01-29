const input = document.querySelector(".input-area input");
const chatBox = document.querySelector(".chat-box");
const sendBtn = document.querySelector(".icon-send");

// Send on button click
sendBtn.addEventListener("click", sendMessage);

// Send on Enter key
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  // Remove welcome screen if present
  const emptyState = document.querySelector(".empty-state");
  if (emptyState) emptyState.remove();

  // Add user message
  addMessage(text, "user");
  input.value = "";

  // Add AI placeholder
  const aiMsg = addMessage("Thinking...", "ai");

  try {
    const response = await fetch("http://127.0.0.1:8000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: text })
    });

    if (!response.ok) {
      throw new Error("Server error");
    }

  const data = await response.json();
console.log("AI response:", data);
if (data.reply) {
  aiMsg.textContent = data.reply;
} else if (data.error) {
  aiMsg.textContent = "⚠️ " + data.error;
} else {
  aiMsg.textContent = "⚠️ No response from AI.";
}


  } catch (err) {
    aiMsg.textContent = "⚠️ Error connecting to server.";
    console.error(err);
  }
}


function addMessage(text, role) {
  const div = document.createElement("div");
  div.className = `message ${role}`;
  div.textContent = text;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
  return div;
}
