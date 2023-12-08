# Opcode List
"BRK" - placeholder for empty memory space. 

# GRAPHICAL OPCODES

"LDFB" - Loads the color information for a pixel at position vX, vY. (vX, vY, r, g, b)

"LDFBVX" - Loads the color information for a pixel at position vX, vY. (vX, vY, vR, vG, vB)

# REGISTER OPCODES
"LDREG" - Loads register with a value. (vX, n)

"ADDREG" - Adds n to register. (vX, n)

"VXRAND" - Loads register with a random value masked by n. (vX, n)

# JUMP OPCODES
"JMP" - Jumps to address n. (n)

"JMPEQ" - Checks if vX is equal to n2. If true, jump to address n2. (vX, n1, n2)
