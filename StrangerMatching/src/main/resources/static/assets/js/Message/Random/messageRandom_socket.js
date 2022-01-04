let stompClient;

var flag = false

function connect(email) {
    let socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function () {

        //nhận danh sách các user online
        stompClient.subscribe("/topic/Online", function (response) {
            var userOnlines = JSON.parse(response.body)

            if (!flag) {
                if (userOnlines.find(item => item.email == email)) {
                    flag = true
                    // gửi yêu cầu ghép đôi sau khi đã thực hiện đăng kí online
                    stompClient.send("/app/Matching", {}, email)
                }
            }
            if(userRandom.email != null){
                loadUserOnlineStatus("#user-online-status", userOnlines.find(item => item.email == userRandom.email) != null ? true : false)
            }

            let user_tmp = userOnlines.find(item => item.email == userRandom.email)
            userRandom.IsOnline = user_tmp != null ? true : false
            if (userRandom.IsOnline) {
                userRandom.peerId = user_tmp.peerId
            }
        });

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
            $("#modal-loader").modal("hide")
            Swal.fire({
                icon: 'success',
                title: 'Ghép đôi thành công!',
                showConfirmButton: true,
            })
        });

        peer.on('open', function (id) {
            peerId = id
            // gửi req lên server để xử lý tình trạng online cũng như nhận lại danh sách user đang online
            stompClient.send("/app/Register", {}, JSON.stringify({email: email, peerId: peerId}))
        })

        $("#form-send-message").submit(e => {
            e.preventDefault()
            if (userRandom.email != null) {
                let data = $(e.target).serializeFormJSON()
                data.sendFrom = currentUser
                data.sendTo = userRandom
                sendMessage(stompClient,data, element_chatBlock)
                $(e.target)[0].reset()
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Please waiting to matching!',
                    showConfirmButton: true,
                })
            }
        })
    });
}


