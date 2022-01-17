let stompClient;


let announMessages = []

function connect(email) {
    console.log("connecting to chat...")
    let socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, function () {

        //nhận danh sách các user online
        stompClient.subscribe("/topic/Online", function (response) {
            var userOnlines = JSON.parse(response.body)
            loadUserOnlineList("#txt-total-user-online", "#user-online-list", userOnlines)
        });

        // đăng kí nhận thông báo số người đang chờ ghép đôi
        stompClient.subscribe("/topic/TotalWaitingMatching", function (response) {
            console.log(response.body != 0)
            if (response.body != 0) {
                $("#txt-total-waiting-matching").removeClass("d-none")
                $("#txt-total-waiting-matching").html(response.body)
            } else {
                $("#txt-total-waiting-matching").addClass("d-none")
            }

        });

        stompClient.subscribe("/topic/Messages/" + email, function (response) {
            // xử lý tin nhắn nhận được từ websocket
            let data = JSON.parse(response.body)
            announMessages.unshift(data)
            localStorage.setItem("announMessages", JSON.stringify(announMessages))
            loadListAnnounMessages("#announce-messages-total", "#announce-messages-list", announMessages)
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

        stompClient.send("/app/TotalStrangerMatching", {}, null)

    });
}

function loadListAnnounMessages(elementTotal, elementList, data) {
    if (data.length > 0) {
        $(elementTotal).html(data.length)
        $(elementTotal).removeClass("d-none")
        $(`${elementList} a`).remove()
        data.forEach(item => {
            $(elementList).append(RenderAnnounMessagesItem(item))
        })
    }
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

function loadUserOnlineList(elementTotal, elementList, data) {
    // set text total user online
    $(elementTotal).html(data.length)

    // load list user online
    $(`${elementList} li`).remove()
    data.forEach(item => {
        let html =
            `
            <li class="nav-item">
                <a class="dropdown-item d-flex align-items-center" href="/User/Profile/${item.email}">
                    <div class="dropdown-list-image me-3"><img width="50px" height="50px" class="rounded-circle"
                            style="object-fit: cover"
                            src="${item.avatar.path}">
                        <div class="bg-success status-indicator"></div>
                    </div>
                    <div class="fw-bold">
                        <div class="text-truncate"><span>${item.name}</span><span class="small text-gray-800 ml-2">${item.gender.name} - ${item.age}</span></div>
                        <div class="small text-gray-800 mb-0" style="white-space: normal">${item.story ? item.story : "..."}</div>
                    </div>
                </a>
                <hr class="sidebar-divider my-1">
            </li>
            `
        $(elementList).append(html)
    })
}
