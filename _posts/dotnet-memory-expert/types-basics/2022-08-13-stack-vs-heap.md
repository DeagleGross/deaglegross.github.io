# Stack vs Heap

## What we need to implement and our possibilities:
From the ECMA here is the full list of memory locations to store some data to implement:
- method's local variable
- method's argument
- instance field of reference type
- instance field of value type
- static field
- local memory pool

For all of these we can use some OS capablities:
- method's stack frame (lifetime of a method)
- managed heap (lifetime that is undetermined - it is GC's responsibility)
- CPU registers (very volatile)

## Method's stack frame
### Method's stack frame has the following layout:
- arguments (a, b, c, d, ...)
- return address (where to return if the method ends. It is the place, where the method was called)
- local variables (x, y, z, j, ...)

### Overhead for the stack frame
Imagine we have called method `A()` and then method `B()` from the `Main()` method. But after method `A()` is already completed, stack frame will be full of some unused but filled in values.

So before method `B()` is called, we are doing **stack zeroing**.

**!Important!**
Every thread has its own stack frame for safety.

## Memory locations in CPU
Every CPU x64 architecture has 16 registers that can be used to store 64-bit data. Like `rax`, `rbx`, `rcx`, ... Also there are two important ones:
- `rsp` is a stack pointer
- `rbp` is a base pointer

There are also *calling conventions*:
- Microsoft x64 (Windows)
    - first 4 arguments: `rcx`, `rdx`, `r8`, `r9`
    - next arguments: stack
    - return value: `rax`
- AMD64 (Linux, macOS):
    - first 6 arguments: `rdi`, `rsi`, `rdx`, `rcx`, `r8`, `r9`
    - next arguments: stack
    - return value: `rax`
floating point arguments and return value use special `xmm` registers

## Memory locations summary
Here is the full schema of where all value\reference types are stored in case of different usages:

| Usage \ Variable Type | Value Type | Reference Type |
| --- | --- | --- |
| method's local variable | method call lifetime ***(CPU\Stack)*** | reference (pointer) has method's lifetime. Referenced data probably outlives method ***Heap*** |
| method's argument | method call lifetime ***CPU\HEAP*** | reference (pointer) has method's lifetime. Referenced data probably outlives method ***Heap*** |
| instance field of reference type | same as lifetime of containing reference type value ***Heap*** | At least the lifetime of the containing reference type value ***Heap*** |
| instance field of value type | same as value type instance ***Stack\CPU*** or ***Heap*** | Reference (pointer) - value's lifetime. Referenced data - unknown lifetime ***Heap*** |
| static field | (long) module lifetime. ***blob*** or ***Heap*** | (long) module lifetime. ***Heap*** |
| local memory pool | method call lifetime ***Stack\CPU*** | ... |

## Escape analysis
Full description can be found here - [Official Microsoft dotnet JIT documentation](https://github.com/dotnet/runtime/blob/main/docs/design/coreclr/jit/object-stack-allocation.md)

If the object (i.e. `items`) **is** escaping a method (i.e. this code)
```
int CountItemsPrice()
{
    var items = new List<int> { 1, 2 };
    return items.Count();
}
```
then JIT maybe can not even use the object `List<int>`! It just uses CPU for calculating the result of method `List<T>.Count()` and no instantiation is done. This leads to less GC pressure.