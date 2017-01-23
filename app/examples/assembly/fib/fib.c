/*

  compile C-code to machine-code:
    gcc -o fib.o fib.c

  execute object-code:
    ./fib.o

  compile C-code to assembly:
    gcc -O2 -S -c fib.c
    vim fib.s

  disassemble object-code to assembly:
    objdump -d fib.o > fib.asm
    vim fib.asm

*/


#include <stdio.h>

int main(void){
  int x, y, z;

  //while (1){ // infinite-loop
    x = 0;
    y = 1;
    do {
      printf("%d\n", x);
      z = x + y;
      x = y;
      y = z;
    } while ( x < 255 );
  //}
}

