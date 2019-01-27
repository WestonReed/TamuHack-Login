(function(){
    // When the login button is clicked
    document.getElementById('metamask_login').addEventListener('click', (event) => {
        // Check if web3/Metamask is installed
        if(window.web3 === undefined) {
            Swal.fire('Metamask required', 'Lorem Ipsum is using next-generation blockchain authentication and requires that you have Metamask installed in your browser to securely, conveniently confirm your identity without passwords. <br><br>Please check out <a href=\"https://metamask.io/\">metamask.io</a>', 'error')
        }
        else {
            // Guide to what the user is about to consent to
            Swal.fire({
                title: 'Here\'s how this works',
                html: 'To confirm that you really do have access to the Ethereum address that your browser claims you have, we\'re going to ask Metamask to verify a set of special <span style="font-family: monospace;">code words</span> we have in mind.<br><br>This requires your intervention, so please confirm your identity by signing the following message for us.',
                type: 'info',
                showCancelButton: true,
                confirmButtonText: 'Open Metamask'
            }).then((result) => {
                if(result.dismiss !== 'cancel') {
                    // Retrieve the nonce
                    fetch('/api/nonce', {
                        method: 'POST',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            public_address: web3.eth.coinbase
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        // If the nonce was provided
                        if(data.status === 'success') {
                            // Prompt Metamask to sign the nonce
                            web3.personal.sign(data.payload.nonce, web3.eth.coinbase,(err, signature) => {
                                // Send the signature (+ethereum address) back for verification
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
                                    // If the server confirms our identity (and assigns us a session cookie)
                                    if(data.status === 'success') {
                                        // Redirect to go look at the super duper sensitive information
                                        document.location.href = '/private'
                                    }
                                    else {
                                        // For one reason or another, something went wrong: just display the JSON response
                                        Swal.fire('Something went wrong.', JSON.stringify(data), 'error')
                                    }
                                })
                            });
                        }
                        else {
                            // For one reason or another, something went wrong: just display the JSON response
                            Swal.fire('Something went wrong.', JSON.stringify(data), 'error')
                        }
                    })
                }
                else {
                    // do nothing
                }
            })
        }
    })
})();