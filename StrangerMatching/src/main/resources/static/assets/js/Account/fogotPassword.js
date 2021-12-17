
$(document).ready(()=>{
    $("#form-post-fogotpassword").submit(e=>{
        e.preventDefault()
        Swal.fire({
            title: 'Do you want to reset your password?',
            showCancelButton: true,
            confirmButtonText: 'reset',
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "/api/User/FogotPassword",
                    method: "POST",
                    data: JSON.stringify($(e.target).serializeFormJSON()),
                    contentType:"application/json"
                }).done(res => {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: res,
                        timer: 800
                    }).done(()=>{
                        document.location = "/Login"
                    })
                }).fail(err => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: err.responseText,
                    })
                })
            }
        })
    })
})