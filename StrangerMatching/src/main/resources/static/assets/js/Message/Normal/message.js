var rootURL = "/api/"
var userURL = rootURL + "User"

let element_chatBlock = "#chatting-block"


var listAllUsers = []

var currentUser = {}
var userSelected = {}

$(document).ready(() => {
    getUserLoginInfo()
    getAllUser()
    connect(currentUser.email)
    if (listAllUsers.length > 0) {
        userSelected = listAllUsers[0]
        loadMessages(element_chatBlock, currentUser.email, userSelected.email)
        loadUserChatWithInfo(userSelected)
    }

    $(document).on("click", ".user-list-item", e => {
        e.preventDefault()
        let userEmail = $(e.currentTarget).attr("data-id")
        selectionUser(userEmail)
    })

    $("#txt-search-user").on("input", e => {
        searchUser($(e.target).val())
    })

    $("#btn-goto-profile").click(e => {
        document.location = "/User/Profile/"+userSelected.email;
    })


})

function searchUser(searchKey) {
    searchKey = searchKey.toLowerCase()
    loadListUser(listAllUsers.filter(item =>
        item.name.toLowerCase().includes(searchKey)
        || item.email.toLowerCase().includes(searchKey)
        || item.gender.name.toLowerCase().includes(searchKey))
        || item.age.includes(searchKey)
    )
}

function selectionUser(userEmail) {
    userSelected = listAllUsers.find(item => item.email == userEmail)
    loadMessages(element_chatBlock, currentUser.email, userSelected.email)
    loadUserChatWithInfo(userSelected)
}

function getAllUser() {
    $.ajax({
        url: userURL,
        method: "GET",
        async: false
    }).done(res => {
        listAllUsers = JSON.parse(JSON.stringify(res))
    }).fail(err => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.responseText,
        })
    })
}

function loadListUser(listUsers) {
    let element_UserList = "#user-list"
    $(`${element_UserList} li`).remove()
    listUsers.forEach(item => {
        let html = `
         <li>
             <a data-id="${item.email}" href="" class="user-list-item" style="color: #3b3e41">
                <div class="d-flex bd-highlight">
                    <div class="img_cont">
                        <img src="${item.avatar.path}"
                            style="object-fit: cover"
                             class="rounded-circle user_img">
                        <span class="online_icon ${item.isOnline ? "" : "offline"}"></span>
                    </div>
                    <div class="user_info">
                        <span>${item.name}</span>
                        <div class="text-white" style="white-space: normal;" >${item.story}</div>
                    </div>
                </div>
            </a>
        </li>
        `
        $(element_UserList).append(html)
    })
}

function getUserLoginInfo() {
    $.ajax({
        url: userURL + "/Info?email=" + localStorage.getItem("email"),
        method: "GET",
        async: false
    }).done(data => {
        currentUser = JSON.parse(JSON.stringify(data))
    }).fail(err => {
        document.location = "/Login"
    })
}

function loadUserChatWithInfo(user) {
    $("#user-list-item-avatar").attr("src", user.avatar.path)

    if (user.isOnline) {
        $("#user-list-item-online-status").removeClass("offline")
    } else {
        $("#user-list-item-online-status").addClass("offline")
    }

    $("#user-list-item-name").html(user.name)
    $("#user-list-item-story").html(user.story)
}
