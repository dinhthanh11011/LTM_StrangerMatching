let element_chatBlock = "#chatting-block"

let currentUser = {}
let userRandom = {}

var TimeToMatching = 2 // phút

$(document).ready(() => {
    $("#modal-loader").modal("show")
    currentUser = getUserInfo("")
    connect(currentUser.email)

    loadTimeToMatching(TimeToMatching)

    $("#btn-goto-profile").click(e => {
        if (userRandom.email != null) {
            document.location = "/User/Profile/" + userRandom.email;
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Please waiting to matching!',
                showConfirmButton: true,
            })
        }
    })
})

function setUserMatchingInfo(user) {
    $("#user-avatar").attr("src", user.avatar.path)
    $("#user-name").html(user.name)
}

function loadTimeToMatching(minute) {
    minute = minute - 1
    let second = 59
    setInterval(() => {
        if (second == 0) {
            if(minute == 0){
                Swal.fire({
                    title: '<strong>Matching Failure</strong>',
                    icon: 'info',
                    html:'Không tìm thấy đối tượng nào phù hợp!',
                    timer:1000
                }).then(()=>{
                    document.location = "/"
                })
            }else{
                minute = minute - 1
                second = 59
            }
        }
        $("#element-time-to-matching").html(`0${minute}:${second}`)
        second = second - 1
    }, 1000)

}


function loadUserOnlineStatus(element, status) {
    if (status) {
        $(element).removeClass("offline")
    } else {
        $(element).addClass("offline")
    }
}