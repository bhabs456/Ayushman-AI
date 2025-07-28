const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper")

const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null
    }
};
tialInputHeight = messageInput.scrollHeight;

// Utility to create a chat message element
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
};

// Function to send user message and receive bot response
const handleOutgoingMessage = async (e) => {
    e.preventDefault();

    const userMessage = messageInput.value.trim();
    if (!userMessage) return;

    // Clear input field
    messageInput.value = "";

    // Remove Image after sending 
    fileUploadWrapper.classList.remove("file-uploaded");

    // Save user message
    userData.message = userMessage;

    // Show user's message in the chat
    const userDiv = createMessageElement(
    `
    <div class="message-text">${userMessage}</div>
    ${userData.file?.data 
        ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" alt="Uploaded file" />`
        : ""}
        `,
        "user-message"
    );
    chatBody.appendChild(userDiv);

    // Show bot typing/thinking animation
    const botThinkingDiv = createMessageElement(`
        <svg
            class="bot-avatar"
            width="50px"
            height="50px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M3 5V20.7929C3 21.2383 3.53857 21.4614 3.85355 21.1464L7.70711 17.2929C7.89464 17.1054 8.149 17 8.41421 17H19C20.1046 17 21 16.1046 21 15V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5Z"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M15 12C14.2005 12.6224 13.1502 13 12 13C10.8498 13 9.79952 12.6224 9 12"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M9 8.01953V8"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
            <path
                d="M15 8.01953V8"
                stroke="#000000"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
            />
        </svg>
        <div class="message-text">
            <div class="thinking-indicator">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        </div>
    `, "bot-message", "thinking");
    chatBody.appendChild(botThinkingDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
        // Prepare message parts
        const parts = [{ message: userMessage }];
        if (userData.file.data) {
            parts.push({ inline_data: userData.file });
        }

        // Send to backend
        const response = await fetch("/get", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts }]
            })
        });

        const data = await response.json();

        // Handle response
        if (data?.response) {
            botThinkingDiv.querySelector(".message-text").textContent = data.response;
        } else {
            botThinkingDiv.querySelector(".message-text").textContent = "⚠️ No response from bot.";
        }

        // Clear file after sending
        userData.file = { data: null, mime_type: null };

    } catch (error) {
        console.error("Error communicating with chatbot:", error);
        botThinkingDiv.querySelector(".message-text").textContent = "❌ Error: Unable to reach chatbot.";
    }

    botThinkingDiv.classList.remove("thinking");
    chatBody.scrollTop = chatBody.scrollHeight;
};

// Send on Enter key
messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && messageInput.value.trim()) {
        handleOutgoingMessage(e);
    }
});

// Send on button click
sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));

// File Upload feature
const fileInput = document.querySelector("#file-input");

document.querySelector("#file-upload").addEventListener("click", () => fileInput.click());

// Handle file input change
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        fileUploadWrapper.querySelector("img").src = e.target.result;
        fileUploadWrapper.classList.add("file-uploaded")
        const base64String = e.target.result.split(",")[1];

        // Store file data
        userData.file = {
            data: base64String,
            mime_type: file.type
        };

        fileInput.value = "";
    };

    reader.readAsDataURL(file);
});


// Create and display user message
const messageContent = `
  <div class="message-text">${userData.message || ""}</div>
  ${userData.file?.data 
    ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" alt="Uploaded file" />`
    : ""}`;

// Cancel FFile Upload
const fileCancelButton = document.querySelector("#file-cancel")
fileCancelButton.addEventListener("click", () => {
    userData.file = {};
    fileUploadWrapper.classList.remove("file-uploaded")
});

// Emoji Settings
const picker = new EmojiMart.Picker({
    theme: "light",
    skinTonePosition: "none",
    previewPosition: "none",
    onEmojiSelect: (emoji) => {
        const { selectionStart: start, selectionEnd: end } = messageInput;
        messageInput.setRangeText(emoji.native, start, end, "end");
        messageInput.focus();
    },
    onClickOutside: (e) => {
        if(e.target.id === "emoji-picker"){
            document.body.classList.toggle("show-emoji-picker");
        }

        else{
            document.body.classList.remove("show-emoji-picker");
        }
    }
});

document.querySelector(".chat-form").appendChild(picker);

