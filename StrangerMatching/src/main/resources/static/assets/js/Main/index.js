let prefixUrl = "/api/"
let avatarUrl = prefixUrl + "Avatar"
let genderUrl = prefixUrl + "Gender"

let postUrl = prefixUrl + "Post/"
let userUrl = prefixUrl + "User/"

let currentUser = {}

let reactionList = []
let avatars = []
let genders = []

let postSelectedId = ""


let element_FormUpdateUserInfo = "#form-update-user-info"
let element_SelectionAvatar = `${element_FormUpdateUserInfo} select[name="avatar"]`

$(document).ready(() => {
    getUserInfo(localStorage.getItem("email"))
    getListReaction()
    loadListPosts()
    getGenders()
    getAvatars()

    connect(currentUser.email)

    $("#form-create-post").submit(e => {
        e.preventDefault()
        createPost(e)
    })

    $("#form-change-password").submit(e => {
        e.preventDefault()
        changePassword(e)
    })

    $(element_FormUpdateUserInfo).submit(e => {
        e.preventDefault()
        updateUserInfo(e)
    })

    $(document).on("click", ".post-delete", e => {
        e.preventDefault()
        deletePost(e)
    })

    $(document).on("click", ".post-like", e => {
        e.preventDefault()
        likePost(e)
    })

    $(document).on("click", "#btn-open-modal-post-comment", e => {
        e.preventDefault()
        let postId = $(e.currentTarget).closest(".post").attr("data-id")
        loadPostComment(e,postId)
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

    $("#form-post-comment").submit(e => {
        e.preventDefault()
        postComment(e, postSelectedId)
    })

})

function logout(e) {
    alert("logout chua lam :))")
}

function postComment(e, postId) {
    let data = $(e.target).serializeFormJSON()
    data.post = {
        id: postId
    }
    data.user = currentUser
    $.ajax({
        url: postUrl + "Comment",
        method: "POST",
        data: JSON.stringify(data),
        contentType: "application/json"
    }).done(res => {
        loadPostComment(e,postId)
        $(e.target)[0].reset()
    }).fail(err => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.responseText,
        })
    })
}

function loadPostComment(e,postId) {
    postSelectedId = postId
    $.ajax({
        url: postUrl + "Comment/" + postId,
        method: "GET"
    }).done(res => {
        let postCommentErea = "#post-comment-area"
        $(`${postCommentErea} div`).remove()
        if (res.length > 0) {
            res.forEach(item => {
                let html = `
                    <div class="m-2">
                        <a class="dropdown-item d-flex align-items-center" href="/Message/${item.user.email}">
                            <div class="dropdown-list-image me-3"><img width="50px" height="50px" class="rounded-circle"
                                                                        style="object-fit: cover"
                                                                       src="${item.user.avatar.path}">
                                <div class="bg-success status-indicator"></div>
                            </div>
                            <div class="fw-bold">
                                <div class="text-truncate"><span>${item.user.name}</span> <span
                                        class="small text-gray-700 ml-2">${item.user.gender.name} - ${item.user.age}</span></div>
                                <p class="small text-gray-500 my-1">${new Date(item.createdDate).toLocaleString()}</p>
                                <p class="small text-gray-800 mb-0">${item.text}</p>
                            </div>
                        </a>
                        <hr class="sidebar-divider my-1">
                    </div>
                `
                $(postCommentErea).append(html)
            })
            $(postCommentErea).scrollTop($(postCommentErea)[0].scrollHeight);
        } else {
            $(postCommentErea).append(`Bài viết chưa có bình luận nào!`)
        }

    }).fail(err => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.responseText,
        })
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

    loadSelection(`${element_FormUpdateUserInfo} select[name="gender"]`, genders, "id", "name", `Gender selection ...`, currentUser.gender.id)
    loadSelection(element_SelectionAvatar, avatars, "id", "displayName", `Avatar selection ...`, currentUser.avatar.id)

    $("#avatar-preview").attr("src", currentUser.avatar.path)

    loadSelection(`${element_FormUpdateUserInfo} select[name="genderPreference"]`, genders, "id", "name", `Gender selection ...`, currentUser.genderPreference.id)

    $(`${element_FormUpdateUserInfo} input[name="agePreferenceFrom"]`).val(currentUser.agePreferenceFrom)
    $(`${element_FormUpdateUserInfo} input[name="agePreferenceTo"]`).val(currentUser.agePreferenceTo)
}


