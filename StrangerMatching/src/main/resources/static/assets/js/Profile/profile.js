
let prefixUrl = "/api/"
let avatarUrl = prefixUrl + "Avatar"
let genderUrl = prefixUrl + "Gender"

let postUrl = prefixUrl + "Post/"
let userUrl = prefixUrl + "User/"

let currentUser = {}
let userProfile = {}

let reactionList = []
let avatars = []
let genders = []

let element_FormUpdateUserInfo = "#form-update-user-info"
let element_SelectionAvatar = `${element_FormUpdateUserInfo} select[name="avatar"]`

$(document).ready(()=>{
    userProfile.email = $("#userProfileEmail").val()

    currentUser = loadUserInfo(localStorage.getItem("email"))

    if(userProfile.email != currentUser.email){
        userProfile = loadUserInfo(userProfile.email)

        // ẩn nút chỉnh sửa thông tin cá nhân
        $("#area-open-modal-update-user-info").addClass("d-none")
    }else{
        userProfile = currentUser
    }

    loadUserProfileInfo(userProfile)

    getListReaction()
    getGenders()
    getAvatars()
    // loadListPosts()



    $(element_SelectionAvatar).change(e => {
        loadPreviewAvatarAfterChoice(e)
    })

    $("#btn-open-modal-update-user-info").click(e => {
        e.preventDefault()
        loadUserInfoToUpdateModal(e)
    })

    $(element_FormUpdateUserInfo).submit(e => {
        e.preventDefault()
        updateUserInfo(e)
    })

})



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
function loadUserInfo(email) {
    return  ($.ajax({
        url: userUrl + "Info?email=" + email,
        method: "GET",
        async:false
    })).responseJSON
}

function loadUserProfileInfo(user){
    $("#user-profile-name").html(user.name)
    $("#user-profile-gender").html(user.gender.name)
    $("#user-profile-age").html(user.age)
    $("#user-profile-story").html(user.story)
    $("#user-profile-avatar").attr("src",user.avatar.path)
}


function getListReaction() {
    $.ajax({
        url: "/api/Reaction",
        method: "GET",
    }).done(res => {
        reactionList = JSON.parse(JSON.stringify(res))
    }).fail(err => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: "Error when load reaction",
        })
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