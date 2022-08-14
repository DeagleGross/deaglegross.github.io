# .NET

**.NET is an open specification** that describes  executable code + runtime environment that allows high-level languages to be used to write single code for different computer platforms. 

Specification is called as **Common Language Infrastructure**.  
Common Language Infrastructure consists of:
- the Common Type System (CTS) - set of data types
- the Metadata - infromation about the program structure\data
- the Common Language Specification - set of rules to interoperate with other CLS-compliant languages
- the Virtual Execution System (VES) - loads and executes CLI

And CLI-compatible programs are compiled to Common Intermediate Language (CIL).

To enable CLS-compliance you can use `[assembly: CLSCompliant(true)]` attribute on namespace i.e.

.NET runtime is a Virtual Execution System. Imagine you have a piece of code executing CIL code and it is executed from an assembly\module (from a physical container for code and metadata) that is placed on a computer where Virtual Execution System is setup.

An **assembly** is a set of one or more files deployed as a unit.
It contains a manifest that defines *version, name, culture and data about which files belong to the assembly*

A **module** is a single file containing executable content.  
A module can belong to several assemblies (be shared accross them)
```
assembly A:
- resource file 1
- module file 1
- module file 2 with manifest that declare an assembly. This means these assembly declarations are referencing other modules.
```
However Visual Studio IDE creates only single-file assemblies.

For example compilation of *Console HelloWorld* application produces a single module file\assembly with such a manifest:
```
// references
.assembly extern System.Runtime
{
    ...
}

// references
.assembly extern System.Console
{
    ...
}

// describtion of assembly itself
.assembly ConsoleApp
{
    ...
}

// name of module
.module ConsoleApp.dll
```

## .NET Ecosystem

The whole process looks like this

1. Firstly, assembly files need to be created:
- C# source files **->** C# compiler **->** assembly file (.dll) with *metadata* and *IL*
- F# source files **->** F# compiler **->** assembly file (.dll) with *metadata* and *IL*
2. Then .NET process (host) is created. It (for example) downloads .net runtime and launches it.
3.  Then it loads assembly files to memory of .NET process. Files are now visible from the process. Surely, not only your code is loaded, but the libraries installed through NuGet are loaded into the .NET process also.
4. .NET Process **Loader** processes metadata and provides an *internal data representation* of an assembly
5. Just-in-time compiler uses IL code and information from *internal data* to produce native code with optimizations (due to knowing information about running environment).
6. This is not a surely executed part. Native code calls an *execution engine* for exceptions and threading and it calls an operating system. And *execution engine* is a c++ application, so it uses **unmanaged heap** memory. Native code even can directly invoke an operating system (i.e. using `P\Invoke`)
7. And native code allocates some object on the **managed heap** by the support of **Garbage Collector**. Garbage Collector also collects all unused at the moment memory.

Also there is a possibility to **un**load assemblies from the .NET process.

## Deploy and Host
You can specify different parameters on publishing:
- target runtime  (win x32\x64, linux x32\x64, macos...)
- single file mode (all dependencies are packed in single file)
- deployment mode -> it could be *framework dependent* so that it will require .NET to be installed on the target machine. Or it can be *self-contained*, so that it contains a lot of framework, runtime, GC and etc files inside a final result package.