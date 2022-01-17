let stompClient;

function connect(email) {
    let socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function () {

        stompClient.subscribe("/topic/Messages/" + email, function (response) {
            // xử lý tin nhắn nhận được từ websocket
            let data = JSON.parse(response.body)
            let announMessages = JSON.parse(localStorage.getItem("announMessages"))
            if (announMessages) {
                announMessages.unshift(data)
                localStorage.setItem("announMessages", JSON.stringify(announMessages))
            }

            Swal.fire({
                position: 'top-end',
                html: RenderAnnounMessagesItem(data),
                showConfirmButton: false,
                timer: 2000
            })
        });

        peer.on('open', function (id) {
            peerId = id
            // gửi req lên server để xử lý tình trạng online cũng như nhận lại danh sách user đang online
            stompClient.send("/app/Register", {}, JSON.stringify({email: email, peerId: peerId}))
        })

    });
}

function RenderAnnounMessagesItem(item){
    return `
        <a class="dropdown-item d-flex align-items-center announ-message-item" data-email="${item.sendFrom.email}">
            <div class="dropdown-list-image me-3"><img class="rounded-circle" width="50px" height="50px"
                                                        style="object-fit: cover"
                                                       src="${item.sendFrom.avatar.path}">
                <div class="bg-success status-indicator"></div>
            </div>
            <div class="fw-bold">
                <p class="text-dark mb-0" style="text-align: left">${item.sendFrom.name}</p>
                <div class="small text-gray-500" style="text-align: left"><span>${new Date(item.createdDate).toLocaleString()}</span></div>
                <div class="small text-gray-700" style="text-align: left"><span>${item.text}</span></div>
            </div>
        </a>
        `
}