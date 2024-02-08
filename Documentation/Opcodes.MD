# Opcode List

> [!NOTE]
> Any instructions that support 16-bit values are required to be split into two 8-bit values. Any of these will be formatted as `#-16`.

  **GRAPHICAL OPCODES**

`0x10` / `STR` - Set tile `vX` to the tile value of `vY`. (`vX`, `vY`)

`0x20` / `FLL` - Fills the entire screen with the tile value given. (`n`)

`0x30` / `LDG` - Load graphics at the memory position according to the `I` register.

`0x40` / `LDP` - Loads the color information in the `n` position of the palette. Uses two bytes in the format of rgba4444. (`n`, `rg`, `ba`) 

`0x50` / `STT` - Sets the tile `n1-16` to the tile information `n2-16`. (`n1-16`, `n2-16`)

`0x60` / `SPR` - Create a sprite at position (`n1`, `n2`) using the tile information `n3-16`. Uses `n4` to select which index the sprite is created under. (`n1`, `n2`, `n3-16`, `n4`)

`0x70` / `MSPI` - Move sprite at index `n1` by signed byte <`n2`, `n3`>. (`n1`, `n2`, `n3`)

`0x80` / `DSP` - Delete sprite at index `n`. (`n`)

`0x90` / `LGP` - Loads the graphics pointer (`GP`) with the value of register `vX`. (`vX`)

`0xA0` / `AGPI` - Add the value of register `vX` to the graphics pointer (`GP`).

`0xC0` / `LOD` - Changes resolution to 128x96. Tile buffer does not change size.

`0xD0` / `HID` - Changes resolution to 256x192. Tile buffer does not change size. (Default resolution.)

`0xE0` / `SCR` - Scroll in direction according to hi-nibble of `n` by the lo-nibble of `n` (`n`)

  **PANNING**

`0x07` / `LPI` - Load panning register with immediate value `n`. (`n`)

`0x17` / `API` - Add immediate value `n` to panning register. (`n`)

`0x27` / `SPI` - Subtract immediate value `n` from panning register. (`n`)

`0x37` / `LPR` - Load panning register with the value of register `vX`. (`vX`)

  **REGISTER OPCODES**

`0x01` / `LDI` - Loads register `vX` with immediate value `n`. (`vX`, `n-16`)

`0x11` / `ADI` - Adds `n` to register `vX`. (`vX`, `n-16`)

`0x21` / `SBI` - Subtracts `n` from register `vX`. (`vX`, `n-16`)

`0x31` / `RND` - Loads register `vX` with a random 8-bit value masked by `n`. (`vX`, `n`)

`0x51` / `MOV` - Write the value of register `vY` to register `vX`. (`vX`, `vY`)

`0x61` / `ADD` - Add register `vY` to register `vX`. (`vX`, `vY`)

`0x71` / `SUB` - Subtract register `vY` from register `vX`. (`vX`, `vY`)

`0x81` / `OR` - Bitwise `OR` (`|`) register `vX` with register `vY`. Set register `vX` to the result. (`vX`, `vY`)

`0x91` / `XOR` - Bitwise `XOR` (`^`) register `vX` with register `vY`. Set register `vX` to the result. (`vX`, `vY`)

`0xA1` / `AND` - Bitwise `AND` (`&`) register `vX` with register `vY`. Set register `vX` to the result. (`vX`, `vY`)

`0xB1` / `LIR` - Write value `n` to register `I`. (`n-16`)

`0xC1` / `BCD` - Loads registers `vY – vY + 4` with the Bit Common Decimal of register `vX`. (`vX`, `vY`)

`0xD1` / `MUL` - Loads register `vX` with `vX * vY`. (`vX`, `vY`)

`0xE1` / `DIV` - Loads register `vX` with `vX / vY`. (`vX`, `vY`)

`0xF1` / `MOD` - Loads register `vX` with `vX % vY`. (`vX`, `vY`)

