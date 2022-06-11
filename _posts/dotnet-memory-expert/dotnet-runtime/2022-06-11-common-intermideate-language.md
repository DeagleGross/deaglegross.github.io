# Common Intermediate Language (CIL)

- It is a simple instructions text file (stored in binary format usually)
- it represents operations on *abstract stack-based* machine. And it is not of .NET virtual machine, it is an **abstract** one
- it is called **evaluation stack**

Let's view simple method in IL (you can view it at [sharplabio](https://sharplab.io/#v2:C4LglgNgNAJiDUAfAAgJgIwFgBQyDMABGgQMIEDeOB1RhYAdsAQOICmwASqwM4CuEwABQMmAQygERBAEYBKClRpKwAMwKDRBAHwz5yAOwFRAbkVLqrCN1ZFDm+DNPYlAXxwugA==))
```
public class C {
    public int GetResult(int a, int b) {
        if (a > b) return a;
        else return a + b;
    }
}
```

And it's IL representation (you can immediately see that it is object oriented):
```
.class public auto ansi beforefieldinit C
    extends [System.Private.CoreLib]System.Object
{
    // Methods
    .method public hidebysig 
        instance int32 GetResult (
            int32 a,
            int32 b
        ) cil managed 
    {
        // Method begins at RVA 0x2050
        // Code size 21 (0x15)
        .maxstack 2
        .locals init (
            [0] bool,
            [1] int32
        )

        //// there is no argument 0, because this method is not static, and 0-index argument is the class C instance reference
        IL_0001: ldarg.1 //// load arg number 1 onto the stack (arg `a`)
        IL_0002: ldarg.2 //// load arg number 2 onto the stack (arg `b`)
        IL_0003: cgt 
        IL_0005: stloc.0
        // sequence point: hidden
        IL_0006: ldloc.0
        IL_0007: brfalse.s IL_000d //// takes out two topmost values from the evaluation stack, transfers control to target IL_000d if condition branch is false.

        IL_0009: ldarg.1 //// place on the stack arg 1
        IL_000a: stloc.1 
        IL_000b: br.s IL_0013

        IL_000d: ldarg.1 //// placing on stack arg 1
        IL_000e: ldarg.2 //// placing on stack arg 2
        IL_000f: add //// adding two topmost values on the stack
        IL_0010: stloc.1
        IL_0011: br.s IL_0013

        IL_0013: ldloc.1
        IL_0014: ret //// return value from the stack from the method
    } // end of method C::GetResult
} // end of class C
```

This is not an efficient code, so .NET runtime doesn't run it as it is represented in the IL. If we want to view it in Assembly, it looks like this:
```
// eax - expected register for the result of method

Method(Int32, Int32)
        cmp edx, r8d
        jle short L000x // if (a > b)
        mov eax, edx 
        ret // return a;
L000x:  lea eax, [rdx+r8]
        ret // return a + b;
```
As we can see, there is no stack pushing or popping operations - it is super efficient comparing to IL.

## Tiered JIT
Since .NET Core 2.1 tiered compilation allows to compile into two *tieres*:
- firstly version of code is generated faster, but not optimized (like Debug version)
- then it is generated more slowly, but highly optimized. Usually it is optimized when it is called about N times. (N - current dotnet implementation detail)

## Inlining methods
Also there is a possibility to inline methods. If JIT thinks it's better not to run another method but to run the internals of another methods right here, that another method is inlined.

```
void MyMethod()
{
    // not inlined
    for (int i = 0; i < 100; i++)
        MyLogMethod("hello");

    // inlined
    for (int i = 0; i < 100; i++)
        Console.WriteLine("hello");
}

void MyLogMethod(string message)
{
    Console.WriteLine(message);
}
```