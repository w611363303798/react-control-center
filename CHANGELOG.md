
# Change Log

## 2018-12-04
* 删除CC实例上原来的call，callWith函数，更新为$$call, $$callWith函数
* 新增$callThunk, $callThunkWith, 方便调用thunk函数
* 新增单例模式，单例模式CCClass只能实例化一次，ccUniqueKey就是CCClassName, refs可以直接通过CCClassName调用reactRef的方法

## 2018-12-03
* 新增 ccIns.call, ccIns.callWith函数，方便更灵活的改变state
* 修复在webpack 热加载模式下，CC_CONTEXT.refs 维护不正确的问题