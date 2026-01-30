const BACKEND_URL = "https://api.dkcdev.me";

const chatId = document.getElementById("chatId");
const userId = document.getElementById("userId");
const joinBtn = document.getElementById("join");
const leaveBtn = document.getElementById("leave");
let eventSource;

// <------------------------ Utility Functions ------------------------>
function disableJoin() {
  console.log("inputs disabled");  
  if (chatId) chatId.disabled = true;
  if (userId) userId.disabled = true;
  if (joinBtn) joinBtn.hidden = true;
  if (leaveBtn) leaveBtn.hidden = false;
}

function enableJoin() {
  console.log("inputs enabled");
  if (chatId) chatId.disabled = false;
  if (userId) userId.disabled = false;
  if (joinBtn) joinBtn.hidden = false;
  if (leaveBtn) leaveBtn.hidden = true;
}

function getMsg(msg, userId) {
  return `<div class='msg other'>
            <div class='user'>${userId}</div>
            ${msg}
          </div>`;
}

function connectToChatServer(chatId, userId) {

  const messagesDiv = document.querySelector(".messages");
    eventSource = new EventSource(
    `${BACKEND_URL}/chat/${chatId}?userId=${userId}`,
  );

  eventSource.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.userId === userId) return;
    if (data.userId === "System") {
      messagesDiv.innerHTML += `<div class='msg system'> ${data.msg}</div>`;
    } else {
      messagesDiv.innerHTML += getMsg(data.msg, data.userId);
    }
  };

  eventSource.onerror = (err) => {
    console.error("SSE error", err);
    enableJoin();
    eventSource.close();
  };
}

// <------------------------ Chat related Functions ------------------------>
function joinChat() {
  const chatId = document.getElementById("chatId")?.value;
  const userId = document.getElementById("userId")?.value;

  if (!chatId || !userId) {
    console.error("chatId or userId missing");
    return;
  }

  const messagesDiv = document.querySelector(".messages");
  if (!messagesDiv) {
    console.error(".messages container not found");
    return;
  }

  connectToChatServer(chatId, userId);
  disableJoin();
}

function leaveChat() {
  if (eventSource) {
    eventSource.close();
    console.log("Disconnected from chat");
    enableJoin();
  }
}

function sendMessage() {
  const messagesDiv = document.querySelector(".messages");
  const inputField = document.getElementById("messageInput");

  if (inputField.value.trim() === "") return;
  //POST "http://localhost:8080/msg/123?userId=123&msg=hi"
  const chatId = document.getElementById("chatId").value;
  const userId = document.getElementById("userId").value;
  fetch(`${BACKEND_URL}/msg/${chatId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userId: userId,
      msg: inputField.value,
    }),
  });
  messagesDiv.innerHTML += `<div class='msg me'>
                            <div class='user'>${userId}</div>
                            ${inputField.value}
                            </div>`;
  // messagesDiv.innerHTML += `<div class='msg'>${inputField.value}</div>`;
  inputField.value = "";
}
