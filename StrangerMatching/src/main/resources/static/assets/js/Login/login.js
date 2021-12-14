let loginUrl = "/api/User/Login"

$(document).ready(() => {
    $("#post-form-login").submit(e => {
        e.preventDefault()
        $.ajax({
            url: loginUrl,
            method: "POST",
            data: JSON.stringify($(e.target).serializeFormJSON()),
            contentType: "application/json",
        }).done(res => {
            localStorage.setItem("email", res.email)
            document.location = "/"
        }).fail(err => {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: err.responseText,
            })
        })
    })
});

