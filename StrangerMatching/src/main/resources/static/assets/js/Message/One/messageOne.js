let element_chatBlock = "#chatting-block"

let currentUser = {}
var user_sendTo = {}

$(document).ready(() => {
    currentUser = getUserInfo("")
    user_sendTo = getUserInfo($("#user_sendTo").val())
    loadUserSendToInfo()
    loadMessages(element_chatBlock,currentUser.email,user_sendTo.email)
    connect(currentUser.email)

    $("#btn-goto-profile").click(e => {
        document.location = "/User/Profile/"+user_sendTo.email;
    })
})

function loadUserSendToInfo() {
    $("#user-name").html(user_sendTo.name)
    $("#user-avatar").attr("src", user_sendTo.avatar.path)
}

function loadUserOnlineStatus(element, status) {
    if (status) {
        $(element).removeClass("d-none")
    } else {
        $(element).addClass("d-none")
    }
}
