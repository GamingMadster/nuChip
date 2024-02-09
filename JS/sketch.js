// Optimizations
p5.disableFriendlyErrors = true;

// the virtual nuChip class
class ChipClass {
  constructor(){
    this.memory = new Uint16Array(32768);
    this.gfx = new Uint16Array(8192);
    this.stack = new Uint16Array(64);
    this.registers = new Uint16Array(64);
    this.framebuffer = new Uint8Array(768);

    this.palette = new Uint16Array(16);
    this.sprites = [];

    this.PC = 0;
    this.SP = 0;
    this.DT = 0;
    this.SO = [new p5.Oscillator("square"),new p5.Oscillator("square"),new p5.Oscillator("sawtooth"),new p5.Oscillator("sawtooth"),new p5.Oscillator("triangle"),new p5.Oscillator("triangle")];
    this.SoundBuffer = [[],[],[],[],[],[]];
    this.GFXP = 0;
    this.I = 0;
    this.FL = 0;
    this.IPF = 25000;
    this.PAN = 0;
    
    this.GfxBuffer = createGraphics(256,192);
  }
}

var nuChip;

var ProgramButton;

var delay = 0;

var scanline = 0;

let keys = [
  88,
  49,
  50,
  51,
  81,
  87,
  69,
  65,
  83,
  68,
  90,
  67,
  52,
  82,
  70,
  86,
];

let Opcodes = [
  [["BRK",1],["CLEAR",1],["FILL",2],["LDGFX",1],["LDPAL",4],["STILE",5],["DRWSP",5],["MOVSPI",3],["MOVSP",3],["DELSP",2],["LDGPI",3],["ADDGPI",3],["LDGP",5],["LORES",1],["HIRES",1]],
  [["LDI",4],["ADDI",4],["SUBI",4],["RAND",3],["LDDT",2],["MOVE",3],["ADD",3],["SUB",3],["OR",3],["XOR",3],["AND",3],["LDIR",3],["BCD",3],["RAND16",4],["MULT",3],["DIVI",3]],
  [["IFEV",2],["IFODD",2]],
  [["JMP",3],["EQSUB",5],["FLAG",4],["KEY",4],["EQUAL",5]],
  [["WAIT",1],["LDPANI",2],["ADDPANI",2]],
  [["LDSO",3]],
  [["CALL",3],["RTRN",1]],
  [["TURBO",1]],
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
]

let Program = [
  0x03, 0x00, 0x00
]

function loadROM(file){
  loadBytes(file.data,function callback(data){
    if(data.bytes.length>nuChip.memory.length){
      console.error("The file given is too big to fit into memory.");
      return;
    }
    
    // reset values
    nuChip.memory = new Uint16Array(32768);
    nuChip.stack = new Uint16Array(32);
    nuChip.registers = new Uint16Array(32);

    // graphics reset
    nuChip.gfx = new Uint32Array(8192);
    nuChip.framebuffer = new Uint16Array(768);

    // palette reset
    nuChip.palette = new Uint16Array(16);

    // setting colors
    nuChip.palette[1] = 0x000F //black
    nuChip.palette[2] = 0xFFFF //white
    nuChip.palette[3] = 0xF00F //red
    nuChip.palette[4] = 0x0F0F //green
    nuChip.palette[5] = 0x00FF //blue
    nuChip.palette[6] = 0xFF0F //yellow
    nuChip.palette[7] = 0x0FFF //cyan
    nuChip.palette[8] = 0xF0FF //pink

    nuChip.PC = 0;
    nuChip.SP = 0;
    nuChip.DT = 0;
    nuChip.GFXP = 0;
    nuChip.I = 0;
    nuChip.FL = 0;
    nuChip.IPF = 25000;
    nuChip.PAN = 0;
    nuChip.SoundBuffer = [[],[],[],[],[],[]];
    
    // reset the GfxBuffer
    nuChip.GfxBuffer.resizeCanvas(256,192);
    
    // load file
    console.log("The File Loaded is "+data.bytes.length+" bytes.");
    console.log("Bytes left: "+(nuChip.memory.length-data.bytes.length)+" bytes.")
    for(let i = 0; i<data.bytes.length; i++){
      nuChip.memory[i] = data.bytes[i];
    }
    
    // reset oscillators
    for(let i = 0; i<nuChip.SO.length; i++){
      nuChip.SO[i].freq(0);
      nuChip.SO[i].amp(0);
    }

    for(let i = 0; i<nuChip.gfx.length; i++){
      nuChip.gfx[i] = 1;
    }
    
    loop();
  })
}

