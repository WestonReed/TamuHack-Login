(function(){
    document.getElementById('metamask_login').addEventListener('click', (event) => {
        if(window.web3 === undefined) {
            Swal.fire('Metamask required', 'Lorem Ipsum is using next-generation blockchain authentication and requires that you have Metamask installed in your browser to securely, conveniently confirm your identity without passwords. <br><br>Please check out <a href=\"https://metamask.io/\">metamask.io</a>', 'error')
        }
        else {
            Swal.fire({
                title: 'Here\'s how this works',
                html: 'To confirm that you really do have access to the Ethereum address that your browser claims you have, we\'re going to ask Metamask to verify a set of special <span style="font-family: monospace;">code words</span> we have in mind.<br><br>This requires your intervention, so please confirm your identity by signing the following message for us.',
                type: 'info',
                showCancelButton: true,
                confirmButtonText: 'Open Metamask'
            }).then((result) => {
                fetch('/api/nonce', {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        public_address: web3.eth.coinbase
                    })
                })
                .then(res => res.json())
                .then(data => {
                    if(data.status === 'success') {
                        web3.personal.sign(data.payload.nonce, web3.eth.coinbase,(err, signature) => {
                            fetch('/api/verify', {
                                method: 'POST',
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    public_address: web3.eth.coinbase,
                                    signature: signature
                                })
                            })
                            .then(res => res.json())
                            .then(data => {
                                if(data.status === 'success') {
                                    document.location.href = '/private'
                                }
                            })
                        });
                    }
                    else {
                        Swal.fire('Something went wrong.', JSON.stringify(data), 'error')
                    }
                })
            })
        }
    })
})();