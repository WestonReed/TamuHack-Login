(function(){
    document.getElementById('metamask_login').addEventListener('click', (event) => {
        if(window.web3 === undefined) {
            Swal.fire('Metamask required', 'Lorem Ipsum is using next-generation blockchain authentication and requires that you have Metamask installed in your browser to securely, conveniently confirm your identity without passwords. <br><br>Please check out <a href=\"https://metamask.io/\">metamask.io</a>', 'error')
        }
        else {
            Swal.fire({
                title: 'Are you sure?',
                text: 'You will not be able to recover this imaginary file!',
                type: 'info',
                showCancelButton: true,
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'No, keep it'
              }).then((result) => {
                if (result.value) {
                  Swal.fire(
                    'Deleted!',
                    'Your imaginary file has been deleted.',
                    'success'
                  )
                // For more information about handling dismissals please visit
                // https://sweetalert2.github.io/#handling-dismissals
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                  Swal.fire(
                    'Cancelled',
                    'Your imaginary file is safe :)',
                    'error'
                  )
                }
              })
        }
    })
})();