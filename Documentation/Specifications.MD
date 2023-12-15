# Specifications

`Memory` - 16,384 Bytes, 16-bit (Albeit this might increase to 32,768 Bytes in the future.)

`Framebuffer` - 49,152 Bytes HIRES, 12288 Bytes LORES (amount of bits is dependent on implementation.)

`Display` - 256x192 HIRES, 128x96 LORES

`Graphics Memory` - 8192 Bytes (amount of bits is dependent on implementation.)

`Stack` - 64 Positions, 16-bit

`Registers` - 64 Registers, 16-bit

`Sound` - 6 Channels (2 Square, 2 Sawtooth, 2 Triangle)

nuChip runs at 25,000 instructions per frame, although it is allowed to be up to 50,000 if the `TURBO` opcode is called.


**Independent Registers and Pointers**

`Program Counter` - Keeps track of where the system is in memory that is always incremented.

`Stack Pointer` - Keeps track of what position in the stack you are in.

`Delay Timer` - Register that allows for halting up to 255 frames.

`Graphics Pointer` - Keeps track of where graphics memory is being read from or written to.

`Index Register` - Independent register that allows reading from memory.

`Flag Register` - Flag that may be used for graphical collisions, among other things.
