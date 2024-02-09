import java.util.*;

import com.krab.lazy.*;

import processing.sound.*;

LazyGui gui;

main nuc;

Object[][][] ops = {
  {{"BRK",1},{"STR",3},{"FLL",2},{"LDG",1},{"LDP",4},{"STT",5},{"SPR",6},{"MSPI",4},{"DSP",2},{"LGP",2},{"AGPI",2},{},{"LOD",1},{"HID",1},{"SCR",2},{}},
  {{"LDI",4},{"ADI",4},{"SBI",4},{"RND",3},{"LDT",2},{"MOV",3},{"ADD",3},{"SUB",3},{"OR",3},{"XOR",3},{"AND",3},{"LIR",3},{"BCD",3},{"MUL",3},{"DIV",3},{"MOD",3}},
  {{},{},{"DMP",3},{},{},{},{},{},{},{},{},{},{},{},{},{}},
  {{"JMP",3},{"EQC",6},{"FLG",4},{"KEY",4},{"EQL",6},{"IRQ",4},{},{},{},{},{},{},{},{},{},{}},
  {{"WAIT",1},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}},
  {{"LSO",3},{"USS",2},{},{},{},{},{},{},{},{},{},{},{},{},{},{}},
  {{"CAL",3},{"RTN",1},{},{},{},{},{},{},{},{},{},{},{},{},{},{}},
  {{"LPI",2},{"API",2},{"SPI",2},{"LPR",2},{},{},{},{},{},{},{},{},{},{},{},{}},
  {{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}},
  {{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}},
  {{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}},
  {{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}},
  {{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}},
  {{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}},
  {{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}},
  {{},{},{},{},{},{},{},{},{},{},{},{},{},{},{},{}},
};

class main {
  int[] memory = new int[65536];
  int[] registers = new int[256];
  int[] stack = new int[16];
  int[] gfx = new int[8192];
  int[] palette = new int[16];
  int[] TB = new int[769];
  Integer[] sprites = new Integer[768];
  AudioSample ch1;
  AudioSample ch2;
  AudioSample ch3;
  AudioSample ch4;
  
  int PC = 0x0000;
  int SP = 0;
  int I = 0;
  int F = 0;
  int DT = 0;
  int GP = 0;
  int P = 0;
  int SL = 0;
  
  int D = 0;
  
  PGraphics display = createGraphics(256,192);
}

// setup the main things
void setup() {
  size(1280,720,P2D);
  
  ((PGraphicsOpenGL)g).textureSampling(2);
  
  imageMode(CENTER);
  rectMode(CENTER);
  
  noStroke();
  
  surface.setTitle("nuChip - JAVA - v0.0.1");
  surface.setLocation(100,100);
  
  nuc = new main();
  gui = new LazyGui(this);
  
  nuc.display.beginDraw();
  
  gui.button("Load .NUC rom");
  gui.colorPicker("border");
}

