var prefixUrl = "/api/"
var postUrl = prefixUrl + "Post/"

var postSelectedId = ""

var reactionList = []

$(document).ready(() => {
    getListReaction()
    loadListPosts(element_PostBlock)

    // post
    //=========================================================
    $("#form-create-post").submit(e => {
        e.preventDefault()
        let data = new FormData($(e.target)[0])
        data.append("user.email", currentUser.email)
        createPost(e, data, element_PostBlock)
    })

    $(document).on("click", ".post-like", e => {
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
        likePost(data, element_PostBlock)
    })

    $(document).on("click", "#btn-open-post-comment", e => {
        e.preventDefault()
        postSelectedId = $(e.currentTarget).closest(".post").attr("data-id")
        loadPostComment(postSelectedId, "#post-comment-area")
    })

    $("#form-post-comment").submit(e => {
        e.preventDefault()
        let data = $(e.target).serializeFormJSON()
        data.post = {id: postSelectedId}
        data.user = currentUser
        postComment(e, data, "#post-comment-area")
    })


    $(document).on("click", ".post-settings-menu-delete", e => {
        e.preventDefault()
        let dataId = $(e.target).closest(".post").attr("data-id")
        deletePost(dataId, element_PostBlock)
    })


    $(document).on("click", ".post-item-option", e => {
        e.preventDefault()
        let optionElement = $(e.currentTarget).closest("div").find(".settings-menu")
        if (optionElement.css("display") != "none") {
            optionElement.css("display", "none")
        } else {
            optionElement.css("display", "inline-table")
        }
    })

    $(document).on("click", ".post-settings-menu-message", e => {
        e.preventDefault()
        let dataUserEmail = $(e.target).closest(".post").attr("data-user-email")
        document.location = "/Message/" + dataUserEmail
    })

    $(document).on("click", ".post-settings-menu-profile", e => {
        e.preventDefault()
        let dataUserEmail = $(e.target).closest(".post").attr("data-user-email")
        document.location = "/User/Profile/" + dataUserEmail
    })

})


function createPost(e, postData, reloadIntoElement) {
    Swal.fire({
        title: 'Do you want to create a post?',
        showCancelButton: true,
        confirmButtonText: 'create',
    }).then((result) => {
        if (result.isConfirmed) {
            if (postData.get("caption").length > 0 || postData.get("files").size > 0) {
                $.ajax({
                    url: postUrl,
                    method: "POST",
                    data: postData,
                    processData: false,
                    contentType: false
                }).done(res => {
                    Swal.fire({
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 800
                    })
                    $("#modal-create-new-post").modal("hide")
                    $(e.target)[0].reset()
                    loadListPosts(reloadIntoElement)
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

function likePost(postData, reloadIntoElement) {
    $.ajax({
        url: postUrl + "Reaction",
        method: "POST",
        data: JSON.stringify(postData),
        contentType: "application/json"
    }).done(res => {
        loadListPosts(reloadIntoElement)
    }).fail(err => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.responseText,
        })
    })
}


function deletePost(postId, reloadIntoElement) {
    Swal.fire({
        title: 'Do you want to delete this post?',
        showCancelButton: true,
        confirmButtonText: 'delete',
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: postUrl + postId,
                method: "DELETE"
            }).done(res => {
                Swal.fire({
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 500
                })
                loadListPosts(reloadIntoElement)
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

function loadListPosts(loadIntoElement) {
    $.ajax({
        url: postUrl,
        method: "GET"
    }).done(data => {
        $(`${loadIntoElement} div`).remove()
        data.forEach(item => {
            let html = `
                <div  data-id="${item.id}" data-user-email="${item.user.email}" class="post post-container">
                    <div class="post-row">
                        <div class="user-profile">
                            <img style="object-fit: cover" width="50px" height="50px"
                                     src="${item.user.avatar.path}">
                            <div>
                                <a href="/User/Profile/${item.user.email}" class="profile-name"><p>${item.user.name}</p></a>
                                <span>${new Date(item.createdDate).toLocaleString()}</span>
                            </div>
                        </div>
                        <div>
                            <a href="" class="post-item-option">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                                </svg>
                            </a>
                            <div class="settings-menu" style="display: none">
                                <div class="profile-menu">`
            if (item.user.email == currentUser.email) {
                html += `
                                        <div class="post-settings-menu-delete">
                                            <p>Xóa bài viết</p>
                                            <i class="far fa-trash-alt"></i>
                                        </div>
                                    `
            }
            html += `<div class="post-settings-menu-profile">
                                        <p>Trang cá nhân</p>
                                        <i class="far fa-paper-plane"></i>
                                    </div>
                                    <div class="post-settings-menu-message">
                                        <p>Chat</p>
                                        <i class="far fa-paper-plane"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <p class="post-text">${item.caption}</p>
                    <div class="row justify-content-center" style="max-height: 100vh; overflow-y: auto; overflow-x: hidden;">`

            item.images.forEach(img => {
                html += `<img class="img-fluid m-1"
                                    src="${img.path}">`
            })

            html += `</div>
                    <div class="post-row">
                    <div class="activity-icons my-2">
                        <a href="" style="${item.reactions.find(re => re.user.email == currentUser.email) != null ? "color: #ff0076" : "color: #3a3b45"}" class="text-decoration-none post-like">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 class="bi bi-heart-fill" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                      d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                            </svg>
                            <span>${item.totalReaction > 0 ? item.totalReaction : ""}</span>
                        </a>
                        <a id="btn-open-post-comment" 
                                class="text-decoration-none mx-4"
                                data-bs-toggle="modal"
                                data-bs-target="#modal-post-comment" href="">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                 class="bi bi-chat-left-text-fill" viewBox="0 0 16 16">
                                <path d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4.414a1 1 0 0 0-.707.293L.854 15.146A.5.5 0 0 1 0 14.793V2zm3.5 1a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h9a.5.5 0 0 0 0-1h-9zm0 2.5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1h-5z"/>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
            `
            $(loadIntoElement).append(html)
        })
    })
}


// post comment
//======================================================================
function postComment(e, postCommentData, reloadPostCommentIntoElement) {
    $.ajax({
        url: postUrl + "Comment",
        method: "POST",
        data: JSON.stringify(postCommentData),
        contentType: "application/json"
    }).done(res => {
        loadPostComment(postCommentData.post.id, reloadPostCommentIntoElement)
        $(e.target)[0].reset()
    }).fail(err => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.responseText,
        })
    })
}


function loadPostComment(postId, loadPostCommentIntoElement) {
    $.ajax({
        url: postUrl + "Comment/" + postId,
        method: "GET"
    }).done(res => {
        $(`${loadPostCommentIntoElement} div`).remove()
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
                $(loadPostCommentIntoElement).append(html)
            })
            $(loadPostCommentIntoElement).scrollTop($(loadPostCommentIntoElement)[0].scrollHeight);
        } else {
            $(loadPostCommentIntoElement).append(`
                <div>Bài viết chưa có bình luận nào!</div>
            `)
        }

    }).fail(err => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.responseText,
        })
    })
}

// list Reaction to react post
//==================================================================================
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