let stompClient;

function connect(email) {
    console.log("connecting to chat...")
    let socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function () {

        //nhận danh sách các user online
        stompClient.subscribe("/topic/Online", function (response) {
            var userOnlines = JSON.parse(response.body)
            loadUserOnlineStatus("#user-online-status", userOnlines.find(item => item.email == user_sendTo.email) != null ? true : false)
        });

        stompClient.subscribe("/topic/Messages/" + email, function (response) {
            // xử lý tin nhắn nhận được từ websocket
            let message = JSON.parse(response.body)
            receiveMessage(element_chatBlock, message, user_sendTo)
        });

        // gửi req lên server để xử lý tình trạng online cũng như nhận lại danh sách user đang online
        stompClient.send("/app/Register", {}, email)

        // gửi tin nhắn
        // stompClient.send("/app/Chat/dinhthanh11011@gmail.com",{},JSON.stringify({text:"hell", sendFrom:{email:"dinhthanh11011@gmail.com"}}))

        $("#form-send-message").submit(e => {
            e.preventDefault()
            let data = $(e.target).serializeFormJSON()
            data.sendFrom = currentUser
            data.sendTo = user_sendTo
            sendMessage(data, element_chatBlock)
            $(e.target)[0].reset()
        })
    });
}