function likePost(e) {
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
    $.ajax({
        url: postUrl + "Reaction",
        method: "POST",
        data: JSON.stringify(data),
        contentType: "application/json"
    }).done(res => {
        Swal.fire({
            icon: 'success',
            title: res,
            showConfirmButton: false,
            timer: 800
        })
        loadListPosts()
    }).fail(err => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.responseText,
        })
    })
}

function deletePost(e) {
    Swal.fire({
        title: 'Do you want to delete this post?',
        showCancelButton: true,
        confirmButtonText: 'delete',
    }).then((result) => {
        if (result.isConfirmed) {
            let postId = $(e.currentTarget).closest(".post").attr("data-id")
            $.ajax({
                url: postUrl + postId,
                method: "DELETE"
            }).done(res => {
                Swal.fire({
                    icon: 'success',
                    title: res,
                    showConfirmButton: false,
                    timer: 800
                })
                loadListPosts()
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

function createPost(formEvent) {
    Swal.fire({
        title: 'Do you want to create a post?',
        showCancelButton: true,
        confirmButtonText: 'create',
    }).then((result) => {
        if (result.isConfirmed) {
            let formData = new FormData($(formEvent.target)[0])
            if (formData.get("cation") != "" || formData.get("files").size > 0) {
                formData.append("user.email", localStorage.getItem("email"))
                $.ajax({
                    url: postUrl,
                    method: "POST",
                    data: formData,
                    processData: false,
                    contentType: false
                }).done(res => {
                    Swal.fire({
                        icon: 'success',
                        title: res,
                        showConfirmButton: false,
                        timer: 800
                    })
                    $("#modal-create-new-post").modal("hide")
                    loadListPosts()
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
                    text: 'You need a caption or some images',
                })
            }
        }
    })
}


function loadListPosts() {
    $.ajax({
        url: postUrl,
        method: "GET"
    }).done(data => {
        $("#post-list div").remove()
        data.forEach(item => {
            let html = `
                <div data-id="${item.id}" class="post my-2 p-2 rounded bg-gray-100">
                    <div class="post-header my-1">
                        <a class="dropdown-item d-flex align-items-center" href="/Message/${item.user.email}">
                            <div class="dropdown-list-image me-3"><img width="50px" height="50px" class="rounded-circle"
                                    style="object-fit: cover"
                                    src="${item.user.avatar.path}">
                                <div class="bg-success status-indicator"></div>
                            </div>
                            <div class="fw-bold">
                                <div class="text-truncate"><span>${item.user.name}</span></div>
                                <p class="small text-black-50 mb-0">${new Date(item.createdDate).toLocaleString()}</p>
                            </div>
                        </a>
                    </div>
                    <div class="post-body mx-3">
                        <div class="post-body-text text-black">
                            ${item.caption}
                        </div>
                        <div class="post-body-img flex-row flex-wrap my-2 p-2">
                            <div class="row justify-content-center">`
            item.images.forEach(img => {
                html += `<img style="width: 45%;" class="img-fluid m-1"
                                    src="${img.path}">`
            })

            html += `</div>
                        </div>
                    </div>
                    <hr/>
                    <div class="post-footer">
                        <div class="row my-2">
                            <div class="col-4"></div>
                            <div class="col-8 row">
                                <div class="col-5">
                                    <a href="" class="text-decoration-none post-like">
                                        <i class="fa fa-thumbs-up" aria-hidden="true"></i>
                                        <span> <small>${item.totalReaction > 0 ? item.totalReaction : "Thích"}</small></span>
                                    </a>
                                </div>
                                <div class="col-5">
                                    <a class="text-decoration-none " id="btn-open-modal-post-comment" data-bs-toggle="modal"
                                   data-bs-target="#modal-post-comment" href="">
                                        <i class="fa fa-comments" aria-hidden="true"></i><span>
                                            Bình luận</span>
                                    </a>
                                </div>`
            if (currentUser.email == item.user.email) {
                html += ` <div class="col-2">
                                    <a href="" class="post-delete text-decoration-none ">
                                        <i class="fa fa-trash text-danger" aria-hidden="true"></i>
                                    </a>
                                </div>`
            }
            html += `</div>
                        </div>
                    </div>
                </div>
            `
            $("#post-list").append(html)
        })
    })
}


function loadPreviewAvatarAfterChoice(e) {
    let avatarSelected = avatars.find(item => item.id == $(e.target).val())
    let src = "assets/img/dogs/image2.jpeg"
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
        console.log(currentUser)
        $("#user-info-name").html(currentUser.name)
        $("#user-info-avatar").attr("src", currentUser.avatar.path)
    }).fail(err => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.responseText,
        })
    })
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