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
        stompClient.subscribe("/topic/TotalWaitingMatching" , function (response) {
            $("#txt-total-waiting-matching").html(response.body)
        });

        stompClient.subscribe("/topic/Messages/" + email, function (response) {
            // xử lý tin nhắn nhận được từ websocket
            let data = JSON.parse(response.body)
            announMessages.unshift(data)
            loadListAnnounMessages("#announce-messages-total","#announce-messages-list",announMessages)
        });

        // gửi req lên server để xử lý tình trạng online cũng như nhận lại danh sách user đang online
        stompClient.send("/app/Register", {}, email)

        stompClient.send("/app/TotalStrangerMatching", {}, null)

        // gửi tin nhắn
        // stompClient.send("/app/Chat/dinhthanh11011@gmail.com",{},JSON.stringify({text:"hell", sendFrom:{email:"dinhthanh11011@gmail.com"}}))

    });
}

function loadListAnnounMessages(elementTotal,elementList, data) {
    $(elementTotal).html(data.length)
    $(elementTotal).removeClass("d-none")
    $(`${elementList} a`).remove()
    data.forEach(item => {
        let html = `
        <a class="dropdown-item d-flex align-items-center" href="/Message/${item.sendFrom.email}">
            <div class="dropdown-list-image me-3"><img class="rounded-circle" width="50px" height="50px"
                                                        style="object-fit: cover"
                                                       src="${item.sendFrom.avatar.path}">
                <div class="bg-success status-indicator"></div>
            </div>
            <div class="fw-bold">
                <div class="text-truncate"><span>${item.text}</span></div>
                <p class="small text-gray-500 mb-0">${item.sendFrom.name} - ${new Date(item.createdDate).toLocaleString()}</p>
            </div>
        </a>
        `
        $(elementList).append(html)
    })
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
