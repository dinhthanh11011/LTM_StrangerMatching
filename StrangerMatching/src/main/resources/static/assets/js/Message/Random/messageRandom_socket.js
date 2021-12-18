let stompClient;

function connect(email) {
    let socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function () {

        stompClient.subscribe("/topic/Messages/" + email, function (response) {
            // xử lý tin nhắn nhận được từ websocket
            let message = JSON.parse(response.body)
            receiveMessage(element_chatBlock, message, userRandom)
        });

        // đăng kí stranger matching
        stompClient.subscribe("/topic/Match/" + email, function (response) {
            userRandom = JSON.parse(response.body)
            setUserMatchingInfo(userRandom)
            loadMessages(element_chatBlock, currentUser.email, userRandom.email)
            Swal.fire({
                icon: 'success',
                title: 'Ghép đôi thành công!',
                showConfirmButton: true,
            })
        });

        // gửi req lên server để xử lý tình trạng online cũng như nhận lại danh sách user đang online
        stompClient.send("/app/Register", {}, email)

        // gửi yêu cầu match
        setTimeout(() => {
            stompClient.send("/app/Matching", {}, email)
        }, 3000)

        // gửi tin nhắn
        // stompClient.send("/app/Chat/dinhthanh11011@gmail.com",{},JSON.stringify({text:"hell", sendFrom:{email:"dinhthanh11011@gmail.com"}}))

        $("#form-send-message").submit(e => {
            e.preventDefault()
            if(userRandom.email != null){
                let data = $(e.target).serializeFormJSON()
                data.sendFrom = currentUser
                data.sendTo = userRandom
                sendMessage(data, element_chatBlock)
                $(e.target)[0].reset()
            }else{
                Swal.fire({
                    icon: 'error',
                    title: 'Please waiting to matching!',
                    showConfirmButton: true,
                })
            }
        })
    });
}


