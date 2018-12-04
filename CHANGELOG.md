
# Change Log

## 2018-12-04 14:00
* attach $invoke and $invokeWith method to ccInstance, with co module, ccInstance.$invoke can invoke user's customize function which can be any type of them (async, generator, normal);

## 2018-12-04 09:00
* CCClass can be declared as singleton by specify option.isSingle=true, once a CCClass is under singleton mode, it can only create one CCInstance in CC_CONTEXT, the CCInstance's ref name is the CCClassName,you can find it in window.cc.refs or window.CC_CONTEXT.refs

## 2018-12-03
* optimize CCKey duplicate judgement while cc is run in hot reload mode;