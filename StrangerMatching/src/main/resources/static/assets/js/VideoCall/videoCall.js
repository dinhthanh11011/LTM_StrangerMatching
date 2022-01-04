let elementLocalVideo = "#video-local"
let elementRemoteVideo = "#video-remote"

let localStream = null
let remoteStream = null

let peer = new Peer();
let peerId = ""

var userVideoWith = {}


$(document).ready(() => {
    // bắt sự kiện mở modal
    $("#modal-video-call").on('show.bs.modal', (e) => {
        if (userVideoWith.isOnline) {
            OnShowModal()
        } else {
            Swal.fire({
                title: `This user is't online!`,
                icon: 'info'
            }).then(()=>{
                $("#modal-video-call").modal("hide")
            })
        }
    })

    // bắt sự kiện tắt modal
    $("#modal-video-call").on('hidden.bs.modal', (e) => {
        OnCloseModal()
    })

    // bắt đầu cuộc gọi
    $("#btn-start-video-call").on('click', (e) => {
        alert("á")
    })

})


// peer js
//===========================================================================





// video Stream function
//===========================================================================
function openStream() {
    let config = {audio: false, video: true}
    return navigator.mediaDevices.getUserMedia(config)
}

function playStream(elementVideo, stream) {
    let video = document.getElementById(elementVideo)
    video.srcObject = stream
    video.play()
}



function OnShowModal() {
    openStream().then(stream => {
        localStream = stream
        makeAVideoCall(userVideoWith.peerId)
    })
}

function makeAVideoCall(peerId){
    playStream(elementLocalVideo.substring(1), localStream)
    let call = peer.call(peerId, localStream)
    call.on('stream',remoteStream => playStream(elementRemoteVideo.substring(1), remoteStream))
}

peer.on('call',call=>{
    $("#modal-video-call").modal("show")
    // openStream().then(stream=>{
    //     call.answer(stream)
    //     playStream(elementLocalVideo,stream)
    //     call.on('stream',remoteStream => playStream(elementRemoteVideo.substring(1), remoteStream))
    // })
})

function OnCloseModal() {
    if (localStream != null) {
        localStream.getTracks().forEach(function (track) {
            track.stop();
        });
    }
    if (remoteStream != null) {
        remoteStream.getTracks().forEach(function (track) {
            track.stop();
        });
    }
}