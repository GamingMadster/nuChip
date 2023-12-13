// the virtual nuChip class
class ChipClass {
  constructor(){
    this.memory = new Uint16Array(16384);
    this.framebuffer = new Uint32Array(49152);
    this.gfx = new Uint32Array(8192);
    this.stack = new Uint16Array(32);
    this.registers = new Uint16Array(32);
    
    this.PC = 0;
    this.SP = 0;
    this.DT = 0;
    this.SO = [new p5.Oscillator("square"),new p5.Oscillator("square"),new p5.Oscillator("sawtooth"),new p5.Oscillator("sawtooth"),new p5.Oscillator("triangle"),new p5.Oscillator("triangle")];
    this.GFXP = 0;
    this.I = 0;
    this.FL = 0;
    
    this.GfxBuffer = createGraphics(256,192);
  }
}

var nuChip;

var ProgramButton;

let keys = [
  "x",
  "1",
  "2",
  "3",
  "q",
  "w",
  "e",
  "a",
  "s",
  "d",
  "z",
  "c",
  "4",
  "r",
  "f",
  "v",
];

let Opcodes = [
  [["BRK",1],["CLRFB",1],["FILL",4],["LDFB",6],["LDFBVX",6],["RDGFX",6],["WRGFX",5],["LDGFX",3],["LDGP",3],["ADDGP",3],["LORES",1],["HIRES",1]],
  [["LDREG",4],["ADDREG",4],["SUBREG",4],["VXRAND",3],["LDDT",2],["LDVXVY",3],["ADDVXVY",3],["SUBVXVY",3],["VXORVY",3],["VXXORVY",3],["VXANDVY",3],["LDI",3]],
  [["IFEV",2],["IFODD",2]],
  [["JMP",3],["JMPEQ",5],["JMPFL",4],["JMPKEY",4]],
  [["WAITDT",1]],
  [["SETFRQ",3],["ADDFRQ",3],["SUBFRQ",3]],
]

let Font = [
  0x000000,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0xFFFFFF,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0x000000, //0
  0x000000,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0xFFFFFF,0xFFFFFF,0x5F5F5F, //1
  0x000000,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0xFFFFFF,0xFFFFFF,0x5F5F5F, //2
  0xFFFFFF,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0xFFFFFF,0xFFFFFF,0x5F5F5F,0x000000, //3
  0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0xFFFFFF,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F, //4
  0xFFFFFF,0xFFFFFF,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0xFFFFFF,0xFFFFFF,0x5F5F5F,0x000000, //5
  0x000000,0xFFFFFF,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0xFFFFFF,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0xFFFFFF,0x5F5F5F, //6
  0xFFFFFF,0xFFFFFF,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0x000000, //7
  0x000000,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0x000000, //8
  0x000000,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0xFFFFFF,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0xFFFFFF,0xFFFFFF,0x5F5F5F,0x000000, //9
  0x000000,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0xFFFFFF,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F, //A
  0xFFFFFF,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0xFFFFFF,0x5F5F5F,0x000000, //B
  0x000000,0xFFFFFF,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0x000000,0xFFFFFF,0xFFFFFF,0x5F5F5F, //C
  0xFFFFFF,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0xFFFFFF,0x5F5F5F,0x000000, //D
  0xFFFFFF,0xFFFFFF,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0xFFFFFF,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0xFFFFFF,0xFFFFFF,0x5F5F5F, //E
  0xFFFFFF,0xFFFFFF,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0xFFFFFF,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0x000000, //F
  0x000000,0xFFFFFF,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0xFFFFFF,0x5F5F5F, //G
  0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0xFFFFFF,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F, //H
  0xFFFFFF,0xFFFFFF,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0xFFFFFF,0xFFFFFF,0x5F5F5F, //I
  0x000000,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0xFFFFFF,0xFFFFFF,0x5F5F5F,0x000000, //J
  0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F, //K
  0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0xFFFFFF,0xFFFFFF,0x5F5F5F, //L
  0xFFFFFF,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0xFFFFFF,0xFFFFFF,0x5F5F5F,0xFFFFFF,0xFFFFFF,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F, //M
  0xFFFFFF,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F, //N
  0x000000,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0x000000, //O
  0xFFFFFF,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0x000000, //P
  0x000000,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0xFFFFFF,0x5F5F5F,0x000000,0xFFFFFF,0x5F5F5F,0x000000,0x000000,0x000000,0xFFFFFF,0x5F5F5F, //Q
]

let Program = [
  0x03, 0x00, 0x00,
]

