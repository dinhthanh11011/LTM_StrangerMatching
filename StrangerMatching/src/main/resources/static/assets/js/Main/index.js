var prefixUrl = "/api/"
var avatarUrl = prefixUrl + "Avatar"
var genderUrl = prefixUrl + "Gender"

var userUrl = prefixUrl + "User/"

var currentUser = {}

var avatars = []
var genders = []

var postSelectedId = ""


var element_FormUpdateUserInfo = "#form-update-user-info"
var element_SelectionAvatar = `${element_FormUpdateUserInfo} select[name="avatar"]`
var element_PostBlock = "#post-list"


$(document).ready(() => {
    getUserInfo(localStorage.getItem("email"))

    loadListPosts(element_PostBlock)
    getGenders()
    getAvatars()

    connect(currentUser.email)

    $("#form-create-post").submit(e => {
        e.preventDefault()
        let data = new FormData($(e.target)[0])
        data.append("user.email", currentUser.email)
        createPost(e,data,element_PostBlock)
    })

    $("#form-change-password").submit(e => {
        e.preventDefault()
        changePassword(e)
    })

    $(element_FormUpdateUserInfo).submit(e => {
        e.preventDefault()
        updateUserInfo(e)
    })

    $(document).on("click", ".post-like",  e => {
        e.preventDefault()
        let data = {
            post: {
                id: $(e.currentTarget).closest(".post").attr("data-id")
            },
            user: {
                email: localStorage.getItem("email")
            },
            reaction: reactionList[0]
        }
        likePost(data,element_PostBlock)
    })

    $(document).on("click", "#btn-open-post-comment", e => {
        e.preventDefault()
        postSelectedId = $(e.currentTarget).closest(".post").attr("data-id")
        loadPostComment(postSelectedId,"#post-comment-area")
    })

    $(element_SelectionAvatar).change(e => {
        loadPreviewAvatarAfterChoice(e)
    })

    $("#btn-open-modal-update-user-info").click(e => {
        e.preventDefault()
        loadUserInfoToUpdateModal(e)
    })

    $("#btn-logout").click(e => {
        e.preventDefault()
        logout(e)
    })

    $("#btn-open-user-profile").click(e => {
        e.preventDefault()
        document.location = "/User/Profile/" + currentUser.email
    })

    $("#form-post-comment").submit(e => {
        e.preventDefault()
        let data = $(e.target).serializeFormJSON()
        data.post = {id: postSelectedId}
        data.user = currentUser
        postComment(e, data,"#post-comment-area")
    })


    $(document).on("click",".post-settings-menu-delete",e=>{
        e.preventDefault()
        let dataId = $(e.target).closest(".post").attr("data-id")
        deletePost(dataId, element_PostBlock)
    })

})

function logout(e) {
    localStorage.removeItem("email")
    document.location = "/Login"
}



function changePassword(e) {
    Swal.fire({
        title: 'Do you want to change your password?',
        showCancelButton: true,
        confirmButtonText: 'save',
    }).then((result) => {
        if (result.isConfirmed) {
            let data = $(e.target).serializeFormJSON()
            if (data.newPassword == data.newPasswordConfirm) {
                $.ajax({
                    url: userUrl + "ChangePassword/" + currentUser.email,
                    method: "PUT",
                    data: JSON.stringify(data),
                    contentType: "application/json"
                }).done(res => {
                    Swal.fire({
                        icon: 'success',
                        title: res,
                        showConfirmButton: false,
                        timer: 800
                    })
                    $("#modal-change-password").modal("hide")
                }).fail(err => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: err.responseText,
                    })
                })
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: "New password and password confirm need being equals",
                })
            }
        }
    })
}

function updateUserInfo(e) {
    Swal.fire({
        title: 'Do you want to update your information?',
        showCancelButton: true,
        confirmButtonText: 'update',
    }).then((result) => {
        if (result.isConfirmed) {
            let data = $(e.target).serializeFormJSON()
            data.gender = {
                id: data.gender
            }
            data.genderPreference = {
                id: data.genderPreference
            }
            data.avatar = {
                id: data.avatar
            }
            $.ajax({
                url: userUrl + "Information/" + currentUser.email,
                method: "PUT",
                data: JSON.stringify(data),
                contentType: "application/json"
            }).done(res => {
                Swal.fire({
                    icon: 'success',
                    title: res,
                    showConfirmButton: false,
                    timer: 800
                })
                location.reload()
            }).fail(err => {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: err.responseText,
                })
            })
        }
    })
}

function loadUserInfoToUpdateModal(e) {
    $(`${element_FormUpdateUserInfo} input[name="name"]`).val(currentUser.name)
    $(`${element_FormUpdateUserInfo} input[name="age"]`).val(currentUser.age)
    $(`${element_FormUpdateUserInfo} textarea[name="story"]`).val(currentUser.story)

    loadSelection(`${element_FormUpdateUserInfo} select[name="gender"]`, genders, "id", "name", `Gender selection ...`, currentUser.gender.id)
    loadSelection(element_SelectionAvatar, avatars, "id", "displayName", `Avatar selection ...`, currentUser.avatar.id)

    $("#avatar-preview").attr("src", currentUser.avatar.path)

    loadSelection(`${element_FormUpdateUserInfo} select[name="genderPreference"]`, genders, "id", "name", `Gender selection ...`, currentUser.genderPreference.id)

    $(`${element_FormUpdateUserInfo} input[name="agePreferenceFrom"]`).val(currentUser.agePreferenceFrom)
    $(`${element_FormUpdateUserInfo} input[name="agePreferenceTo"]`).val(currentUser.agePreferenceTo)
}



function loadPreviewAvatarAfterChoice(e) {
    let avatarSelected = avatars.find(item => item.id == $(e.target).val())
    let src = "/assets/img/dogs/image2.jpeg"
    if (avatarSelected) {
        src = avatarSelected.path
    }
    $("#avatar-preview").attr("src", src)
}

//Base data
//=======================================================================
function getUserInfo(email) {
    $.ajax({
        url: userUrl + "Info?email=" + email,
        method: "GET",
        async: false
    }).done(res => {
        currentUser = JSON.parse(JSON.stringify(res))
        $("#user-info-name").html(currentUser.name)
        $("#user-info-avatar").attr("src", currentUser.avatar.path)
    }).fail(err => {
        document.location = "/Login"
    })
}

function getGenders() {
    $.ajax({
        url: genderUrl,
        method: "GET"
    }).done(data => {
        genders = JSON.parse(JSON.stringify(data))
    })
}

function getAvatars() {
    $.ajax({
        url: avatarUrl,
        method: "GET"
    }).done(data => {
        avatars = JSON.parse(JSON.stringify(data))
    })
}

function loadSelection(element, data, clValue, clDisplay, baseRowStr, selected_value) {
    $(`${element} option`).remove()
    if (baseRowStr != false) {
        $(element).append(`<option value="">${baseRowStr}</option>`)
    }
    data.forEach(item => {
        let selected = ""
        if (item.id == selected_value) {
            selected = "selected"
        }
        $(element).append(
            `<option ${selected} value="${item[clValue]}">${item[clDisplay]}</option>`
        )
    })
}