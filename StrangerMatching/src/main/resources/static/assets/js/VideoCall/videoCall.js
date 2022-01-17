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
        $("#btn-start-video-call").removeClass("d-none")
    })

    // bắt sự kiện tắt modal
    $("#modal-video-call").on('hidden.bs.modal', (e) => {
        closeStreamAndEndCall()
    })

    // bắt đầu cuộc gọi
    $("#btn-start-video-call").on('click', (e) => {
        if (userVideoWith.isOnline) {
            makeAVideoCall()
        } else {
            Swal.fire({
                title: `This user is offline!`,
                icon: 'info'
            }).then(() => {
                $("#modal-video-call").modal("hide")
            })
        }
    })
})

// video Stream function
//===========================================================================
function openStream() {
    let constraints = {audio: true, video: true}
    return navigator.mediaDevices.getUserMedia(constraints)
}

function playStream(elementVideo, stream) {
    let video = document.getElementById(elementVideo)
    video.srcObject = stream
    video.play()
}

function makeAVideoCall() {
    openStream().then(stream => {
        localStream = stream
        playStream(elementLocalVideo.substring(1), localStream)
        let call = peer.call(userVideoWith.peerId, localStream)
        call.on('stream', stream => {
            $("#btn-start-video-call").addClass("d-none")
            remoteStream = stream
            playStream(elementRemoteVideo.substring(1), remoteStream)
        })
    })
}


peer.on('call', call => {
    if (remoteStream == null) {
        Swal.fire({
            title: 'A calling!',
            html: 'Do you want to accept this call?',
            showCancelButton: true,
            confirmButtonText: 'accept',
        }).then((result) => {
            if (result.isConfirmed) {
                $("#modal-video-call").modal("show")
                $("#btn-start-video-call").addClass("d-none")
                remoteCalling = call
                openStream().then(stream => {
                    call.answer(stream)

                    localStream = stream
                    playStream(elementLocalVideo.substring(1), localStream)

                    call.on('stream', stream => {
                        remoteStream = stream
                        playStream(elementRemoteVideo.substring(1), remoteStream)
                    })
                })
            }
        })
    }
})


function closeStreamAndEndCall() {
    if (localStream != null) {
        localStream.getTracks().forEach(function (track) {
            track.stop();
        });
        localStream = null
    }
    if (remoteStream != null) {
        remoteStream.getTracks().forEach(function (track) {
            track.stop();
        });
        remoteStream = null
    }
}