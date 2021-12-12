let stompClient;

connect(localStorage.getItem("email"))

function connect( email) {
    console.log("connecting to chat...")
    let socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);
    subscrise(email)
}

function subscrise(email){
    stompClient.connect({}, function () {
        stompClient.send("/app/Register",{},JSON.stringify({email: email}))
        stompClient.subscribe("/topic/messages/" + email, function (response) {
            // let data = JSON.parse(response.body);
            // if (selectedUser === data.fromLogin) {
            //     render(data.message, data.fromLogin);
            // } else {
            //     newMessages.set(data.fromLogin, data.message);
            //     $('#userNameAppender_' + data.fromLogin).append('<span id="newMessage_' + data.fromLogin + '" style="color: red">+1</span>');
            // }
        });
    });
}