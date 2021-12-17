var rootURL = "/api/"
var userURL = rootURL + "User"
var messageURL = rootURL + "Message"

var listAllUsers = []

var userLogin = {}
var userSelected = {}

$(document).ready(() => {
    getUserLoginInfo()
    getAllUser()
    connect(userLogin.email)
    if (listAllUsers.length > 0) {
        userSelected = listAllUsers[0]
        loadMessages(userSelected.email)
        loadUserChatWithInfo(userSelected)
    }

    $(document).on("click",".user-list-item",e=>{
        e.preventDefault()
        let userEmail = $(e.currentTarget).attr("data-id")
        selectionUser(userEmail)
    })

    $("#txt-search-user").on("input",e=>{
        searchUser($(e.target).val())
    })
})

function searchUser(searchKey){
    searchKey = searchKey.toLowerCase()
    loadListUser(listAllUsers.filter(item=>
        item.name.toLowerCase().includes(searchKey)
        || item.email.toLowerCase().includes(searchKey)
        || item.gender.name.toLowerCase().includes(searchKey))
        || item.age.includes(searchKey)
    )
}

function selectionUser(userEmail){
    userSelected = listAllUsers.find(item=>item.email == userEmail)
    loadMessages(userSelected.email)
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
             <a data-id="${item.email}" href="" class="user-list-item">
                <div class="d-flex bd-highlight">
                    <div class="img_cont">
                        <img src="${item.avatar.path}"
                             class="rounded-circle user_img">
                        <span class="online_icon ${item.isOnline ? "" : "offline"}"></span>
                    </div>
                    <div class="user_info">
                        <span>${item.name}</span>
                        <p>${item.story}</p>
                    </div>
                </div>
            </a>
        </li>
        `
        $(element_UserList).append(html)
    })
}

function getUserLoginInfo() {
    console.log("load user")
    $.ajax({
        url: userURL + "/Info?email=" + localStorage.getItem("email"),
        method: "GET",
        async: false
    }).done(data => {
        userLogin = JSON.parse(JSON.stringify(data))
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

function loadMessages(userEmail) {
    $.ajax({
        url: messageURL + "?emailOne=" + userLogin.email + "&emailTwo=" + userEmail,
        method: "GET"
    }).done(data => {
        let chatBlock = "#chatting-block"
        $(`${chatBlock} div`).remove()
        data.forEach(item => {
            let html = ``
            if (item.sendFrom.email == userLogin.email) {
                html += `
                 <div class="d-flex justify-content-end mb-4">
                    <div class="msg_cotainer_send" style="min-width: 120px">
                        ${item.text}
                        <span class="msg_time_send">${new Date(item.createdDate).toLocaleString()}</span>
                    </div>
                    <div class="img_cont_msg">
                        <img src="${item.sendFrom.avatar.path}" style="object-fit: cover" class="rounded-circle user_img_msg">
                    </div>
                </div>
                `
            } else {
                html += `
                <div class="d-flex justify-content-start mb-4">
                    <div class="img_cont_msg">
                        <img src="${item.sendFrom.avatar.path}" style="object-fit: cover"
                            class="rounded-circle user_img_msg">
                    </div>
                    <div class="msg_cotainer" style="min-width: 120px">
                         ${item.text}
                        <span class="msg_time">${new Date(item.createdDate).toLocaleString()}</span>
                    </div>
                </div>
                `
            }
            $(chatBlock).append(html)
        })
        $(chatBlock).scrollTop($(chatBlock)[0].scrollHeight);
    })
}