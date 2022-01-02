var prefixUrl = "/api/"
var postUrl = prefixUrl + "Post"

var postSelectedId = ""
var reactionList = []

let userPostEmail = false

$(document).ready(() => {
    getListReaction()

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
        likePost(data, e)
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

    // load image preview
    $(`#form-create-post input[name="files"]`).change((e) => {
        let files = e.target.files;

        if (files && files.length > 0) {
            // Set preview image
            let loadArea = $(e.target).closest("div").find("#area-img-preview")
            let reader = new FileReader();
            $(loadArea).children().remove()

            function readFile(index) {
                if (index >= files.length) {
                    return;
                }

                reader.onload = function () {
                    // get file content
                    $(loadArea).append(`<img width="30%" class="img-fluid m-2"
                                 src="${reader.result}">`)
                    // do sth with bin
                    readFile(index + 1)
                }
                reader.readAsDataURL(files[index]);
            }

            readFile(0)
        }
    });


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
                    contentType: false,
                    headers: {
                        "Authorization": `JWT_Token ${localStorage.getItem("token")}`
                    },
                }).done(res => {
                    Swal.fire({
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 800
                    })
                    $("#modal-create-new-post").modal("hide")
                    $(e.target)[0].reset()
                    loadAllListPosts(reloadIntoElement, userPostEmail)
                    $("#area-img-preview img").remove()
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

function likePost(postData, e) {
    $.ajax({
        url: postUrl + "/Reaction",
        method: "POST",
        data: JSON.stringify(postData),
        contentType: "application/json",
        headers: {
            "Authorization": `JWT_Token ${localStorage.getItem("token")}`
        },
    }).done(res => {
        let currentTarget = $(e.currentTarget)
        let totalReaction = $(e.currentTarget).find("span.total-reaction")
        let heartColor = "#ff0076"
        let grayColor = "#3a3b45"

        if (convertRGBToHex(currentTarget.css("color")) == heartColor) {
            currentTarget.css("color", grayColor)
            if(totalReaction.html() != "1"){
            totalReaction.html(Number(totalReaction.html()) - 1)
            }else{
                totalReaction.html("")
            }
        } else {
            currentTarget.css("color", heartColor)
            if(totalReaction.html() != ""){
                totalReaction.html(Number(totalReaction.html()) + 1)
            }else{
                totalReaction.html(1)
            }
        }
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
                url: postUrl + "/" + postId,
                method: "DELETE",
                headers: {
                    "Authorization": `JWT_Token ${localStorage.getItem("token")}`
                },
            }).done(res => {
                Swal.fire({
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 500
                })
                loadAllListPosts(reloadIntoElement, userPostEmail)
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

function loadAllListPosts(loadIntoElement, email) {
    $.ajax({
        url: postUrl + `${email != false ? "?email=" + email : ""}`,
        method: "GET",
        headers: {
            "Authorization": `JWT_Token ${localStorage.getItem("token")}`
        },
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
                                            <span>Xóa bài viết</span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash-fill" viewBox="0 0 16 16">
                                              <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"/>
                                            </svg>
                                        </div>
                                    `
            }
            html += `<div class="post-settings-menu-profile">
                                        <span>Trang cá nhân</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-video2" viewBox="0 0 16 16">
                                          <path d="M10 9.05a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"/>
                                          <path d="M2 1a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2ZM1 3a1 1 0 0 1 1-1h2v2H1V3Zm4 10V2h9a1 1 0 0 1 1 1v9c0 .285-.12.543-.31.725C14.15 11.494 12.822 10 10 10c-3.037 0-4.345 1.73-4.798 3H5Zm-4-2h3v2H2a1 1 0 0 1-1-1v-1Zm3-1H1V8h3v2Zm0-3H1V5h3v2Z"/>
                                        </svg>
                                    </div>
                                    <div class="post-settings-menu-message">
                                        <span>Chat</span>
                                       <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chat-quote" viewBox="0 0 16 16">
                                          <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105z"/>
                                          <path d="M7.066 6.76A1.665 1.665 0 0 0 4 7.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 0 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 7.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 0 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <p class="post-text">${item.caption}</p>
                    <div class="row justify-content-center" style="max-height: 70vh; overflow-y: auto; overflow-x: hidden;">`

            item.images.forEach(img => {
                html += `<img class="img-fluid m-1" style="width: fit-content;height: fit-content"
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
                            <span class="total-reaction" >${item.totalReaction > 0 ? item.totalReaction : ""}</span>
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
        url: postUrl + "/Comment",
        method: "POST",
        data: JSON.stringify(postCommentData),
        contentType: "application/json",
        headers: {
            "Authorization": `JWT_Token ${localStorage.getItem("token")}`
        },
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
        url: postUrl + "/Comment/" + postId,
        method: "GET",
        headers: {
            "Authorization": `JWT_Token ${localStorage.getItem("token")}`
        },
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
        headers: {
            "Authorization": `JWT_Token ${localStorage.getItem("token")}`
        },
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

function convertRGBToHex(rgb){
    return `#${rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/).slice(1).map(n => parseInt(n, 10).toString(16).padStart(2, '0')).join('')}`
}