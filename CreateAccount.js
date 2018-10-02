var StellarSdk = require('stellar-sdk')

var pair = StellarSdk.Keypair.random()

var s = pair.secret()
var p = pair.publicKey()
console.log('public key', p)
console.log('secret key', s)
// var seed = pair.toString('utf8')
// console.log('pair', pair._secretseed)
var request = require('request')
request.get({
  url: 'https://friendbot.stellar.org',
  qs: { addr: p },
  json: true
}, function (error, response, body) {
  if (error || response.statusCode !== 200) {
    console.error('ERROR!', error || body)
  } else {
    console.log('SUCCESS! You have a new account :)\n', body)
  }
})
