# Opcode List

> [!NOTE]
> Any instructions that support 16-bit values are required to be split into two 8-bit values. Any of these will be formatted as `#-16`.

  **GRAPHICAL OPCODES**

`0x10` / `CLRFB` - Clears the framebuffer.

`0x20` / `FILL` - Fills the entire screen with the color in the RGB value given. (r, g, b)

`0x30` / `LDFB` - Loads the color information for a pixel at position vX, vY. If the pixel that is overwritten is not black, set the FL flag to 1. (vX, vY, r, g, b)

`0x40` / `LDFBVX` - Loads the color information for a pixel at position vX, vY. If the pixel that is overwritten is not black, set the FL flag to 1. (vX, vY, vR, vG, vB)

`0x50` / `RDGFX` - Reads graphics from the graphics memory at the GFX Pointer and displays it on the screen at position vX, vY. If any pixels that are overwritten are not black, set the FL flag to 1. (vX, vY, sizeX, sizeY, Transparency)

`0x60` / `WRGFX` - Writes the data of a pixel to the graphics memory at n with r, g, and b. (n-16, r, g, b)

`0x70` / `LDGFX` - Loads memory values from the address according to the register I. n specifies how many pixels to carry over. (n-16)

`0x80` / `LDGP` - Loads the GFX Pointer with value n. (n-16)

`0x90` / `ADDGP` - Adds the value of n to the GFX Pointer. (n-16)

`0xA0` / `LORES` - Changes resolution to 128x96.

`0xB0` / `HIRES` - Changes resolution to 256x192. (Default resolution.)

  **VALUE CHECKING OPCODES**

`0x02` / `IFEV` - Checks if the value of register vX is even. If so, set the FL flag to 1. Otherwise, set the FL flag to 0. (vX)

`0x12` / `IFODD` - Checks if the value of register vX is odd. If so, set the FL flag to 1. Otherwise, set the FL flag to 0. (vX)

  **REGISTER OPCODES**

`0x01` / `LDREG` - Loads register with a value. (vX, n-16)

`0x11` / `ADDREG` - Adds n to register vX. (vX, n-16)

`0x21` / `SUBREG` - Subtracts n from register vX. (vX, n-16)

`0x31` / `VXRAND` - Loads register with a random 8-bit value masked by n. (vX, n)

`0x51` / `LDVXVY` - Write the value of register vY to register vX. (vX, vY)

`0x61` / `ADDVXVY` - Add register vY to register vX. (vX, vY)

`0x71` / `SUBVXVY` - Subtract register vY from register vX. (vX, vY)

`0x81` / "VXORVY" - Bitwise OR register vX with register vY. Set register vX to the result. (vX, vY)

`0x91` / "VXXORVY" - Bitwise XOR register vX with register vY. Set register vX to the result. (vX, vY)

`0xA1` / "VXANDVY" - Bitwise AND register vX with register vY. Set register vX to the result. (vX, vY)

`0xB1` / "LDI" - Write value n to register I. (n-16)

  **TIMER OPCODES**

`0x41` / `LDDT` - Sets the Delay Timer to n. (n)

`0x04` / `WAITDT` - Halts all execution until the Delay Timer is equal to 0.

  **JUMP OPCODES**

`0x03` / `JMP` - Jumps to address n. (n-16)

`0x13` / `JMPEQ` - Checks if vX is equal to n2. If true, jump to address n2. (vX, n1, n2-16)

`0x23` / `JMPFL` - Checks if the FL flag is set to n1. If so, jump to n2. (n1, n2)

`0x33` / `JMPKEY` - Jump to n if the key provided (0-F) is pressed. (key, n-16)

  **SOUND OPCODES**

`0x05` / `SETFRQ` - Sets n1 oscillator's frequency to n2. Oscillator can only be turned off by setting the frequency to 0. (n1, n2)

`0x15` / `ADDFRQ` - Adds n2 to n1 oscillator's frequency. (n1, n2)

`0x25` / `SUBFRQ` - Subtracts n2 from n1 oscillator's frequency. (n1, n2)

  **OTHER OPCODES**

`0x00` / `BRK` - placeholder for empty memory space.
