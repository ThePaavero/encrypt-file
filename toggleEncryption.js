const Cryptr = require('cryptr')
const fs = require('fs')
const md5 = require('md5')

const HEADER_STRING = '<<< FILE IS ENCRYPTED >>>'

const filePath = process.argv[2]
const passPhrase = process.argv[3]
const cryptr = new Cryptr(passPhrase)

if (passPhrase.length < 4) {
  console.log('Pass phrase must be at least 4 characters long. Aborting.')
  return
}

const currentContent = fs.readFileSync(filePath).toString()
if (currentContent.indexOf(HEADER_STRING) === 0) {
  console.log('File is already encrypted, decrypting...')
  const lines = currentContent.split('\n')
  const md5Hash = lines[1]
  const stringToDecrypt = lines[2]
  const newContent = cryptr.decrypt(stringToDecrypt)
  if (md5(newContent) !== md5Hash) {
    console.log('Incorrect pass phrase. File *not* decrypted.')
    return
  }
  fs.writeFileSync(filePath, newContent)
  console.log('File has now been decrypted.')
  return
}

const newContent = HEADER_STRING +
  '\n' +
  md5(currentContent) +
  '\n' +
  cryptr.encrypt(currentContent)

fs.writeFileSync(filePath, newContent)

console.log('File has been encrypted.')
