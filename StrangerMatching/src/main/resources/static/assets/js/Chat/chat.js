let userUrl = "/api/User/"
let messageUrl = "/api/Message"

let currentUser = {}

var user_sendTo = {}
var messages = []

$(document).ready(() => {
    loadUserSendToInfo()
    loadCurrentUserInfo()
    loadAllMessage()
    connect(currentUser.email)
})

function loadAllMessage() {
    $.ajax({
        url: messageUrl + "?emailOne=" + currentUser.email + "&emailTwo=" + $("#user_sendTo").val(),
        method: "GET"
    }).done(data => {
        messages = JSON.parse(JSON.stringify(data))

        $("#chatting-block div").remove()
        data.forEach(item => {
            let html = ``
            if (item.sendFrom.email == currentUser.email) {
                html += `
                 <div class="d-flex justify-content-end mb-4">
                    <div class="msg_cotainer_send" style="min-width: 120px">
                        ${item.text}
                        <span class="msg_time_send">${new Date(item.createdDate).toLocaleString()}</span>
                    </div>
                    <div class="img_cont_msg">
                        <img src="${item.sendFrom.avatar.path}" class="rounded-circle user_img_msg">
                    </div>
                </div>
                `
            } else {
                html += `
                <div class="d-flex justify-content-start mb-4">
                    <div class="img_cont_msg">
                        <img src="${item.sendFrom.avatar.path}"
                            class="rounded-circle user_img_msg">
                    </div>
                    <div class="msg_cotainer" style="min-width: 120px">
                         ${item.text}
                        <span class="msg_time">${new Date(item.createdDate).toLocaleString()}</span>
                    </div>
                </div>
                `
            }
            $("#chatting-block").append(html)
        })
    })
}

function loadUserSendToInfo() {
    $.ajax({
        url: userUrl + "Info?email=" + $("#user_sendTo").val(),
        method: "GET",
        async:false
    }).done(data => {
        user_sendTo = JSON.parse(JSON.stringify(data))
        $("#user-name").html(user_sendTo.name)
        $("#user-avatar").attr("src", user_sendTo.avatar.path)
    })
}

function loadCurrentUserInfo() {
    $.ajax({
        url: userUrl + "Info?email=" + localStorage.getItem("email"),
        method: "GET",
        async:false
    }).done(data => {
        currentUser = JSON.parse(JSON.stringify(data))
    })

}