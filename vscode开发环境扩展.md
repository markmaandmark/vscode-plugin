### vscode开发环境扩展实验

#### 1. 实验内容

四人一组，自行挑选针对C/C++或Java程序的静态或动态测试工具，将其作为服务端完成扩展到vscode插件中

静态测试工具参考：CppCheck、KLEE、Clang-tidy等

动态测试工具参考：AFL、LibFuzzer等

#### 2. 实验要求

##### (1) 代码架构

采用客户端服务器架构，推荐使用gRPC进行客户端与服务端之间的通信

以Python语言为例，介绍如何使用gRPC进行通信：<https://grpc.io/docs/languages/python/basics/>

##### (2) 客户端展示内容要求

针对不同类型的测试工具，应该能够对测试结果有直观的展示

例如，对于静态代码分析工具插件，如C/C++的静态代码分析工具CppCheck的vscode插件Cppcheck plug-in，在分析结束后应该能够在控制台Output中输出较为详细的分析结果；对于符号执行工具插件，如KLEE的vscode插件，应该能够在分析结束后生成并直观的展示测试用例；对于动态测试工具插件，如AFL的vscode插件，应该能够在测试结束后展示出特殊的测试用例（让程序崩溃的测试用例等）以及覆盖率信息。

#### 3. 环境搭建

Ubuntu系统（18.04或20.04）

VSCode

Nodejs （javascript的运行时环境）

npm （Nodejs的包管理工具）

##### 4. vscode插件基本开发流程

<https://www.jianshu.com/p/e642856f6044>

##### 5. javascript/typescript参考资料

javascript: <https://www.liaoxuefeng.com/wiki/1022910821149312/1023020895584256>

typescript: <https://ts.xcatliu.com/>

##### 6. 评分规则

根据客户端的界面设计合理性、内容丰富程度以及展示实现的难易程序进行评分

- 界面设计合理性：如可执行命令的位置（既可在编辑框中右键点击、也可以在导航栏右键点击）、测试用例直观化展示的位置等
- 内容丰富程度：是否能够展示测试用例、是否能够展示覆盖率、单独运行测试用例能够对函数的某些行进行高亮显示等
- 展示实现的难易程度：是直接展示工具的分析结果还是需要对工具的分析结果进行解析处理等