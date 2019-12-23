let fs = require('fs').promises
let { parser, cpu } = require('./chip8')

let loadRom = async (rom) => {
  try {
    if(rom){
      let data = await fs.readFile(rom)
      cpu.loadMemoryFromBuffer(Buffer.from(data))
    }
  } catch (err) {
    console.error(err)
  }
}

let run = async () => {
  let rom = process.argv[2]
  await loadRom(rom)
  console.log(cpu.dump())
}

run()