function loadROM(file){
  loadBytes(file.data,function callback(data){
    // reset values
    nuChip.memory = new Uint16Array(16384);
    nuChip.framebuffer = new Uint32Array(49152);
    nuChip.gfx = new Uint32Array(8192);
    nuChip.stack = new Uint16Array(32);
    nuChip.registers = new Uint16Array(32);
    
    nuChip.PC = 0;
    nuChip.SP = 0;
    nuChip.DT = 0;
    nuChip.GFXP = 0;
    nuChip.I = 0;
    nuChip.FL = 0;
    
    // reload font
    for(let i = 0; i<Font.length; i++){
      nuChip.gfx[i] = Font[i];
    }
    
    // load file
    console.log("The File Loaded is "+data.bytes.length+" bytes.");
    console.log("Bytes left: "+(nuChip.memory.length-data.bytes.length)+" bytes.")
    for(let i = 0; i<data.bytes.length; i++){
      nuChip.memory[i] = data.bytes[i];
    }
    
    // reset oscillators
    for(let i = 0; i<nuChip.SO.length; i++){
      nuChip.SO[i].freq(0);
    }
  })
}

// setup function
function setup() {
  userStartAudio();
  
  // buttons
  ProgramButton = createFileInput(loadROM);
  
  // create the actual workable canvas
  createCanvas(256*windowWidth/256, 192*windowWidth/256);
  
  // create an instance of "ChipClass"
  nuChip = new ChipClass();
  
  nuChip.GfxBuffer.noStroke();
  noSmooth();
  
  // put program into memory.
  console.log("Program is "+Program.length+" bytes.");
  console.log("Bytes left: "+(nuChip.memory.length-Program.length)+" bytes.");
  for(let i = 0; i<Program.length; i++){
    nuChip.memory[i] = Program[i];
  }

  // put the font into the gfx memory
  console.log("Font is "+Font.length+" bytes.");
  console.log("Bytes left: "+(nuChip.gfx.length-Font.length)+" bytes.");
  for(let i = 0; i<Font.length; i++){
    nuChip.gfx[i]=Font[i];
  }
  
  // load up the oscillators
  for(let i = 0; i<nuChip.SO.length; i++){
    nuChip.SO[i].start();
    nuChip.SO[i].freq(0);
    nuChip.SO[i].amp(0.1);
  }
}

// general loop
function draw() {
  // main loop
  for(let i = 0; i<2000; i++){
    let opcode = Fetch();
    let decoded = decode(opcode);
    execute(decoded);
  }
  
  // dt decrease
  if(nuChip.DT>0)nuChip.DT-=1;
  
  // refresh
  screenRefresh();

  // debug text
  fill("white");
  stroke("black");
  strokeWeight(2);
  if(keyIsDown(73))text(frameRate(),0,10);
}

// fetch, decode, execute loop
function Fetch() {
  return nuChip.memory[nuChip.PC];
}

