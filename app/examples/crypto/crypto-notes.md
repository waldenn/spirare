# links

https://www.khanacademy.org/computing/computer-science/cryptography
http://www.helpwithfractions.com/math-homework-helper/prime-factorization-table/
https://www.youtube.com/watch?v=RLbdNV1eA0w

# one-way function crypto

prime modulus:  17
generator:       3 
prn1:           15
prn2:           13

g ^ x mod pm = result

1) 3 ^ 15 mod 17 = ___6___

2) send public result 1: 6

3) 3 ^ 13 mod 17 = ___12___

4) send public result 2: 12

5) presult2 ^ prn1 mod primemodulus = shared secret
   12 ^ 15 mod 17 = 10
   (3^13) ^ 15 mod 17 = 10

6) presult1 ^ prn2 mod primemodulus = shared secret
   6 ^ 13 mod 17 = 10
   (3^15) ^ 13 mod 17 = 10

# phi

m ^ phi(n) = 1 mod n 

pick to (unequel) numbers without a common factor:
  m = 5  (message padding scheme)
  n = 8  (derived from: randomprime1 * randomprime2 )

5 ^ phi(8) = 1 mod 8

    |
    v
    phi(8) = 4

5 ^ 4 = 1 mod 8
625   = 1 mod 8
625 mod 8 = 1

# RSA cipher

publically shared: n, e, c

  m is the message

  n is the modulus
  e is the public exponent

  d is the private exponent
    k = e - 1 ??
    d = ( k * phi(n) + 1 ) / e

  test: d^e mod phi = 1

  ---> c is the encrypted message

encrypt: c = m ^ e (mod n)
decrypt: m = c ^ d (mod n)
