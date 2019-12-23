let fs = require('fs')
let { parser, disassembler } = require('./chip8')

let rom = process.argv[2]
if (!rom) {
  console.log('specify a ROM to disassemble')
  process.exit(1)
}

// read file and parse 2 bytes at a time
let input = fs.createReadStream(rom, {highWaterMark: 2})
let i = 0x0

input.on('data', (buffer) => {
  let opCode = (buffer[0] << 8) + buffer[1]
  let result = parser(disassembler, opCode)
  console.log(`0x${(i).toString(16).padStart(8, '0')}\t${opCode.toString(16).padStart(4, '0')}\t\t${result}`)
  i+=2
})

