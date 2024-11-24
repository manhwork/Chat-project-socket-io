const socket = io();

// Scrol bottom page
const messageElement = document.querySelector(".messages");
if (messageElement) {
    messageElement.scrollTop = messageElement.scrollHeight;
}
// end Scroll bottom page

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
        const userIdElement = document.querySelector("[user-id]");
        const userId = userIdElement.getAttribute("user-id");

        if (userId === data.user_id) {
            li.innerHTML = `
                <div class="message sent">
                    ${data.content}
                    <div class="time">12:03</div>
                </div>
                <img class="img-sent" alt="David Smith" height="40"
                src="https://storage.googleapis.com/a1aa/image/2HSuM7PWkMr4AR7OeKT7xe5TMXlniIaZ6bZg2ydMpYj7vKyTA.jpg" width="40">            
            `;
        } else {
            li.innerHTML = `
            <img class="img-received" alt="User" height="40"
                src="https://storage.googleapis.com/a1aa/image/14q8RMRXnNYBMh98MWeVsUWwWJjUzDqUPB2BQyo1BCSfvKyTA.jpg" width="40">
            <div class="message received">
                ${data.content}
                <div class="time">12:03

                </div>
            </div>
            `;
        }

        messageList.appendChild(li);
        messageElement.scrollTop = messageElement.scrollHeight;
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

// show dropdown
const infoUserDropdown = document.querySelector(".info-user-dropdown");
if (infoUserDropdown) {
    infoUserDropdown.addEventListener("click", (e) => {
        const dropdownenu = document.querySelector(".dropdown-menu");
        dropdownenu.classList.toggle("d-none");
    });
}
// end show dropdown

// upload avatar
const profileHeader = document.querySelector(".profile-header");
if (profileHeader) {
    const userImage = document.querySelector(".user-img");
    userImage.addEventListener("click", (e) => {
        const fileInput = document.querySelector(".file-input");
        fileInput.click();
    });
}
// end upload avatar

// CLIENT_SEND_ADD_FRIEND
const buttonSendAcpFriend = document.querySelectorAll(
    "[button-send-acp-friend]"
);
if (buttonSendAcpFriend) {
    for (const button of buttonSendAcpFriend)
        button.addEventListener("click", (e) => {
            const notFriendId = button.getAttribute("button-send-acp-friend");

            if (button.classList.contains("btn-success")) {
                // phát sự kiện muốn kết bạn
                socket.emit("CLIENT_SEND_SENT_FRIEND", {
                    notFriendId: notFriendId,
                });

                button.classList.remove("btn-success");
                button.classList.add("btn-danger");
                button.textContent = "Đã gửi kết bạn";
            } else {
                // phát sự kiện muốn kết bạn
                socket.emit("CLIENT_SEND_CANCEL_SENT_FRIEND", {
                    notFriendId: notFriendId,
                });

                button.classList.remove("btn-danger");
                button.classList.add("btn-success");
                button.textContent = "Gửi kết bạn";
            }
        });
}
// End CLIENT_SEND_ADD_FRIEND

// accept-friend cancel-friend
const pendingUsers = document.querySelectorAll(".pending-user");
if (pendingUsers) {
    pendingUsers.forEach((pendingUser) => {
        const userId = pendingUser.getAttribute("invitation-friend-id");

        // Nút chấp nhận kết bạn
        const acceptFriendButton = pendingUser.querySelector(".accept-friend");
        if (acceptFriendButton) {
            acceptFriendButton.addEventListener("click", () => {
                socket.emit("CLIENT_ACCEPT_FRIEND", { userId: userId });
                pendingUser.remove(); // Xóa phần tử pendingUser khỏi DOM sau khi kết bạn
            });
        }

        // Nút từ chối kết bạn
        const cancelFriendButton = pendingUser.querySelector(".cancel-friend");
        if (cancelFriendButton) {
            cancelFriendButton.addEventListener("click", () => {
                socket.emit("CLIENT_REJECT_FRIEND", { userId: userId });
                pendingUser.remove(); // Xóa phần tử pendingUser khỏi DOM sau khi từ chối kết bạn
            });
        }
    });
}
// End accept-friend cancel-friend
