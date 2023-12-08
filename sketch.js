// the virtual nuChip class
class ChipClass {
  constructor(){
    this.memory = new Uint16Array(8192);
    this.framebuffer = new Uint32Array(49152);
    this.stack = new Uint16Array(32);
    this.registers = new Uint16Array(32);
    
    this.PC = 512;
    this.SP = 0;
    this.DT = 0;
    this.SSA = [[],[],[],[],[],[]];
    this.GFXP = 0;
    this.I = 0;
    this.FL = 0;
    
    this.GfxBuffer = createGraphics(256,192);
  }
}

var nuChip;

let Opcodes = [
  [["BRK",1],["LDFB",6],["LDFBVX",6]],
  [["LDREG",3],["ADDREG",3],["VXRAND",3]],
  [["JMP",2]],
]

let Program = [
  0x21, 0x00, 0xFF,
  0x21, 0x01, 0xFF,
  0x21, 0x02, 0xFF,
  0x21, 0x03, 0xFF,
  0x21, 0x04, 0xFF,
  0x20, 0x03, 0x04, 0x00, 0x01, 0x02,
  0x02, 0x200,
]

// setup function
function setup() {
  // create the actual workable canvas
  createCanvas(256*windowHeight/192, 192*windowHeight/192);
  
  // create an instance of "ChipClass"
  nuChip = new ChipClass();
  
  nuChip.GfxBuffer.noStroke();
  noSmooth();
  
  // put program into memory.
  for(let i = 0; i<Program.length; i++){
    nuChip.memory[i+512] = Program[i];
  }
}

// general loop
function draw() {
  for(let i = 0; i<1000; i++){
    let opcode = fetch();
    let decoded = decode(opcode);
    execute(decoded);
  }
  
  screenRefresh();

  fill("white");
  text(frameRate(),0,10);
}

// fetch, decode, execute loop
function fetch() {
  return nuChip.memory[nuChip.PC];
}

function decode(opcode){
  let row = Opcodes[opcode&0xF];
  let instruction = row[(opcode&0xF0)/0x10];
  let values = [];
  
  for(let i = 1; i<instruction[1]; i++){
    append(values,nuChip.memory[i+nuChip.PC]);
  }
  
  nuChip.PC+=instruction[1];
  return [instruction,values];
}

function execute(instArray){
  let values = instArray[1];
  switch (instArray[0][0]) {
    case "BRK":
      break;
      
    case "LDFB":
      nuChip.framebuffer[(nuChip.registers[values[0]]%257)+nuChip.registers[values[1]]*255] = values[2]*0x10000+values[3]*0x100+values[4];
      break;
      
    case "LDFBVX":
      nuChip.framebuffer[(nuChip.registers[values[0]]%257)+nuChip.registers[values[1]]*255] = nuChip.registers[values[2]]*0x10000+nuChip.registers[values[3]]*0x100+nuChip.registers[values[4]];
      break;
      
    case "LDREG":
      nuChip.registers[values[0]]=values[1];
      break;

    case "ADDREG":
      nuChip.registers[values[0]]+=values[1];
      break;

    case "VXRAND":
      nuChip.registers[values[0]] = floor(random(255)) & values[1];
      break;

    case "JMP":
      nuChip.PC = values[0];
      break;
      
    default:
      break;
  }
}

// screen refresh
function screenRefresh() {
  nuChip.GfxBuffer.background(0);

  nuChip.GfxBuffer.loadPixels();
  
  for(let i = 0; i<nuChip.framebuffer.length; i++){
    let r = (nuChip.framebuffer[i]&0xFF0000)/0x10000;
    let g = (nuChip.framebuffer[i]&0x00FF00)/0x100;
    let b = nuChip.framebuffer[i]&0x0000FF;
    let clr = color(r,g,b);
    nuChip.GfxBuffer.pixels[(i*4)] = red(clr);
    nuChip.GfxBuffer.pixels[(i*4)+1] = green(clr);
    nuChip.GfxBuffer.pixels[(i*4)+2] = blue(clr);
  }

  nuChip.GfxBuffer.updatePixels();
  
  image(nuChip.GfxBuffer,0,0,width,height);
}

// resize canvas (when window is resized)
function windowResized(){
  resizeCanvas(256*windowHeight/192, 192*windowHeight/192)
}