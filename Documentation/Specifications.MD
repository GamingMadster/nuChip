# Specifications

## General Specifications

`Memory` - 32,768 Bytes, 16-bit

`Framebuffer` - 49,152 Bytes `HIRES`, 12288 Bytes `LORES`, 16-bit RGB-565 (May need conversion for certain commands), 32-bit no conversion needed.

`Display` - 256x192 `HIRES`, 128x96 `LORES`

`Graphics Memory` - 8192 Bytes, 16-bit RGB-565 w/ conversion (As current programs use RGB-888), 32-bit no conversion needed.

`Stack` - 64 Positions, 16-bit

`Registers` - 64 Registers, 16-bit

`Sound` - 6 Channels (2 Square, 2 Sawtooth, 2 Triangle)

nuChip runs at 25,000 instructions per frame, although it is allowed to be up to 50,000 if the `TURBO` opcode is called.

## Independent Registers and Pointers

`Program Counter` - Keeps track of where the system is in memory that is always incremented. `16-bit`

`Stack Pointer` - Keeps track of what position in the stack you are in. `8-bit`

`Delay Timer` - Register that allows for halting up to 255 frames. `8-bit`

`Graphics Pointer` - Keeps track of where graphics memory is being read from or written to. `16-bit`

`Index Register` - Independent register that allows reading from memory. `16-bit`

`Flag Register` - Flag that may be used for graphical collisions, among other things. `8-bit`
