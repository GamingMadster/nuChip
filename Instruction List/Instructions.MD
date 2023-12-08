# Opcode List

  **GRAPHICAL OPCODES**

`CLRFB` - Clears the framebuffer.

`LDFB` - Loads the color information for a pixel at position vX, vY. If the pixel that is overwritten is not black, set the FL flag to 1. (vX, vY, r, g, b)

`LDFBVX` - Loads the color information for a pixel at position vX, vY. If the pixel that is overwritten is not black, set the FL flag to 1. (vX, vY, vR, vG, vB)

`RDGFX` - Reads graphics from the graphics memory at the GFX Pointer and displays it on the screen at position vX, vY. If any pixels that are overwritten are not black, set the FL flag to 1. (vX, vY, sizeX, sizeY, Transparency)

`WRGFX` - Writes the data of a pixel to the graphics memory at n with r, g, and b. (n, r, g, b)

`LDGP` - Loads the GFX Pointer with value n. (n)

`ADDGP` - Adds the value of n to the GFX Pointer. (n)

`LORES` - Changes resolution to 128x96.

`HIRES` - Changes resolution to 256x192. (Default resolution.)

  **VALUE CHECKING OPCODES**

`IFEV` - Checks if the value of register vX is even. If so, set the FL flag to 1. Otherwise, set the FL flag to 0. (vX)

`IFODD` - Checks if the value of register vX is odd. If so, set the FL flag to 1. Otherwise, set the FL flag to 0. (vX)

  **REGISTER OPCODES**

`LDREG` - Loads register with a value. (vX, n)

`ADDREG` - Adds n to register vX. (vX, n)

`SUBREG` - Subtracts n from register vX. (vX, n)

`VXRAND` - Loads register with a random value masked by n. (vX, n)

  **TIMER OPCODES**

`LDDT` - Sets the Delay Timer to n. (n)

`WAITDT` - Halts all execution until the Delay Timer is equal to 0.

  **JUMP OPCODES**

`JMP` - Jumps to address n. (n)

`JMPEQ` - Checks if vX is equal to n2. If true, jump to address n2. (vX, n1, n2)

`JMPFL` - Checks if the FL flag is set to n1. If so, jump to n2.

  **SOUND OPCODES**

`SETFRQ` - Sets the n1 oscillator's frequency to n2. Oscillator can only be turned off by setting the frequency to 0.

  **OTHER OPCODES**
"BRK" - placeholder for empty memory space. 
