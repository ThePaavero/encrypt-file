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
  console.log('File has now been encrypted.')
  return
}

const newContent = HEADER_STRING +
  '\n' +
  md5(currentContent) +
  '\n' +
  cryptr.encrypt(currentContent)

console.log(newContent)
