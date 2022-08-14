# Type Layout

There are 2 significantly different types in the .NET ecosystem:
- **Value-type** is such a type that contains all the data directly. I.e. an integer contains a single number directly.
- **Reference-type** is such a type that contains a reference to it's data. I.e. if we create an instance of a class `Car` with fields `Weight`, `Color` and `Speed`, we will have a variable, that is a reference to some location in a memory, where all these data is contained. But variable will not have all the data itself.

Surely, not only the format of data storage for such types is different, but other characteristics too:

| Type | Passing availability | Lifetime | Equality | Instances examples |
| --- | --- | --- | --- | --- |
| Value type | can be sent only as a copy | the instance lifetime. When number is not used, it is not used anymore - nothing to investigate here. | absolute bit equality | `bool`, `char`, `float`, `double`, `int`, any *Enums*, any *structs* |
| Reference type | can be sent itself | not obvious -> depends on amount of references to the data. So this is needed to be discovered. | based on location. If references are pointing to the same location, then they are equal. | any *classes*, `string`, `Object`, any *arrays*, boxed types, delegates |

## Value-type layout
```
struct MyStruct
{
    public int Field_1;
    public int Field_2;
    public int Field_3;
    public int Field_4;
}
```

Such **struct** has a layout only for the contents of a struct (*f_i is a field_i contraction*):

```
... [4 byte for f_1][4 byte for f_2][4 byte for f_3][4 byte for f_4] ...
```

## Reference-type layout
```
class MyClass
{
    public int Field_1;
    public int Field_2;
    public int Field_3;
    public int Field_4;
}
```

Such **class** has a layout with padding (if x64 architecture), object header, MethodTable pointer and only then all the contents (*f_i is a field_i contraction*):

```
x32
... [4 byte for object header][4 byte for MethodTable][4 byte for f_1][4 byte for f_2][... f_3][... f_4] ...

x64
... [padding 4 byte + 4 byte for object header][8 byte for method table][4 byte for f_1][4 byte for f_2][... f_3][... f_4] ...
```

Just to show how method table pointer works, here is an example:
```
class OuterClass { public InnerClass Pointer; }
class InnerClass { public int Value; }

A: [object-header][MethodTable][Pointer]
                               /
                              /
                             /
                            \/ 
B: [object-header][MethodTable][4 byte for Value field]
```

The minimum object size is 1 byte for a struct and 12 bytes for a class on 32-bit runtime, 24 bytes for a class on a 64-bit runtime.