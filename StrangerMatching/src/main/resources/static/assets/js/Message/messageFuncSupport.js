function loadMessages(element_chatBlock, currentUserEmail, userChatWithEmail) {
    $.ajax({
        url: "/api/Message?emailOne=" + currentUserEmail + "&emailTwo=" + userChatWithEmail,
        method: "GET"
    }).done(data => {
        $(`${element_chatBlock} div`).remove()
        data.forEach(item => {
            let html = ``
            if (item.sendFrom.email == currentUserEmail) {
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
            $(element_chatBlock).append(html)
        })
        $(element_chatBlock).scrollTop($(element_chatBlock)[0].scrollHeight);
    })
}


function receiveMessage(element_chatBlock, message, sendFrom) {
    if (message.sendFrom.email == sendFrom.email) {
        $(element_chatBlock).append(`
            <div class="d-flex justify-content-start mb-4">
                <div class="img_cont_msg">
                    <img src="${message.sendFrom.avatar.path}"
                        class="rounded-circle user_img_msg">
                </div>
                <div class="msg_cotainer" style="min-width: 120px">
                     ${message.text}
                    <span class="msg_time">${new Date(message.createdDate).toLocaleString()}</span>
                </div>
            </div>
        `)
        $(element_chatBlock).scrollTop($(element_chatBlock)[0].scrollHeight);
    }
}

function sendMessage(data, element_chatBlock) {
    stompClient.send("/app/Message/" + data.sendTo.email, {}, JSON.stringify(data))
    $(element_chatBlock).append(`
         <div class="d-flex justify-content-end mb-4">
            <div class="msg_cotainer_send" style="min-width: 120px">
                ${data.text}
                <span class="msg_time_send">${new Date().toLocaleString()}</span>
            </div>
            <div class="img_cont_msg">
                <img src="${data.sendFrom.avatar.path}" class="rounded-circle user_img_msg">
            </div>
        </div>
    `)
    $(element_chatBlock).scrollTop($(element_chatBlock)[0].scrollHeight);
}