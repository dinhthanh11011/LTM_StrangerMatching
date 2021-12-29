
var currentUser = {}
var userProfile = {}

// nơi load danh sách bài post
var element_PostBlock = "#post-list"


$(document).ready(() => {
    userProfile.email = $("#userProfileEmail").val()

    currentUser = getUserInfo(localStorage.getItem("email"))

    connect(currentUser.email)

    if(userProfile.email == currentUser.email){
        userProfile = currentUser
        $("#area-open-modal-update-user-info").removeClass("d-none")
        $("#area-open-modal-post").removeClass("d-none")
    }else{
        userProfile = getUserInfo(userProfile.email)
        $("#area-open-modal-update-user-info").addClass("d-none")
        $("#area-open-modal-post").addClass("d-none")
    }

    if (userProfile != null && userProfile.email != null) {
        loadUserProfileInfo(userProfile)
    } else {
        document.location = "/Login"
    }
    userPostEmail = userProfile.email
    loadAllListPosts(element_PostBlock,userProfile.email)

    $("#btn-logout").click(e => {
        e.preventDefault()
        logout(e)
    })

    $("#area-open-modal-update-user-info").click(e => {
        e.preventDefault()
        loadUserInfoToUpdateModal(currentUser)
    })

    $("#btn-open-user-profile").click(e => {
        e.preventDefault()
        document.location = "/User/Profile/" + currentUser.email
    })

    $("#area-goto-chat").click(e => {
        e.preventDefault()
        document.location = "/Message/" + userProfile.email
    })

    $("#area-goto-home").click(e => {
        e.preventDefault()
        document.location = "/"
    })


})

function loadUserProfileInfo(userProfile){
    $("#user-profile-name").html(userProfile.name)
    $("#user-profile-name2").html(userProfile.name)
    $("#user-profile-gender").html(userProfile.gender.name)
    $("#user-profile-age").html(userProfile.age)
    $("#user-profile-story").html(userProfile.story)
    $("#user-profile-avatar").attr("src", userProfile.avatar.path)
    $("#user-profile-avatar2").attr("src", userProfile.avatar.path)
}

function logout(e) {
    localStorage.removeItem("email")
    document.location = "/Login"
}
