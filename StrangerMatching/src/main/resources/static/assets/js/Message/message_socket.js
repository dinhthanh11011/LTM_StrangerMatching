let stompClient;

function connect(email) {
    let socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function () {

        //nhận danh sách các user online
        stompClient.subscribe("/topic/Online", function (response) {
            var userOnlines = JSON.parse(response.body)
            userOnlines.forEach(item => {
                listAllUsers.find(us => us.email == item.email).isOnline = true
            })
            loadListUser(listAllUsers)
        });

        stompClient.subscribe("/topic/Messages/" + email, function (response) {
            // xử lý tin nhắn nhận được từ websocket
            let data = JSON.parse(response.body)
            receiveMessage(data, userSelected)
        });

        // gửi req lên server để xử lý tình trạng online cũng như nhận lại danh sách user đang online
        stompClient.send("/app/Register", {}, email)

        // gửi tin nhắn
        // stompClient.send("/app/Chat/dinhthanh11011@gmail.com",{},JSON.stringify({text:"hell", sendFrom:{email:"dinhthanh11011@gmail.com"}}))

        sendMessage()
    });
}


function receiveMessage(message, sendFrom) {
    if (message.sendFrom.email == sendFrom.email) {
        $("#chatting-block").append(`
            <div class="d-flex justify-content-start mb-4">
                <div class="img_cont_msg">
                    <img src="${message.sendFrom.avatar.path}"
                        class="rounded-circle user_img_msg">
                </div>
                <div class="msg_cotainer" style="min-width: 120px">
                     ${message.text}
                    <span class="msg_time">${new Date(message.createdDate).toLocaleString()}</span>
                </div>
            </div>
        `)
    }
}

function sendMessage() {
    $("#form-send-message").submit(e => {
        e.preventDefault()
        let data = $(e.target).serializeFormJSON()
        data.sendFrom = userLogin
        data.sendTo = {
            email: userSelected.email
        }
        stompClient.send("/app/Chat/" + data.sendTo.email, {}, JSON.stringify({
            text: data.text,
            sendFrom: {email: data.sendFrom.email}
        }))
        $("#chatting-block").append(`
             <div class="d-flex justify-content-end mb-4">
                <div class="msg_cotainer_send" style="min-width: 120px">
                    ${data.text}
                    <span class="msg_time_send">${new Date().toLocaleString()}</span>
                </div>
                <div class="img_cont_msg">
                    <img src="${data.sendFrom.avatar.path}" class="rounded-circle user_img_msg">
                </div>
            </div>
        `)
        $(e.target)[0].reset()
    })
}