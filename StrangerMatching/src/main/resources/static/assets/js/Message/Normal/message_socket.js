let stompClient;

function connect(email) {
    let socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function () {

        //nhận danh sách các user online
        stompClient.subscribe("/topic/Online", function (response) {
            var userOnlines = JSON.parse(response.body)
            listAllUsers.forEach(item => {
                item.isOnline = false
            })
            userOnlines.forEach(item => {
                listAllUsers.find(us => us.email == item.email).isOnline = true
            })
            loadListUser(listAllUsers)
            loadUserChatWithInfo(userSelected)
        });

        stompClient.subscribe("/topic/Messages/" + email, function (response) {
            // xử lý tin nhắn nhận được từ websocket
            let message = JSON.parse(response.body)
            receiveMessage(element_chatBlock, message, userSelected)
        });

        // gửi req lên server để xử lý tình trạng online cũng như nhận lại danh sách user đang online
        stompClient.send("/app/Register", {}, email)

        // gửi tin nhắn
        // stompClient.send("/app/Chat/dinhthanh11011@gmail.com",{},JSON.stringify({text:"hell", sendFrom:{email:"dinhthanh11011@gmail.com"}}))

        $("#form-send-message").submit(e => {
            e.preventDefault()
            let data = $(e.target).serializeFormJSON()
            data.sendFrom = currentUser
            data.sendTo = userSelected
            sendMessage(data, element_chatBlock)
            $(e.target)[0].reset()
        })
    });
}
