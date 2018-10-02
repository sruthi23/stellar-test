var StellarSdk = require('stellar-sdk')
StellarSdk.Network.useTestNetwork()
var server = new StellarSdk.Server('https://horizon-testnet.stellar.org')
var pair
var sourceSecretKey
var sourcePublicKey
var sourceKeypair

// creating new account
function createAccount (callback) {
  pair = StellarSdk.Keypair.random()
  sourceSecretKey = pair.secret()
  sourcePublicKey = pair.publicKey()
  var request = require('request')
  request.get(
    {
      url: 'https://horizon-testnet.stellar.org/friendbot',
      qs: { addr: pair.publicKey() },
      json: true
    },
    function (error, response, body) {
      if (error || response.statusCode !== 200) {
        console.error('ERROR!', error || body)
      } else {
        console.log('SUCCESS! You have a new account :)\n', body)
        console.log('sourcepubkey' + ' ' + ':' + ' ' + sourcePublicKey)
        console.log('sourcesecretkey' + ' ' + ':' + ' ' + sourceSecretKey)
        var amount = '350.1234567'
        var receiverPublicKey =
  'GCYULF7ZDUMFYCP47YQ2LE3VHGYXZZRFLB3PTYMOZK4BHCCC7RBZLOIX'
        getBalance(sourcePublicKey, function (err, result) {})
        sendStellar(sourcePublicKey, receiverPublicKey, sourceSecretKey, amount)
      }
    })
}

// call to createAccount
createAccount(function (err, result) {
  if (err) {
    console.log('account creation failed')
  } else {
    console.log('syccess')
  }
})

// For getting balance of given account
function getBalance (pubkey, callback) {
  console.log('#######pubkey###' + '  ' + pubkey)
  server
    .loadAccount(pubkey)
   .then(function (account) {
     console.log('Balances for account: ' + pubkey)
     account.balances.forEach(function (balance) {
       console.log(
                 'Type:',
                  balance.asset_type,
                  ', Balance:',
                  balance.balance
                   )
     })
   }).catch(function (err) {
     console.error(err)
   })
}
// sending stellar
function sendStellar (sourcePublicKey, receiverPublicKey, sourceSecretKey, amount, cb) {
  sourceKeypair = StellarSdk.Keypair.fromSecret(sourceSecretKey)

  server
      .loadAccount(sourcePublicKey)
      .then(function (account) {
        var transaction = new StellarSdk.TransactionBuilder(account)
          .addOperation(
                  StellarSdk.Operation.payment({
                    destination: receiverPublicKey,
                    asset: StellarSdk.Asset.native(),
                    amount: amount
                  })
              )
          .build()
        transaction.sign(sourceKeypair)
        console.log(transaction.toEnvelope().toXDR('base64'))

        server
               .submitTransaction(transaction)
               .then(function (transactionResult) {
                 console.log(JSON.stringify(transactionResult, null, 2))
                 console.log('\nSuccess! View the transaction at: ')
                 console.log(transactionResult._links.transaction.href)
               })
                  .catch(function (err) {
                    console.log('An error has occured:')
                    console.log(err)
                  })
      })
      .catch(function (e) {
        console.error(e)
      })
}
sendStellar(function (err, result) {
  if (err) {
    console.error(err)
    console.log('Transaction failed')
  } else {
    return console.log('success')
  }
})