function decode(opcode){
  let row = Opcodes[opcode&0xF];

  if(row==undefined){
    console.error("INVALID INSTRUCTION.", nuChip.PC, opcode, row);
    noLoop();
  }
  
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

    case "CLRFB":
      for(let i = 0; i<nuChip.framebuffer.length; i++){
        nuChip.framebuffer[i] = 0;
      }
      break;
      
    case "FILL":
      for(let i = 0; i<nuChip.framebuffer.length; i++){
        nuChip.framebuffer[i] = values[0]*0x10000+values[1]*0x100+values[2];
      }
      break;
      
    case "LDFB":
      nuChip.FL = 0;
      
      if(nuChip.framebuffer[(nuChip.registers[values[0]]&0x1FFF)+nuChip.registers[values[1]]*nuChip.GfxBuffer.width]>0)nuChip.FL = 1;
      nuChip.framebuffer[(nuChip.registers[values[0]]&0x1FFF)+nuChip.registers[values[1]]*nuChip.GfxBuffer.width] = values[2]*0x10000+values[3]*0x100+values[4];
      break;
      
    case "LDFBVX":
      nuChip.FL = 0;
      
      if(nuChip.framebuffer[(nuChip.registers[values[0]]&0x1FFF)+nuChip.registers[values[1]]*nuChip.GfxBuffer.width]>0)nuChip.FL = 1;
      nuChip.framebuffer[(nuChip.registers[values[0]]&0x1FFF)+nuChip.registers[values[1]]*nuChip.GfxBuffer.width] = nuChip.registers[values[2]]*0x10000+nuChip.registers[values[3]]*0x100+nuChip.registers[values[4]];
      break;

    case "RDGFX":
      nuChip.FL = 0;
      
      let posX = nuChip.registers[values[0]]%nuChip.GfxBuffer.width;
      let posY = nuChip.registers[values[1]]%nuChip.GfxBuffer.height;
      let sizeX = values[2];
      let sizeY = values[3];

      for(let i = 0; i<sizeY; i++){
        for(let o = 0; o<sizeX; o++){
          if(nuChip.framebuffer[(o+i*nuChip.GfxBuffer.width)+(posX+posY*nuChip.GfxBuffer.width)]>0)nuChip.FL = 1;
          if(values[4]==0x1){
            if(nuChip.gfx[(o+i*sizeX)+nuChip.GFXP]!=0)nuChip.framebuffer[(o+i*nuChip.GfxBuffer.width)+(posX+posY*nuChip.GfxBuffer.width)] = nuChip.gfx[(o+i*sizeX)+nuChip.GFXP];
          }else{
            nuChip.framebuffer[(o+i*nuChip.GfxBuffer.width)+(posX+posY*nuChip.GfxBuffer.width)] = nuChip.gfx[(o+i*sizeX)+nuChip.GFXP];
          }
        }
      }
      break;
      
    case "WRGFX":
      nuChip.gfx[values[0]+Font.length] = values[1]*0x10000+values[2]*0x100+values[3];
      break;
      
    case "LDGFX":
      for(let i = 0; i<(values[0]*0x100+values[1])*3; i+=3){
        nuChip.gfx[i/3+Font.length] = nuChip.memory[i+nuChip.I]*0x10000+nuChip.memory[i+nuChip.I+1]*0x100+nuChip.memory[i+nuChip.I+2];
      }
      break;

    case "LDGP":
      nuChip.GFXP = values[0]*0x100+values[1];
      break;

    case "ADDGP":
      nuChip.GFXP += values[0]*0x100+values[1];
      break;
      
    case "LORES":
      nuChip.GfxBuffer.resizeCanvas(128,96);
      nuChip.framebuffer = new Uint32Array(12288);
      break;
      
    case "HIRES":
      nuChip.GfxBuffer.resizeCanvas(256,192);
      nuChip.framebuffer = new Uint32Array(49152);
      break;
      
    case "LDREG":
      nuChip.registers[values[0]]=values[1]*0x100+values[2];
      break;

    case "ADDREG":
      nuChip.registers[values[0]]+=values[1]*0x100+values[2];
      break;
      
    case "SUBREG":
      nuChip.registers[values[0]]-=values[1]*0x100+values[2];
      break;

    case "VXRAND":
      nuChip.registers[values[0]] = floor(random(255)) & values[1];
      break;
      
    case "LDDT":
      nuChip.DT = values[0];
      break;

    case "LDVXVY":
      nuChip.registers[values[0]] = nuChip.registers[values[1]];
      break;

    case "ADDVXVY":
      nuChip.registers[values[0]] += nuChip.registers[values[1]];
      break;
      
    case "SUBVXVY":
      nuChip.registers[values[0]] -= nuChip.registers[values[1]];
      break;
      
    case "VXORVY":
      nuChip.registers[values[0]] = nuChip.registers[values[0]] | nuChip.registers[values[1]];
      break;
      
    case "VXXORVY":
      nuChip.registers[values[0]] = nuChip.registers[values[0]] ^ nuChip.registers[values[1]];
      break;
      
    case "VXANDVY":
      nuChip.registers[values[0]] = nuChip.registers[values[0]] & nuChip.registers[values[1]];
      break;
      
    case "LDI":
      nuChip.I = values[0]*0x100+values[1];
      break;

    case "JMP":
      nuChip.PC = values[0]*0x100+values[1];
      break;

    case "JMPEQ":
      if(nuChip.registers[values[0]]==values[1])nuChip.PC = values[2]*0x100+values[3];
      break;
      
    case "JMPFL":
      if(nuChip.FL==values[0])nuChip.PC=values[1]*0x100+values[2];
      break;
      
    case "JMPKEY":
      if(keyIsPressed&&keys.indexOf(key)==values[0])nuChip.PC=values[1]*0x100+values[2];
      break;
      
    case "IFEV":
      if(nuChip.registers[values[0]] % 2){
        nuChip.FL=1;
      }else{
        nuChip.FL=0;
      }
      break;
      
    case "WAITDT":
      if(nuChip.DT>0)nuChip.PC-=1;
      break;
      
    case "SETFRQ":
      nuChip.SO[values[0]].freq(values[1]*7);
      break;
      
    case "ADDFRQ":
      nuChip.SO[values[0]].freq(nuChip.SO[values[0]].getFreq()+values[1]*10);
      break;
      
    case "SUBFRQ":
      nuChip.SO[values[0]].freq(nuChip.SO[values[0]].getFreq()-values[1]*10);
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
    if(nuChip.framebuffer[i]>0){
      let r = (nuChip.framebuffer[i]&0xFF0000)/0x10000;
      let g = (nuChip.framebuffer[i]&0x00FF00)/0x100;
      let b = nuChip.framebuffer[i]&0x0000FF;
      let clr = color(r,g,b);
      nuChip.GfxBuffer.pixels[(i*4)] = red(clr);
      nuChip.GfxBuffer.pixels[(i*4)+1] = green(clr);
      nuChip.GfxBuffer.pixels[(i*4)+2] = blue(clr);
    }
  }

  nuChip.GfxBuffer.updatePixels();
  
  image(nuChip.GfxBuffer,0,0,width,height);
}

// resize canvas (when window is resized)
function windowResized(){
  if(windowHeight>windowWidth){
    resizeCanvas(256*windowWidth/256, 192*windowWidth/256)
    ProgramButton.position(0,height);
  }else{
    resizeCanvas(256*windowHeight/192, 192*windowHeight/192)
    ProgramButton.position(width,0);
  }
}
