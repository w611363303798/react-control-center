
# Change Log
## 2018-12-08 13:00
* optimize ccInstance state recovering logic, fix bugs of broadcasting state.
  

## 2018-12-06 13:00
* every CCClass automatically watch $$global state 's change, if you give CCClass a globalStateKeys to let cc know this CCClass want to know which keys it want to watch, then any state of these keys changed will trigger this CCClass's all instance render, if you want to reject render triggered by global state change in some CCInstance, you can specify syncGlobalState=false in these CCInstance
* now ccInstance can call setGlobalState, your can also call cc.setGlobalState in any where;

## 2018-12-05 10:00
* now ccInstance can declare storedStateKeys in ccOption if you want to hold the state back while the ccInstance destroyed and mount again! note that any key of storedStateKeys can not be duplicate with any key of sharedStateKeys， and you must explicitly specify a ccKey if you want to use storedStateKeys
* add life cycle hook $$afterSetState

## 2018-12-05 8:00
* rename cor api of ccIns! add prefix $$, and optimize their code
* now reducer function can be can be any type of them (async, generator, normal);
* add life cycle hook fo cc instance: $$beforeSetState , $$beforeBroadcastState

## 2018-12-04 14:00
* attach $invoke and $invokeWith method to ccInstance, with co module, ccInstance.$invoke can invoke user's customize function which can be any type of them (async, generator, normal);

## 2018-12-04 09:00
* CCClass can be declared as singleton by specify option.isSingle=true, once a CCClass is under singleton mode, it can only create one CCInstance in CC_CONTEXT, the CCInstance's ref name is the CCClassName,you can find it in window.cc.refs or window.CC_CONTEXT.refs

## 2018-12-03
* optimize CCKey duplicate judgement while cc is run in hot reload mode;