// does op loop and renders display
void draw() {
  background(gui.colorPicker("background").hex);
  nuc.display.background(0);
  
  nuc.display.loadPixels();
  
  int scanline = -64;
  int pxl = -64;
  
  // loop
  for(int i = 0; i<gui.sliderInt("IPF"); i++){
    if(nuc.D==0){
      doNext();
    }else{
      nuc.D--;
    }
    if(scanline>=0&&scanline<nuc.display.height){
      //tiles
      for(int o = 0; o<8; o++){
        if(pxl>=0&&pxl<nuc.display.width){
          int TBpos = (floor(pxl/8))+(floor(scanline/8))*nuc.display.width/8;
          int tile = nuc.TB[TBpos]*64;
          int pos = (floor(pxl/2)%4)+(scanline%8)*4+tile/2;
          int tilepal = nuc.palette[(nuc.gfx[pos&0x1FFF]&0xF0)>>4];
          int r = (tilepal&0xF000)>>12;
          int g = (tilepal&0x0F00)>>8;
          int b = (tilepal&0x00F0)>>4;
          int a = tilepal&0x000F;
          if(a>0)nuc.display.pixels[((pxl+nuc.P)%nuc.display.width)+scanline*nuc.display.width] = color(r*16,g*16,b*16,a*16);
          pxl++;
          tilepal = nuc.palette[nuc.gfx[pos&0x1FFF]&0x0F];
          r = (tilepal&0xF000)>>12;
          g = (tilepal&0x0F00)>>8;
          b = (tilepal&0x00F0)>>4;
          a = tilepal&0x000F;
          if(a>0)nuc.display.pixels[((pxl+nuc.P)%nuc.display.width)+scanline*nuc.display.width] = color(r*16,g*16,b*16,a*16);
          pxl++;
        }else{
          pxl+=2;
        }
      }
      
      //sprites
      for(int p = 0; p<256; p++){
        Integer x = nuc.sprites[p*3];
        Integer y = nuc.sprites[p*3+1];
        Integer tile = nuc.sprites[p*3+2];
        if(x!=null&&y!=null&&tile!=null){
          for(int o = 0; o<nuc.display.width; o++){
            if(o>=x&&o<x+8){
              if(scanline>=y&&scanline<y+8){
                int pos = (floor((o-x)/2)%4)+((scanline-y)%8)*4+tile*32;
                int tilepal = nuc.palette[(nuc.gfx[pos]&0xF0)>>4];
                int r = (tilepal&0xF000)>>12;
                int g = (tilepal&0x0F00)>>8;
                int b = (tilepal&0x00F0)>>4;
                int a = tilepal&0x000F;
                if(a>0)nuc.display.pixels[o+scanline*nuc.display.width] = color(r*16,g*16,b*16,a*16);
                o+=1;
                tilepal = nuc.palette[nuc.gfx[pos]&0x0F];
                r = (tilepal&0xF000)>>12;
                g = (tilepal&0x0F00)>>8;
                b = (tilepal&0x00F0)>>4;
                a = tilepal&0x000F;
                if(a>0)nuc.display.pixels[o+scanline*nuc.display.width] = color(r*16,g*16,b*16,a*16);
              }
            }
          }
        }
      }
    }else{
      pxl+=8;
    }
    if(pxl>nuc.display.width+64){
      pxl = -64;
      scanline++;
    }
    nuc.SL = scanline;
  }
  
  // timer stuff
  if(nuc.DT>0)nuc.DT--;
  
  // draw screen
  renderDisplay();
  
  // gui things
  gui.sliderInt("IPF",50000);
  
  if(gui.button("Load .NUC rom")){
    selectInput("Select .NUC rom to load.","loadFile");
  }
}

