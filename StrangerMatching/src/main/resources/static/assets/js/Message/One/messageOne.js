let userUrl = "/api/User/"

let element_chatBlock = "#chatting-block"

let currentUser = {}
var user_sendTo = {}

$(document).ready(() => {
    loadCurrentUserInfo()
    loadUserSendToInfo()
    loadMessages(element_chatBlock,currentUser.email,user_sendTo.email)
    connect(currentUser.email)
})

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
    }).fail(err => {
        document.location = "/Login"
    })
}

function loadUserOnlineStatus(element, status) {
    if (status) {
        $(element).removeClass("d-none")
    } else {
        $(element).addClass("d-none")
    }
}