// setup function
function setup() {
  userStartAudio();

  imageMode(CENTER);
  rectMode(CENTER);
  
  // buttons
  ProgramButton = createFileInput(loadROM);
  
  // create the actual workable canvas
  createCanvas(windowWidth,windowHeight);
  
  // create an instance of "ChipClass"
  nuChip = new ChipClass();

  ProgramButton.position(0,height-21);
  nuChip.GfxBuffer.noStroke();
  noSmooth();

  // setting colors
  nuChip.palette[1] = 0x000F //black
  nuChip.palette[2] = 0xFFFF //white
  nuChip.palette[3] = 0xF00F //red
  nuChip.palette[4] = 0x0F0F //green
  nuChip.palette[5] = 0x00FF //blue
  nuChip.palette[6] = 0xFF0F //yellow
  nuChip.palette[7] = 0x0FFF //cyan
  nuChip.palette[8] = 0xF0FF //pink

  // clear memory 
  for(let i = 0; i<Program.length; i++){
    nuChip.memory[i] = 0;
  }
  
  // put program into memory.
  console.log("Program is "+Program.length+" bytes.");
  console.log("Bytes left: "+(nuChip.memory.length-Program.length)+" bytes.");
  for(let i = 0; i<Program.length; i++){
    nuChip.memory[i] = Program[i];
  }
  
  // load up the oscillators
  for(let i = 0; i<nuChip.SO.length; i++){
    nuChip.SO[i].start();
    nuChip.SO[i].freq(0);
    nuChip.SO[i].amp(0.1);
  }

  for(let i = 0; i<nuChip.gfx.length; i++){
    nuChip.gfx[i] = 1;
  }
}

// general loop
function draw() {
  background("#8F8F8F");

  scanline = 0;

  nuChip.GfxBuffer.loadPixels();

  // main loop
  for(let i = 0; i<nuChip.IPF; i++){
    // main loop
    if(delay==0){
      let opcode = Fetch();
      let decoded = decode(opcode);
      execute(decoded);
    }else{
      delay-=1;
      // graphics buffering
      // this happens during the processing of an instruction
      if(scanline<nuChip.GfxBuffer.height){
        for(let o = 0; o<nuChip.GfxBuffer.width; o++){
          let pixelPos = nuChip.gfx[nuChip.framebuffer[Math.floor(o/8)+Math.floor(scanline/8)*32]*64+o%8+scanline*8%64];
          let r = (nuChip.palette[pixelPos]&0xF000)/256
          let g = (nuChip.palette[pixelPos]&0x0F00)/16
          let b = (nuChip.palette[pixelPos]&0x00F0)
          let a = (nuChip.palette[pixelPos]&0x000F)*16
          nuChip.GfxBuffer.pixels[(((o+nuChip.PAN)%nuChip.GfxBuffer.width)+scanline*nuChip.GfxBuffer.width)*4] = r;
          nuChip.GfxBuffer.pixels[(((o+nuChip.PAN)%nuChip.GfxBuffer.width)+scanline*nuChip.GfxBuffer.width)*4+1] = g;
          nuChip.GfxBuffer.pixels[(((o+nuChip.PAN)%nuChip.GfxBuffer.width)+scanline*nuChip.GfxBuffer.width)*4+2] = b;
          nuChip.GfxBuffer.pixels[(((o+nuChip.PAN)%nuChip.GfxBuffer.width)+scanline*nuChip.GfxBuffer.width)*4+3] = a;
        }
      }
      scanline+=1;
    }
  }
  
  // dt decrease
  if(nuChip.DT>0)nuChip.DT-=1;

  // sound stuff
  for(let i = 0; i<6; i++){
    if(nuChip.SoundBuffer[i][0]!=undefined){
      if(nuChip.SoundBuffer[i][0][1]!=0){
        if(nuChip.SoundBuffer[i][0][0]!=0){
          nuChip.SO[i].amp(0.1,0)
          nuChip.SO[i].freq(nuChip.SoundBuffer[i][0][0]*20,0)
        }else{
          nuChip.SO[i].amp(0,0)
        }
        nuChip.SoundBuffer[i][0][1] -= 1
      }else{
        nuChip.SoundBuffer[i].shift()
      }
    }else{
      nuChip.SO[i].amp(0,0)
    }
  }
  
  // refresh
  screenRefresh();

  // debug palette
  for(let i = 0; i<nuChip.palette.length; i++){
    let r = (nuChip.palette[i]&0xF000)/256
    let g = (nuChip.palette[i]&0x0F00)/16
    let b = (nuChip.palette[i]&0x00F0)
    let a = (nuChip.palette[i]&0x000F)*16
    let colr = color(r,g,b,a);
    fill(colr);
    rect(i*30+15,15,30);
  }

  // debug text
  fill("white");
  stroke("black");
  strokeWeight(2);
  if(keyIsDown(73)){
    text(frameRate(),0,10);
    text("IPF: "+nuChip.IPF,0,20);
  }
}