// one function to get, decode, and execute the current op.
void doNext() {
  int op = nuc.memory[nuc.PC];
  int opx = (op & 0xF0)>>4;
  int opy = op & 0x0F;
  
  Object[][] row = ops[opy];
  Object[] inst = row[opx];
  
  int[] v = new int[0];
  
  if(inst.length==0){
    println("UNKNOWN INSTRUCTION - "+hex(op,2));
    nuc.PC+=1;
    return;
  }
  
  int cycles = (int)inst[1];
  
  nuc.D = cycles;
  
  for(int i = 1; i<cycles; i++){
    v = append(v,nuc.memory[(nuc.PC+i)&0xFFFF]);
  }
  
  nuc.PC+=cycles;
  
  switch((String)inst[0]){
    case "BRK":
      nuc.PC-=1;
      break;
      
    case "LIR":
      nuc.I = (v[0]<<8)+v[1];
      break;
      
    case "LDI":
      nuc.registers[v[0]] = (v[1]<<8)+v[2];
      break;
      
    case "ADI":
      nuc.registers[v[0]] += (v[1]<<8)+v[2];
      break;
      
    case "SBI":
      nuc.registers[v[0]] -= (v[1]<<8)+v[2];
      break;
      
    case "MOV":
      nuc.registers[v[0]] = nuc.registers[v[1]];
      break;
      
    case "ADD":
      nuc.registers[v[0]] += nuc.registers[v[1]];
      break;
      
    case "SUB":
      nuc.registers[v[0]] -= nuc.registers[v[1]];
      break;
      
    case "OR":
      nuc.registers[v[0]] |= nuc.registers[v[1]];
      break;
      
    case "XOR":
      nuc.registers[v[0]] ^= nuc.registers[v[1]];
      break;
      
    case "AND":
      nuc.registers[v[0]] &= nuc.registers[v[1]];
      break;
      
    case "BCD":
      nuc.registers[v[1]] = (nuc.registers[v[0]]/10000)%10;
      nuc.registers[v[1]+1] = (nuc.registers[v[0]]/1000)%10;
      nuc.registers[v[1]+2] = (nuc.registers[v[0]]/100)%10;
      nuc.registers[v[1]+3] = (nuc.registers[v[0]]/10)%10;
      nuc.registers[v[1]+4] = nuc.registers[v[0]]%10;
      break;
      
    case "DMP":
      switch(v[1]){
        case 0x0:
          nuc.registers[v[0]] = nuc.I;
          break;
        case 0x1:
          nuc.registers[v[0]] = nuc.DT;
          break;
        case 0x2:
          nuc.registers[v[0]] = nuc.GP;
          break;
        case 0x3:
          nuc.registers[v[0]] = nuc.P;
          break;
        case 0x4:
          nuc.registers[v[0]] = nuc.F;
          break;
        case 0x5:
          nuc.registers[v[0]] = nuc.SL;
          break;
        default:
          println("Unknown Register to dump.");
          break;
      }
      break;
      
    // jumps
    case "EQL":
      if(nuc.registers[v[0]]==(v[1]<<8)+v[2])nuc.PC = (v[3]<<8)+v[4];
      break;
      
    case "JMP":
      nuc.PC = (v[0]<<8)+v[1];
      break;
     
    // timer stuff
    case "LDT":
      nuc.DT = v[0];
      break;
      
    case "WAIT":
      if(nuc.DT>0)nuc.PC-=1;
      break;
      
    // interrupts
    case "IRQ":
      if(nuc.SL==v[0]){
        nuc.PC = (v[1]<<8)+v[2];
      }else{
        nuc.PC-=cycles;
      }
      break;
      
    // sound
    case "USS":
      float[] samples = new float[256];
      for(int i = 0; i<256; i++){
        samples[i] = (nuc.memory[floor(i/32)+nuc.I]>>(4-(floor(i/16)&0x1)*4))&0xF;
      }
      
      for(int i = 0; i<256; i++){
        nuc.ch1.write(i,samples[i]/16);
      }
      break;
     
    // gfx
    case "LDG":
      for(int i = 0; i<8192; i++){
        nuc.gfx[i] = nuc.memory[i+nuc.I];
      }
      break;
      
    case "LDP":
      nuc.palette[v[0]+1] = (v[1]<<8)+v[2];
      break;
      
    case "STR":
      if(nuc.registers[v[0]]<nuc.TB.length)nuc.TB[nuc.registers[v[0]]] = nuc.registers[v[1]];
      break;
      
    case "STT":
      nuc.TB[(v[0]<<8)+v[1]] = (v[2]<<8)+v[3];
      break;
      
    case "SPR":
      nuc.sprites[v[4]*3] = v[0];
      nuc.sprites[v[4]*3+1] = v[1];
      nuc.sprites[v[4]*3+2] = (v[2]<<8)+v[3];
      break;
      
     case "DSP":
      nuc.sprites[v[4]*3] = null;
      nuc.sprites[v[4]*3+1] = null;
      nuc.sprites[v[4]*3+2] = null;
      break;
      
    case "MSPI":
      int nx = v[1]<<24>>24;
      int ny = v[2]<<24>>24;
      nuc.sprites[v[0]*3] += nx;
      nuc.sprites[v[0]*3+1] += ny;
      break;
      
    case "LPR":
      nuc.P = nuc.registers[v[0]];
      break;
      
    case "LPI":
      nuc.P = v[0];
      break;
      
    case "API":
      nuc.P = (nuc.P + v[0])&0xFF;
      break;
      
    case "SPI":
      nuc.P = (nuc.P - v[0])&0xFF;
      break;
    
    case "SCR":
      switch((v[0]&0xF0)>>4){
        case 0:
          int amt = v[0]&0x0F;
          for(int i = 0; i<amt; i++){
            for(int o = 0; o<nuc.display.height/8; o++){
              for(int p = 0; p<nuc.display.width/8; p++){
                if(o%(nuc.display.height/8-1)==o){
                  nuc.TB[p+o*(nuc.display.width/8)] = nuc.TB[p+1+o*(nuc.display.width/8)];
                }else{
                  nuc.TB[p+o*(nuc.display.width/8)] = 0;
                }
              }
            }
          }
          break;
        default:
          println("Unknown Scroll Direction.");
          break;
      }
      break;
      
    default:
      println("UNIMPLEMENTED",hex(op,2),inst[0]);
      break;
  }
}

