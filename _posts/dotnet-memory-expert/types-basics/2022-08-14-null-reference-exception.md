# What is null
Tony Hoare invented `null` in 1965 (also quicksort for example). He called it a **billion-dollar mistake**.

`null` follows some *fail-fast* approach, because it is expected to fail immediately with NullReferenceException then with a random error later.

## Implementation details
Basically access to `object.Field` is done using accessing object + field offset (i.e. 0x10).

So if the object is `null`, then the object address is 0 (in register in example). We are adding 0x10 (16) to zero address and it will be a very low address in memory.

We cannot access such a low memory address, because it is protected in page system (that memory is constructed with). This is handled by operating system as `invalid access to protected page` - first 4kB of every process. Then .NET wraps such an error in *NullReferenceException*

If you try to access the second page (4kB + 1 byte i.e.):
```
Unsafe.Read<byte>((void*)0x1_001)
```
you will get a **AccessViolationException** because this page is protected or not asigned to your process..

## What if object is bigger than 4 kB:
```
public class MyBigClass
{
    public long Field_1;
    ...
    public long Field_8000;
}
```

JIT is clever and will add null checking of entire object before field access. So you will not get any `AccessViolationException` - only `NullReferenceException`.

