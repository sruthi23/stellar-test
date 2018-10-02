var StellarSdk = require('stellar-sdk')
var sourceKeys = StellarSdk.Keypair
  .fromSecret('SCZANGBA5YHTNYVVV4C3U252E2B6P6F5T3U6MM63WBSBZATAQI3EBTQ4')
var p = sourceKeys.publicKey()
console.log('pubkey', p)

/* var request = require('request')
request.get({
  url: 'https://friendbot.stellar.org',
  qs: { addr: p},
  json: true
}, function (error, response, body) {
  if (error || response.statusCode !== 200) {
    console.error('ERROR!', error || body)
  } else {
    console.log('SUCCESS! You have a new account :)\n', body)
  }
}) */
