var rootURL = "/api/"
var userURL = rootURL + "User"

let element_chatBlock = "#chatting-block"


var listAllUsers = []

var currentUser = {}
var userSelected = {}

$(document).ready(() => {
    currentUser = getUserInfo("")
    listAllUsers = getAllUser()
    connect(currentUser.email)
    if (listAllUsers.length > 0) {
        userSelected = listAllUsers[0]
        userVideoWith = userSelected
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
        document.location = "/User/Profile/" + userSelected.email;
    })


})

// search theo tên, email, giới tính, giới tính sở thích, tuổi
function searchUser(searchKey) {
    searchKey = nonAccentVietnamese(searchKey)
    loadListUser(listAllUsers.filter(item =>
        nonAccentVietnamese(item.name).includes(searchKey)
        || nonAccentVietnamese(item.email).includes(searchKey)
        || nonAccentVietnamese(item.gender.name).includes(searchKey))
        || nonAccentVietnamese(item.age).includes(searchKey)
    )
}

function nonAccentVietnamese(str) {
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
}

function selectionUser(userEmail) {
    userSelected = listAllUsers.find(item => item.email == userEmail)
    userVideoWith = userSelected
    loadMessages(element_chatBlock, currentUser.email, userSelected.email)
    loadUserChatWithInfo(userSelected)
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
                        <div class="text-white" style="white-space: normal;" ><small>${item.story != null ? item.story : "..."}</small></div>
                    </div>
                </div>
            </a>
        </li>
        `
        $(element_UserList).append(html)
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
