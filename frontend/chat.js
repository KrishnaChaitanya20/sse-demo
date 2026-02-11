const BACKEND_URL = "http://localhost:8080";

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
  return `<div
          class="msg other max-w-[60%] md:max-w-[50%] mb-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg rounded-tl-none px-4 w-max">
          <div class="user text-cyan-400 text-sm font-medium mb-1">${userId}</div>
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
      messagesDiv.innerHTML += `<div
          class="msg system mx-auto max-w-[80%] mb-3 bg-purple-500/10 backdrop-blur-sm border border-purple-400/30 rounded-full px-4 py-1.5 w-max text-purple-300 text-sm text-center">
          ${data.msg} 
        </div>`;
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

async function leaveChat() {

  const chatIdVal = chatId.value;
  const userIdVal = userId.value;

  const res = await fetch(`${BACKEND_URL}/leave/${chatIdVal}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({userId: userIdVal}),
  });

  if(res.status == 204) { 
    if (eventSource) {
      eventSource.close();
      console.log("Disconnected from chat");
      enableJoin();
    }
  } else if( res.status === 404) {
    console.error("Chat not found");
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
  messagesDiv.innerHTML += `<div
          class="msg me max-w-[60%] md:max-w-[50%] mb-3 ml-auto bg-fuchsia-500/20 backdrop-blur-sm border border-fuchsia-400/40 rounded-lg rounded-tr-none px-4 w-max">
          <div
            class="user text-fuchsia-300 text-sm font-medium mb-1 text-right">
            ME
          </div>
          ${inputField.value}
        </div>`;
  // messagesDiv.innerHTML += `<div class='msg'>${inputField.value}</div>`;
  inputField.value = "";
}
