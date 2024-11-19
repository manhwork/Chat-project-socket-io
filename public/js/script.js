const socket = io();

// CLIENT_SEND_MESS
const messageForm = document.querySelector(".message-input");
if (messageForm) {
    const messageInput = messageForm.querySelector("input");
    messageForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (messageInput.value) {
            socket.emit("CLIENT_SEND_MESS", messageInput.value);
            messageInput.value = "";
        }
    });
}
// end CLIENT_SEND_MESS

// SERVER_SEND_MESS
const messageList = document.querySelector(".messages");
if (messageList) {
    socket.on("SERVER_SEND_MESS", (data) => {
        const li = document.createElement("li");

        li.innerHTML = `
            <div class="message sent">
                ${data.content}
                <div class="time">12:03</div>
            </div>
            <img class="img-sent" alt="David Smith" height="40"
            src="https://storage.googleapis.com/a1aa/image/2HSuM7PWkMr4AR7OeKT7xe5TMXlniIaZ6bZg2ydMpYj7vKyTA.jpg" width="40">            
        `;
        messageList.appendChild(li);
    });
}
// end SERVER_SEND_MESS

// notification
const notificationShow = document.querySelector(`[notification-show]`);
if (notificationShow) {
    const closeNotification = notificationShow.querySelector(
        ".close-notification"
    );
    closeNotification.addEventListener("click", (e) => {
        notificationShow.classList.add("d-none");
    });
    setTimeout(() => {
        notificationShow.classList.add("d-none");
    }, 3000);
}
// end  notification
