const socket = io();

const messageForm = document.querySelector(".message-input");
const messageInput = messageForm.querySelector("input");
if (messageForm) {
    messageForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (messageInput.value) {
            socket.emit("CLIENT_SEND_MESS", messageInput.value);
            messageInput.value = "";
        }
    });
}