// render the display, pretty easy.
void renderDisplay() {
  nuc.display.updatePixels();
  
  fill(gui.colorPicker("border").hex);
  
  if(height/3>width/4){
    int wRatio = width / nuc.display.width;
    int w = nuc.display.width * wRatio;
    int h = nuc.display.height * wRatio;
    rect(width / 2, height / 2, w, h, 20);
    image(nuc.display, width / 2, height / 2, w-40, h-40);
  }else{
    int hRatio = height / nuc.display.height;
    int w = nuc.display.width * hRatio;
    int h = nuc.display.height * hRatio;
    rect(width / 2, height / 2, w, h, 20);
    image(nuc.display, width / 2, height / 2, w-40, h-40);
  }
}

// rom loading
void loadFile(File selection) {
  if(selection==null){
    println("Window was closed or the user hit cancel, reopen prompt.");
    selectInput("Select a file to load into the interpreter", "loadFile");
  }else{
    byte file[] = loadBytes(selection);
    
    if(file.length>nuc.memory.length){
      println("File too big, reopen prompt.");
      selectInput("Select a file to load into the interpreter", "FileInput");
      return;
    }
    
    for(int i = 0; i<file.length; i++){
      nuc.memory[i] = file[i] & 0xFF;
    }
    
    nuc.PC = 0;
    nuc.SP = 0;
    nuc.I = 0;
    nuc.F = 0;
    nuc.DT = 0;
    nuc.GP = 0;
    
    // gfx reset
    nuc.TB = new int[769];
    nuc.sprites = new Integer[768];
    
    // palette reset
    nuc.palette = new int[16];

    // setting colors
    nuc.palette[1] = 0x000F; //black
    nuc.palette[2] = 0xFFFF; //white
    nuc.palette[3] = 0xF00F; //red
    nuc.palette[4] = 0x0F0F; //green
    nuc.palette[5] = 0x00FF; //blue
    nuc.palette[6] = 0xFF0F; //yellow
    nuc.palette[7] = 0x0FFF; //cyan
    nuc.palette[8] = 0xF0FF; //pink
    
    // sound
    nuc.ch1 = new AudioSample(this, 256, 44100);
    nuc.ch2 = new AudioSample(this, 256, 44100);
    nuc.ch3 = new AudioSample(this, 256, 44100);
    nuc.ch4 = new AudioSample(this, 256, 44100);
    
    nuc.ch1.loop();
    nuc.ch2.loop();
    nuc.ch3.loop();
    nuc.ch4.loop();
  }
}