`0x22` / `DMP` - Dump a specified special register to register `vX`. (`vX`, `sR`)

  **TIMER OPCODES**

`0x41` / `LDT` - Sets the Delay Timer (`DT`) to `n`. (`n`)

`0x04` / `WAIT` - Halts all execution until the Delay Timer (`DT`) is equal to 0.

  **JUMP OPCODES**

`0x03` / `JMP` - Jumps to address `n`. (`n-16`)

`0x13` / `EQC` - Checks if `vX` is equal to `n1`. If true, jump to address `n2` as a subroutine. (`vX`, `n1`, `n2-16`)

`0x23` / `FLG` - Checks if the `FL` register is set to `n1`. If so, jump to `n2`. (`n1`, `n2-16`)

`0x33` / `KEY` - If the key provided (`0–⁠F`) is pressed, jump to `n` as a subroutine. (`key`, `n-16`)

`0x43` / `EQL` - Checks if `vX` is equal to `n1`. If true, jump to address `n2`. (`vX`, `n1`, `n2-16`)

  **SOUND OPCODES**

`0x05` / `LSO` - load a time and pitch for specified oscillator via `vX` and `vY`. (`vX`, `vY`)
- The sound buffer reads two bytes at a time for each oscillator. The first one is the frequency, and the other being the length of the sound in frames.

  **OTHER OPCODES**

`0x00` / `BRK` - Default opcode if memory is uninitialized. Can be used to delay for an interrupt or general system halt.

`0x06` / `CAL` - Store the Program Counter (`PC`) in the stack, increment the Stack Pointer (`SP`), and go to the subroutine address `n`. (`n-16`)

`0x16` / `RTN` - Subtract the Stack Pointer (`SP`) and go to the address that is indicated by the Stack Pointer (`SP`) within the stack.

# Opcode Table

> [!NOTE]
> Empty Spaces are where opcodes could be included within nuChip, and may be used later in development.
> The number next to the instruction indicates how many bytes are fetched, minus one.

| |0|1|2|3|4|5|6|7|8|9|A|B|C|D|E|F|
|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|-|
|0|`BRK`,`1`|`STR`,`1`|`FLL`,`4`|`LDG`,`6`|`LDP`,`6`|`STT`,`5`|`SPR`,`5`|`MSPI`,`3`|`DSP`,`3`|`LGP`,`3`|`AGPI`,`2`| |`LOD`,`1`|`HID`,`1`|`SCR`,`2`| |
|1|`LDI`,`4`|`ADI`,`4`|`SBI`,`4`|`RND`,`3`|`LDT`,`2`|`MOV`,`3`|`ADD`,`3`|`SUB`,`3`|`OR`,`3`|`XOR`,`3`|`AND`,`3`|`LDIR`,`3`|`BCD`,`3`|`MUL`,`3`|`DIV`,`3`|`MOD`,`3`|
|2| | |`DMP`,`3`| | | | | | | | | | | | | |
|3|`JMP`,`3`|`EQC`,`5`|`FLG`,`4`|`KEY`,`4`|`EQL`,5| | | | | | | | | | | |
|4|`WAIT`,`1`| | | | | | | | | | | | | | | |
|5|`LSO`,`4`|`USS`,`2`| | | | | | | | | | | | | | |
|6|`CAL`,`3`|`RTN`,`1`| | | | | | | | | | | | | | |
|7|`LPI`,`2`|`API`,`2`|`SPI`,`2`|`LPR`,`2`| | | | | | | | | | | | |
|8| | | | | | | | | | | | | | | | |
|9| | | | | | | | | | | | | | | | |
|A| | | | | | | | | | | | | | | | |
|B| | | | | | | | | | | | | | | | |
|C| | | | | | | | | | | | | | | | |
|D| | | | | | | | | | | | | | | | |
|E| | | | | | | | | | | | | | | | |
|F| | | | | | | | | | | | | | | | |

