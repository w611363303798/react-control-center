
# Change Log

#### 2018-01-10 08:00
* feature add: now cc support computed, you can define computed in startup option, it means this computed working for module, and
you can also define it in a cc instance by dealer $$computed method, it means this computed working for only this instance, 
you can get refComputed with this.$$refComputed, get moduleComputed with this.$$moduleComputed, and get globalComputed with this.$$globalComputed

#### 2018-01-08 08:00
* code optimize: optimize cc.setGlobalState
  
#### 2018-01-07 08:00
* feature add: cc.configure support to control the configured module can only register one react class by set singleClass as true in option

#### 2018-01-06 16:30
* fix bug: forget to check if any key of globalStateKeys is included in global state
* feature add: startup allow config moduleSingleClass to control some module to only allow register one react class

#### 2018-01-06 16:00
* fix bug: dispatch action to other module in a reducer block, ccInstance can not recover its globalState correctly, problem found in extractStateToBeBroadcasted
  
#### 2018-01-06 12:00
* fix bug: multi module watch a same globalMappingKey, state to be broadcasted is incorrectly

#### 2018-01-05 19:00
* rewrite ccInstance.setGlobalState and ccInstance.broadcastState
* add 2 extraction strategy, if render hooker been called in different place, cc will extract committed state in different way
  ```
  see register/getSuitableGlobalStateKeysAndSharedStateKeys documentation

  it is very important for cc to know how to extract committed state for the following broadcast operation with stateFor value
  ------------------------------------------------------------------------------------------------------------------------
  if stateFor = STATE_FOR_ONE_CC_INSTANCE_FIRSTLY, cc will treat this state as a ccInstance's state, 
  then cc will use the ccClass's globalStateKeys and sharedStateKeys to extract the state.
  usually ccInstance's $$commit, $$call, $$callThunk, $$invoke, $$dispatch method will trigger this extraction strategy
  ------------------------------------------------------------------------------------------------------------------------
  if stateFor = STATE_FOR_ALL_CC_INSTANCES_OF_ONE_MODULE, cc will treat this state as a module state, 
  then cc will use the this module's globalStateKeys and sharedStateKeys to extract the state.
  usually ccInstance's $$commitWith, $$callWith, $$callThunkWith, $$effect, $$xeffect, $$invokeWith and dispatch handler in reducer function's block
  will trigger this extraction strategy
 */
  ```
  
#### 2018-01-03 08:00
* add top api cc.configure, now cc can dynamically set module、state、reducer，this api must be called after cc.startup,
* by using cc.configure, user can publish your wonderful CcifyReactComponent to npmjs package repository.
* this version is what I think and want in the beginning, now all the basic apis is ready, we can explore more wonderful things from this version
  
#### 2018-01-02 08:00
* optimize register: now startup support init option, to set your store asynchronously
* add top api cc.setState
* add top api cc.setGlobalState

#### 2018-12-26 08:00
* optimize register: make sure cc startup is called before register
* optimize register: now reducer is optional for startup options

#### 2018-12-26 09:00
* fix bug: if register a CCClass, will cause endless loop when call setState in one of its instance, to avoid this, add strict check while register a ReactClass, if it has been registered to cc, it can not been registered again.
* optimize setGlobalState: if user call setGlobalState, state will only treated as a global state.
* rename effectCtx to xeffect

#### 2018-12-09 17:00
* now ccClass can watch other module's state changing by config sharedToGlobalMapping while startup

#### 2018-12-08 13:00
* optimize ccInstance state recovering logic, fix bugs of broadcasting state.

#### 2018-12-06 13:00
* every CCClass automatically watch $$global state 's change, if you give CCClass a globalStateKeys to let cc know this CCClass want to know which keys it want to watch, then any state of these keys changed will trigger this CCClass's all instance render, if you want to reject render triggered by global state change in some CCInstance, you can specify syncGlobalState=false in these CCInstance
* now ccInstance can call setGlobalState, your can also call cc.setGlobalState in any where;

#### 2018-12-05 10:00
* now ccInstance can declare storedStateKeys in ccOption if you want to hold the state back while the ccInstance destroyed and mount again! note that any key of storedStateKeys can not be duplicate with any key of sharedStateKeys， and you must explicitly specify a ccKey if you want to use storedStateKeys
* add life cycle hook $$afterSetState

#### 2018-12-05 8:00
* rename cor api of ccIns! add prefix $$, and optimize their code
* now reducer function can be can be any type of them (async, generator, normal);
* add life cycle hook fo cc instance: $$beforeSetState , $$beforeBroadcastState

#### 2018-12-04 14:00
* attach $invoke and $invokeWith method to ccInstance, with co module, ccInstance.$invoke can invoke user's customize function which can be any type of them (async, generator, normal);

#### 2018-12-04 09:00
* CCClass can be declared as singleton by specify option.isSingle=true, once a CCClass is under singleton mode, it can only create one CCInstance in CC_CONTEXT, the CCInstance's ref name is the CCClassName,you can find it in window.cc.refs or window.CC_CONTEXT.refs

#### 2018-12-03
* optimize CCKey duplicate judgement while cc is run in hot reload mode;