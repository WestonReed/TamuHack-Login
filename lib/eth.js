const _ = {};

const ethUtil = require('ethereumjs-util')
const eth = require('eth-sig-util')
var CryptoJS = require('crypto-js');
var sha3 = require('crypto-js/sha3');

/**
* Accepts plaintext and signature provided by Metamask and computes the Ethereum addressed used to generate the signature.
* @param {string} text - The plaintext that was signed in Metamask.
* @param {string} metamask_sig - The signature provided by Metamask.
*/
_.verify = (text, metamask_sig) => {
	return eth.recoverPersonalSignature({
		data: ethUtil.bufferToHex(new Buffer.from(text, 'utf8')), 
		sig: metamask_sig
	});
};

// Source: https://gist.github.com/6174/6062387#gistcomment-2651745
_.nonce = (length) => {
    if(length === undefined) length = 32
    return [...Array(length)].map(i=>(~~(Math.random()*36)).toString(36)).join('');
}


// Stolen from: https://github.com/ethereum/go-ethereum/blob/aa9fff3e68b1def0a9a22009c233150bf9ba481f/jsre/ethereum_js.go
// https://ethereum.stackexchange.com/questions/1374/how-can-i-check-if-an-ethereum-address-is-valid
/**
 * Checks if the given string is an address
 *
 * @method isAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
_.isAddress = function (address) {
    if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
        // check if it has the basic requirements of an address
        return false;
    } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
        // If it's all small caps or all all caps, return true
        return true;
    } else {
        // Otherwise check each case
        return _.isChecksumAddress(address);
    }
};

/**
 * Checks if the given string is a checksummed address
 *
 * @method isChecksumAddress
 * @param {String} address the given HEX adress
 * @return {Boolean}
*/
_.isChecksumAddress = function (address) {
    // Check each case
    address = address.replace('0x','');
    var addressHash = sha3(address.toLowerCase());
    for (var i = 0; i < 40; i++ ) {
        // the nth letter should be uppercase if the nth digit of casemap is 1
        if ((parseInt(addressHash[i], 16) > 7 && address[i].toUpperCase() !== address[i]) || (parseInt(addressHash[i], 16) <= 7 && address[i].toLowerCase() !== address[i])) {
            return false;
        }
    }
    return true;
};

module.exports = _;