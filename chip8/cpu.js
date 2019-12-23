let memory //  = new Uint8Array(4096)
let registers = new Uint8Array(16)
let stack = new Uint16Array(16)
let ST = 0
let DT = 0
let I = 0
let SP = -1
let PC = 0x200
let halted = true
let soundEnabled = false

let dump = () => `
  registers: ${registers}
  ST: ${ST}
  DT: ${DT}
  I: ${I}
  SP: ${SP}
  PC: ${PC}
  halted: ${halted}
  soundEnabled: ${soundEnabled}
  stack: ${stack}
  memory: ${memory}
`
let loadMemoryFromBuffer = (buffer) => memory = new Uint8Array(buffer)

module.exports = {
  dump,
  loadMemoryFromBuffer
}
