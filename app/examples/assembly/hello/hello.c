/*

  compile C-code to machine-code:
    gcc -o hello.o hello.c

  execute object-code:
    ./hello.o

  compile C-code to assembly:
    gcc -O2 -S -c hello.c
    vim hello.s

  disassemble object-code to assembly:
    objdump -d hello.o > hello.asm
    vim hello.asm

    objdump -d hello2.o > hello2.asm

*/


#include <stdio.h>

int main(void){

  printf("hello\n");

}

