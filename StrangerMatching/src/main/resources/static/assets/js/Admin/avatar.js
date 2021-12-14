$(document).ready(() => {
    $("#form-create-avatar").submit(e => {
        e.preventDefault()
        Swal.fire({
            title: 'Do you want to create an avatar?',
            showCancelButton: true,
            confirmButtonText: 'create',
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "/api/Avatar",
                    method: "POST",
                    data: new FormData($(e.target)[0]),
                    contentType: false,
                    processData: false,
                }).done(res => {
                    Swal.fire({
                        position: 'top-end',
                        icon: 'success',
                        title: res,
                        timer: 800
                    })
                    $(e.target)[0].reset()
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