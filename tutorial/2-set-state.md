[react-control-center tutorial 1] setState

> 注：本教程针对的有一定react基础知识的用户，如无任何react只是了解或者开发经验，可以先通过create-react-app快速跑起来一个应用并结合官网的知识介绍，再来阅读此文。

---
#### setState, react数据驱动智能组件视图变化的唯一入口
* 分析setState函数参数列表，react做了什么？
> ##### 我们知道，在react世界里，针对智能组件，我们会在constructor里事先声明好该组件的初始state，之后任何状态的改变最后都要通过调用setState来驱动react把最新的数据渲染到视图里，setState本身支持传入是一个particalState，视图里每一个动作可能需要改变只是其中部分state，所以setState里需要用户传入是一个对象，key就是对应state里的key，value就是交给react渲染的最新的值，所以通过setState的toSet对象，我们可以分析出这一次调用将要改变的state里那些key的。
* 在cc的世界里cc组件的setState又是怎样的？
> 让我们