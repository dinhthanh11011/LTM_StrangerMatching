let userUrl = "/api/User/"

let element_chatBlock = "#chatting-block"


let currentUser = {}
let userRandom = {}

$(document).ready(() => {
    loadCurrentUserInfo()
    connect(currentUser.email)
})

function setUserMatchingInfo(user){
    $("#user-avatar").attr("src", user.avatar.path)
    $("#user-name").html(user.name)
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