/*
    các chức năng: get thông tin người dùng byEmail, đổi mật khẩu, thay đổi thông tin người dùng.

    để sử dụng được các chức năng thì cần phải khai báo một object currentUser để lưu thông tin của user.
        khai báo môt button sử dụng modal để open modal update user info
        khai báo môt button sử dụng modal để open modal update user password
*/

var prefixUrl = "/api/"
var avatarUrl = prefixUrl + "Avatar"
var genderUrl = prefixUrl + "Gender"

var userUrl = prefixUrl + "User/"

var avatars = []
var genders = []

var element_FormUpdateUserInfo = "#form-update-user-info"
var element_SelectionAvatar = `${element_FormUpdateUserInfo} select[name="avatar"]`

$(document).ready(() => {
    getGenders()
    getAvatars()

    $("#form-change-password").submit(e => {
        e.preventDefault()
        changePassword(e)
    })

    $(element_FormUpdateUserInfo).submit(e => {
        e.preventDefault()
        updateUserInfo(e)
    })

    $(element_SelectionAvatar).change(e => {
        loadPreviewAvatarAfterChoice(e)
    })

})


function loadPreviewAvatarAfterChoice(e) {
    let avatarSelected = avatars.find(item => item.id == $(e.target).val())
    let src = "/assets/img/dogs/image2.jpeg"
    if (avatarSelected) {
        src = avatarSelected.path
    }
    $("#avatar-preview").attr("src", src)
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
                    showConfirmButton: false,
                    timer: 500
                }).then(() => {
                    location.reload()
                })
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
                        showConfirmButton: false,
                        timer: 500
                    })
                    $("#modal-change-password").modal("hide")
                    $(e.target)[0].reset()
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

function loadUserInfoToUpdateModal( currentUser) {
    $(`${element_FormUpdateUserInfo} input[name="name"]`).val(currentUser.name)
    $(`${element_FormUpdateUserInfo} input[name="age"]`).val(currentUser.age)
    $(`${element_FormUpdateUserInfo} textarea[name="story"]`).val(currentUser.story)

    loadSelection(`${element_FormUpdateUserInfo} select[name="gender"]`, genders, "id", "name", false, currentUser.gender.id)
    loadSelection(element_SelectionAvatar, avatars, "id", "displayName", false, currentUser.avatar.id)

    $("#avatar-preview").attr("src", currentUser.avatar.path)

    loadSelection(`${element_FormUpdateUserInfo} select[name="genderPreference"]`, genders, "id", "name", false, currentUser.genderPreference.id)

    $(`${element_FormUpdateUserInfo} input[name="agePreferenceFrom"]`).val(currentUser.agePreferenceFrom)
    $(`${element_FormUpdateUserInfo} input[name="agePreferenceTo"]`).val(currentUser.agePreferenceTo)
}

//Base data
//=======================================================================
function getUserInfo(email) {
    return ($.ajax({
        url: userUrl + "Info?email=" + email,
        method: "GET",
        async: false
    })).responseJSON
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