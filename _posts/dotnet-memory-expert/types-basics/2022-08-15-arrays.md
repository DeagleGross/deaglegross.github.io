# Array of structs \ classes

## Memory representation

Imagine we have such a struct
```
public struct SomeStruct
{
    public int x;
    public int y;
}
```

SomeStruct[] has a great representation in memory:
```c#
[header]
[MT]
// 1 obj
[x]
[y]
// 2 obj
[x]
[y]
// 3 obj
[x]
[y]
```

In case of class SomeClass:
```
public class SomeClass
{
    public int x;
    public int y;
}
```

```c#
[header]
[MT]
// 1 object reference
[pointer] => somewhere in heap:[header, MT, x, y]
// 2 obj reference
[pointer] => somewhere in heap:[header, MT, x, y]
// 3 obj reference
[pointer] => somewhere in heap:[header, MT, x, y]
```