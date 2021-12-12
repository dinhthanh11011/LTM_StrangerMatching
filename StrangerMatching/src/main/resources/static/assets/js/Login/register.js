let prefixUrl = "/api/"
let registerUrl = prefixUrl + "User/Register"
let avatarUrl = prefixUrl + "Avatar"
let genderUrl = prefixUrl + "Gender"

let avatars = []

let Element_selectionAvatar = "#selection-avatar"

$(document).ready(() => {
    loadSelectionGenders("#selection-gender")
    loadSelectionAvatars(Element_selectionAvatar)

    $(Element_selectionAvatar).change(e => {
        let avatarSelected = avatars.find(item => item.id == $(e.target).val())
        $("#avatar-display").css("background-image", `url(${avatarSelected.path})`)
    })

    $("#post-form-register").submit(e => {
        e.preventDefault()
        postCreateAccount(e)
    })


});

function postCreateAccount(e) {
    let formData = $(e.target).serializeFormJSON()
    if (formData.password !== formData.password_repeat) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Password and repeat password need equalizing!',
        })
    } else {
        formData.avatar = {id: formData.avatar}

        formData.gender = {id: formData.gender}

        $.ajax({
            url: registerUrl,
            method: "POST",
            data:JSON.stringify(formData),
            contentType: "application/json",
        }).done(res => {
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: res,
                showConfirmButton: false,
                timer: 800
            }).then(()=>{
                document.location = "/Login"
            })
        }).fail(err => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.responseText,
            })
        })
    }

}

function loadSelectionGenders(elemet_selectionGender) {
    $.ajax({
        url: genderUrl,
        method: "GET"
    }).done(data => {
        loadSelection(elemet_selectionGender, data, `Gender selection ...`)
    })
}

function loadSelectionAvatars(elemet_selectionGender) {
    $.ajax({
        url: avatarUrl,
        method: "GET"
    }).done(data => {
        avatars = JSON.parse(JSON.stringify(data))
        console.log(avatars)
        loadSelection(elemet_selectionGender, data, `Avatar selection ...`)
    })
}

function loadSelection(element, data, baseRowStr) {
    $(`${element} option`).remove()
    if (baseRowStr != false) {
        $(element).append(`<option value="">${baseRowStr}</option>`)
    }
    data.forEach(item => {
        $(element).append(
            `<option value="${item.id}">${item.name}</option>`
        )
    })
}