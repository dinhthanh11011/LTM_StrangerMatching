
var currentUser = {}

// nơi load danh sách bài post
var element_PostBlock = "#post-list"

$(document).ready(() => {
    currentUser = getUserInfo(localStorage.getItem("email"))
    if (currentUser != null && currentUser.email != null) {
        $("#user-info-name").html(currentUser.name)
        $("#user-info-avatar").attr("src", currentUser.avatar.path)
    } else {
        document.location = "/Login"
    }

    connect(currentUser.email)

    loadAllListPosts(element_PostBlock,false)

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

})

function logout(e) {
    localStorage.removeItem("email")
    document.location = "/Login"
}








