let getParams = (opCode) => {
  let x = (opCode & 0x0F00) >> 8
  let y = (opCode & 0x00F0) >> 4
  let kk = opCode & 0x00FF
  let nnn = opCode & 0x0FFF
  let n = opCode & 0x000F
  let firstNibble =  opCode & 0xF000

  return {
    opCode,
    x,
    y,
    kk,
    nnn,
    n,
    firstNibble,
    toString: () => `
      opCode: ${opCode.toString(16)},
      x: ${x.toString(16)},
      y: ${y.toString(16)},
      kk: ${kk.toString(16)},
      nnn: ${nnn.toString(16)},
      n: ${n.toString(16)},
      firstNibble: ${firstNibble.toString(16)},
    `
  }
}

module.exports = (processor, opCode) => {

  if (opCode == 0x00E0) return processor.CLS()
  if (opCode == 0x00EE) return processor.RET()

  let params = getParams(opCode)

  let opCodes = {
    0x0000: (params) => processor.SYS(params.nnn),
    0x1000: (params) => processor.JP(params.nnn),
    0x2000: (params) => processor.CALL(params.nnn),
    0x3000: (params) => processor.SE(params.x, params.kk),
    0x4000: (params) => processor.SNE(params.x, params.kk),
    0x5000: (params) => processor.SE_XY(params.x, params.y),
    0x6000: (params) => processor.LD(params.x, params.kk),
    0x7000: (params) => processor.ADD(params.x, params.kk),
    0x8000: (params) => {
      return {
        0x0: (params) => processor.LD_XY(params.x, params.y),
        0x1: (params) => processor.OR_XY(params.x, params.y),
        0x2: (params) => processor.AND_XY(params.x, params.y),
        0x3: (params) => processor.XOR_XY(params.x, params.y),
        0x4: (params) => processor.ADD_XY(params.x, params.y),
        0x5: (params) => processor.SUB_XY(params.x, params.y),
        0x6: (params) => processor.SHR_XY(params.x, params.y),
        0x7: (params) => processor.SUBN_XY(params.x, params.y),
        0xE: (params) => processor.SHL_XY(params.x, params.y)
      }[params.n](params) // last nibbble
    },
    0x9000: (params) => processor.SNE_XY(params.x, params.y),
    0xA000: (params) => processor.LD_I(params.nnn),
    0xB000: (params) => processor.JP_V0(params.nnn),
    0xC000: (params) => processor.RND(params.x, params.kk),
    0xD000: (params) => processor.DRW(params.x, params.y, params.n),
    0xE000: (params) => {
      return {
        0x9E: (params) => processor.SKP(params.x),
        0xA1: (params) => processor.SKNP(params.x),
      }[params.kk](params) // last 2
    },
    0xF000: (params) => {
      return {
        0x07: (params) => processor.LD_XDT(params.x),
        0x0A: (params) => processor.LD_XK(params.x),
        0x15: (params) => processor.LD_DTX(params.x),
        0x18: (params) => processor.LD_STX(params.x),
        0x1E: (params) => processor.ADD_IX(params.x),
        0x29: (params) => processor.LD_FX(params.x),
        0x33: (params) => processor.LD_BX(params.x),
        0x55: (params) => processor.LD_IX(params.x),
        0x65: (params) => processor.LD_XI(params.x),
      }[params.kk](params) // last 2
    },
  }

  try {
    return opCodes[params.firstNibble](params)
  } catch (err) {
    // console.error(params.toString())
    return 'invalid'
  }
}
