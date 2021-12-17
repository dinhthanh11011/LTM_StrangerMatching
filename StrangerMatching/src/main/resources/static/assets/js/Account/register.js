let prefixUrl = "/api/"
let registerUrl = prefixUrl + "User/Register"
let avatarUrl = prefixUrl + "Avatar"
let genderUrl = prefixUrl + "Gender"

let avatars = []

let element_FormRegister = "#form-register"

let element_SelectionGender = `${element_FormRegister} select[name="gender"]`
let element_SelectionAvatar = `${element_FormRegister} select[name="avatar"]`

$(document).ready(() => {
    loadSelectionGenders(element_SelectionGender)
    loadSelectionAvatars(element_SelectionAvatar)

    $(element_SelectionAvatar).change(e => {
        loadPreviewAvatarAfterChoice(e)
    })

    $(element_FormRegister).submit(e => {
        e.preventDefault()
        createAccount(e)
    })


});


function loadPreviewAvatarAfterChoice(e){
    let avatarSelected = avatars.find(item => item.id == $(e.target).val())
    let src = "assets/img/dogs/image2.jpeg"
    if(avatarSelected){
        src =avatarSelected.path
    }
    $("#avatar-preview").attr("src",src)
}

function createAccount(e) {
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
                icon: 'success',
                title: res,
                showConfirmButton: true,
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
        loadSelection(elemet_selectionGender, data, 'id','name',`Gender selection ...`)
    })
}

function loadSelectionAvatars(elemet_selectionGender) {
    $.ajax({
        url: avatarUrl,
        method: "GET"
    }).done(data => {
        avatars = JSON.parse(JSON.stringify(data))
        loadSelection(elemet_selectionGender, data,'id','displayName', `Avatar selection ...`)
    })
}

function loadSelection(element, data,clValue,clDisplay, baseRowStr) {
    $(`${element} option`).remove()
    if (baseRowStr != false) {
        $(element).append(`<option value="">${baseRowStr}</option>`)
    }
    data.forEach(item => {
        $(element).append(
            `<option value="${item[clValue]}">${item[clDisplay]}</option>`
        )
    })
}