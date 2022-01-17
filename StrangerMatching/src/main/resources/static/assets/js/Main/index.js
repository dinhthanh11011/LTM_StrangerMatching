var currentUser = {}

// nơi load danh sách bài post
var element_PostBlock = "#post-list"

$(document).ready(() => {
    currentUser = getUserInfo("")
    if (currentUser != null && currentUser.email != null) {
        $("#user-info-name").html(currentUser.name)
        $("#user-info-avatar").attr("src", currentUser.avatar.path)
    } else {
        document.location = "/Login"
    }

    let tmp_message = JSON.parse(localStorage.getItem("announMessages"))
    if (tmp_message) {
        loadListAnnounMessages("#announce-messages-total", "#announce-messages-list", tmp_message)
    }

    connect(currentUser.email)

    loadAllListPosts(element_PostBlock, false)

    $("#btn-logout").click(e => {
        e.preventDefault()
        logout(e)
    })

    $("#btn-open-modal-update-user-info").click(e => {
        e.preventDefault()
        loadUserInfoToUpdateModal(currentUser)
    })

    $("#btn-open-user-profile").click(e => {
        e.preventDefault()
        document.location = "/User/Profile/" + currentUser.email
    })

    $(document).on("click", ".announ-message-item", e => {
        e.preventDefault()
        let tar = $(e.currentTarget)
        let userEmail = tar.attr("data-email")

        let messages =  JSON.parse(localStorage.getItem("announMessages"))
        if(messages){
            localStorage.setItem("announMessages", JSON.stringify(messages.filter(item=>item.sendFrom.email != userEmail)))
        }
        document.location = `/Message/${userEmail}`
    })
})

function logout(e) {
    localStorage.removeItem("email")
    document.location = "/Login"
}








