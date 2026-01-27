function getMsg(msg, userId) {
    return `<div class='msg'><span class='user-id'>${userId} ==></span>${msg}</div>`;
}
function joinChat() {
    const chatId = document.getElementById("chatId").value;
    const userId = document.getElementById("userId").value;

    console.log(chatId,userId);

    const eventSource = new EventSource(`http://localhost:8080/chat/${chatId}?userId=${userId}`);
    const messagesDiv = document.querySelector(".messages");

    eventSource.onmessage = function(event) {
        const msg = JSON.parse(event.data).msg;
        const userID = JSON.parse(event.data).userId;
        if(userID === userId) return; // skip my own messages
        messagesDiv.innerHTML += getMsg(msg, userID);
    };
}

function sendMessage() {
    const messagesDiv = document.querySelector(".messages");
    const inputField = document.getElementById("messageInput");

    if(inputField.value.trim() === '') return;
    //POST "http://localhost:8080/msg/123?userId=123&msg=hi"
    const chatId = document.getElementById("chatId").value;
    const userId = document.getElementById("userId").value;
    fetch(`http://localhost:8080/msg/${chatId}?userId=${userId}&msg=${encodeURIComponent(inputField.value)}`, {
        method: 'POST'
    });
    messagesDiv.innerHTML += `<div class='my-msg'>${inputField.value}</div>`;
    // messagesDiv.innerHTML += `<div class='msg'>${inputField.value}</div>`;
    inputField.value = '';
    
}