// fetch, decode, execute loop
function Fetch() {
  return nuChip.memory[nuChip.PC];
}

function decode(opcode){
  let row = Opcodes[opcode&0xF];

  if(row==undefined){
    console.error("INVALID INSTRUCTION. STOPPING CODE...", "OCCURED AT MEM ADDRESS: " + hex(nuChip.PC,4), "ADDITIONAL INFO " + hex(opcode,2));
    //let instruction = ["BRK",1];
    //let values = [];
    //return [instruction,values];
  }
  
  let instruction = row[(opcode&0xF0)/0x10];
  let values = [];
  
  for(let i = 1; i<instruction[1]; i++){
    values.push(nuChip.memory[i+nuChip.PC]);
  }
  
  nuChip.PC+=instruction[1];
  delay = instruction[1];
  return [instruction,values];
}

function execute(instArray){
  let values = instArray[1];
  switch (instArray[0][0]) {
    case "BRK":
      noLoop();
      break;
      
    case "CALL":
      nuChip.stack[nuChip.SP] = nuChip.PC
      nuChip.SP+=1;
      nuChip.PC = values[0]*0x100+values[1];
      break;
      
    case "RTRN":
      nuChip.SP-=1;
      nuChip.PC = nuChip.stack[nuChip.SP];
      break;

    case "CLEAR":
      for(let i = 0; i<nuChip.framebuffer.length; i++){
        nuChip.framebuffer[i] = 0;
      }
      break;
      
    case "FILL":
      for(let i = 0; i<nuChip.framebuffer.length; i++){
        nuChip.framebuffer[i] = values[0];
      }
      break;

    case "LDPANI":
      nuChip.PAN = values[0];
      break;

    case "ADDPANI":
      nuChip.PAN = (nuChip.PAN + values[0])%255;
      break;

    case "LDGFX":
      for(let i = 0; i<8192; i++){
        nuChip.gfx[i] = nuChip.memory[i+nuChip.I];
      }
      console.log(nuChip.gfx,nuChip.memory);
      break;

    case "LDPAL":
      if(values[0]+1<16){
        nuChip.palette[values[0]+1] = (values[1]<<8)+values[2];
      }
      break;

    case "STILE":
      nuChip.framebuffer[(values[0]<<8)+values[1]] = (values[2]<<8)+values[3];
      break;

    case "LDGPI":
      nuChip.GFXP = values[0]*0x100+values[1];
      break;

    case "ADDGPI":
      nuChip.GFXP += values[0]*0x100+values[1];
      break;
      
    case "LDGP":
      nuChip.GFXP = nuChip.registers[values[0]]*values[1]+values[2]*0x100+values[3];
      break;
      
    case "LORES":
      nuChip.GfxBuffer.resizeCanvas(128,96);
      nuChip.framebuffer = new Uint32Array(192);
      break;
      
    case "HIRES":
      nuChip.GfxBuffer.resizeCanvas(256,192);
      nuChip.framebuffer = new Uint32Array(768);
      break;
      
    case "LDI":
      nuChip.registers[values[0]]=values[1]*0x100+values[2];
      break;

    case "ADDI":
      nuChip.registers[values[0]]+=values[1]*0x100+values[2];
      break;
      
    case "SUBI":
      nuChip.registers[values[0]]-=values[1]*0x100+values[2];
      break;

    case "RAND":
      nuChip.registers[values[0]] = Math.floor(random(255)) & values[1];
      break;
    
    case "RAND16":
      nuChip.registers[values[0]] = Math.floor(random(65535)) & (values[1]*0x100+values[2]);
      break;
      
    case "LDDT":
      nuChip.DT = values[0];
      break;

    case "MOVE":
      nuChip.registers[values[0]] = nuChip.registers[values[1]];
      break;

    case "ADD":
      nuChip.registers[values[0]] += nuChip.registers[values[1]];
      break;
      
    case "SUB":
      nuChip.registers[values[0]] -= nuChip.registers[values[1]];
      break;

    case "MULT":
      nuChip.registers[values[0]] *= nuChip.registers[values[1]]
      break;

    case "MULT":
      nuChip.registers[values[0]] *= nuChip.registers[values[1]]
      break;

    case "DIVI":
      nuChip.registers[values[0]] = Math.floor(nuChip.registers[values[0]]/nuChip.registers[values[1]])
      break;
      
    case "OR":
      nuChip.registers[values[0]] = nuChip.registers[values[0]] | nuChip.registers[values[1]];
      break;
      
    case "XOR":
      nuChip.registers[values[0]] = nuChip.registers[values[0]] ^ nuChip.registers[values[1]];
      break;
      
    case "AND":
      nuChip.registers[values[0]] = nuChip.registers[values[0]] & nuChip.registers[values[1]];
      break;
      
    case "LDIR":
      nuChip.I = values[0]*0x100+values[1];
      break;
      
    case "BCD":
      let stringed = String(nuChip.registers[values[0]]);
      while (stringed.length<5){
        stringed = "0"+stringed;
      }
      nuChip.registers[values[1]] = int(stringed[0]);
      nuChip.registers[values[1]+1] = int(stringed[1]);
      nuChip.registers[values[1]+2] = int(stringed[2]);
      nuChip.registers[values[1]+3] = int(stringed[3]);
      nuChip.registers[values[1]+4] = int(stringed[4]);
      break;

    case "JMP":
      nuChip.PC = values[0]*0x100+values[1];
      break;

    case "EQSUB":
      if(nuChip.registers[values[0]]==values[1]){
        nuChip.stack[nuChip.SP] = nuChip.PC
        nuChip.SP+=1;
        nuChip.PC = values[2]*0x100+values[3];
      }
      break;

    case "EQUAL":
      if(nuChip.registers[values[0]]==values[1])nuChip.PC = values[2]*0x100+values[3];
      break;
      
    case "FLAG":
      if(nuChip.FL==values[0])nuChip.PC=values[1]*0x100+values[2];
      break;
      
    case "KEY":
      if(keyIsDown(keys[values[0]])){
        nuChip.stack[nuChip.SP] = nuChip.PC
        nuChip.SP+=1;
        nuChip.PC = values[1]*0x100+values[2];
      }
      break;
      
    case "IFEV":
      if(nuChip.registers[values[0]] & 1){
        nuChip.FL=0;
      }else{
        nuChip.FL=1;
      }
      break;

    case "IFODD":
      if(nuChip.registers[values[0]] & 1){
        nuChip.FL=1;
      }else{
        nuChip.FL=0;
      }
      break;
      
    case "WAIT":
      if(nuChip.DT>0)nuChip.PC-=1;
      break;
      
    case "LDSO":
      for(let i = 0; i<values[1]*2; i+=2){
        nuChip.SoundBuffer[values[0]].push([nuChip.memory[nuChip.I+i],nuChip.memory[nuChip.I+i+1]]);
      }
      break
      
    case "TURBO":
      if(nuChip.IPF==25000){
        nuChip.IPF = 50000;
      }else{
        nuChip.IPF = 25000;
      }
      break;
      
    default:
      break;
  }
}

// screen refresh
function screenRefresh() {
  nuChip.GfxBuffer.updatePixels();

  noStroke();
  fill("#4F4F4F")

  if(height/3>width/4){
    let wRatio = width / nuChip.GfxBuffer.width;
    let w = nuChip.GfxBuffer.width * wRatio;
    let h = nuChip.GfxBuffer.height * wRatio;
    rect(width / 2, height / 2, w, h, 20);
    image(nuChip.GfxBuffer, width / 2, height / 2, w-40, h-40);
  }else{
    let hRatio = height / nuChip.GfxBuffer.height;
    let w = nuChip.GfxBuffer.width * hRatio;
    let h = nuChip.GfxBuffer.height * hRatio;
    rect(width / 2, height / 2, w, h, 20);
    image(nuChip.GfxBuffer, width / 2, height / 2, w-40, h-40);
  }
}

// resize canvas (when window is resized)
function windowResized(){
  resizeCanvas(windowWidth, windowHeight)
  ProgramButton.position(0,height-21);
}
