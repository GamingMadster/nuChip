# Specifications

## General Specifications

`Memory` - 64 KB, 8-bit

`Tilebuffer` - 768 Bytes `HID`, 192 Bytes `LOD`, 

`Display` - 256x192 `HID`, 128x96 `LOD`

`Graphics Memory` - 8192 Bytes, 8-bit (each nibble is two pixels.)

`Stack` - 16 Bytes, 16-bit

`Registers` - 256 general purpose registers, 16-bit

`Sound` - 4 Channels, each programmable with a custom waveform.

`Cycle Rate` - 50,000 cycles per frame, 3.0 mHz.

## Independent Registers and Pointers

`Program Counter` - Counter pointing to the next instruction. `16-bit`

`Stack Pointer` - Counter pointing to an index within the stack. `4-bit`

`Delay Timer` - Timer register. `8-bit`

`Graphics Pointer` - Points to where graphics memory is being read from or written to. `16-bit`

`Index Register` - Special register that is used aside the general purpose registers. `16-bit`

`Flag Register` - Special register that reflects the output of some opcodes. `4-Bit`

`Pan Register` - Special register that pans the screen horizontally. `8-bit`

`Scanline Register` - Special register that reflects the current scanline. (Hacky, but it works.)
