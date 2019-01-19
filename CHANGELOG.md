
# Change Log

#### 2018-01-19 19:00
* optimize storing way on on-handler, avoid memory leak.
* promisify all cc instantce method
* the dispatch handler called in a reducer method block will implicitly find originalComputedReducerModule when the user trigger dispatch in cc instance if you don't define a reducerModule in its action, it means if a method were hit in reducer, in the reducer function block , use dispatch handler to change other module state and don't set reducerModule explicitly, reducerModule will alway be current reducer module, 
* and also the dispatch handler called in a reducer method block will implicitly find originalComputedStateModule when the user trigger dispatch in cc instance if you don't define a module in its action 
* how cc compute originalComputedReducerModule and originalComputedStateModule, for example:
```
cc.register('Foo', {module:'chart'});
class Foo extends Component{
  componentDidMount(){
    // because current cc instance belong to module chart, so if you don't set module explicitly,
    // so this dispatch will change chart module state, and find chart module reducer method changeXXX to execute
    // so originalComputedStateModule is 'chart', originalComputedReducerModule is 'chart';
    this.$$dispatch({type:'changeXXX'});

    // because current cc instance belong to module chart, so if you don't set module explicitly but you set myTargetReducer explicitly!
    // so this dispatch will change chart module state, and find myTargetReducer module reducer method changeXXX to execute
    // so originalComputedStateModule is 'chart', originalComputedReducerModule is 'myTargetReducer';
    this.$$dispatch({reducer:'myTargetReducer', type:'changeXXX'});

    // if you set module explicitly but don't set reducerModule explicitly, cc will let reducerModule value equal 'otherModule'.
    // so this dispatch will change otherModule module state, and find otherModule module reducer method changeXXX to execute
    // so originalComputedStateModule is 'otherModule', originalComputedReducerModule is 'otherModule';
    this.$$dispatch({module:'otherModule', type:'changeXXX'});

    // if you set both explicitly and myTargetReducer explicitly!
    //this dispatch will change otherModule module state, and find myTargetReducer module reducer method changeXXX to execute
    // so originalComputedStateModule is 'otherModule', originalComputedReducerModule is 'myTargetReducer';
    this.$$dispatch({module:'otherModule', reducer:'myTargetReducer', type:'changeXXX'});
  }
}

// code in chart-reducer.js,  method changeXXX of reducer 'chart'
function changeXXX({dispatch}){
  // if you call dispatch here and don't set reducerModule in action, dispatch will find reducerModule chart
}

// code in my-target-reducer.js,  method changeXXX of reducer 'myTargetReducer'
function changeXXX({dispatch}){
  // if you call dispatch here and don't set reducerModule in action, dispatch will find myTargetReducer reducer module method
}

// other-module-reducer.js, method changeXXX of reducer 'otherModule'
function changeXXX({dispatch}){
  // if you call dispatch here and don't set reducerModule in action, dispatch will find otherModule reducer module method
}

```
- if this makes you confused, always give a `module` for a action when you call dispatch whether in cc instance or reducer method block!
- and if your reducer module naming is different with state module naming, always give a `reducerModule` for a action also！ 



#### 2018-01-17 09:00
* now cc.register support set extendReactComponent as true, if you want to a real HOC ccComponent, extendInputClass is true by default
  ```
  the difference between extendInputClass is true and false is below;

  when extendInputClass is false;
  - every cc method you can not call directly, they are attached to props, so you can call them like
  this.props.$$dispatch、 this.props.$emit、 this.props.$$effect etc.
  - your component's state is not been controlled by cc yet!

  when extendInputClass is true;
  every cc method you can call directly, like this.$$dispatch、 this.$emit、 this.$$effect etc.

  when set extendInputClass as false?
  if the component you change from redux to cc has multi class decorator like below, 
  you have to set extendInputClass as false if you want it works well

  // this is dva.connect, I change it to cc.connect
  // @connect(state => ({
  //   submitting: state.form.regularFormSubmitting,
  // }))
  @cc.connect(
    'BasicForms', 
    {
      'form/regularFormSubmitting': 'submitting',
    },
    { extendInputClass: false }
  )
  @Form.create()
  export default class BasicForms extends PureComponent {

  }
  ```


#### 2018-01-16 06:30
* change RegisterOption.sharedStateKeys writing way, you need write 'all' if you want to watch whole module state, now you need write '*' instead of 'all'

#### 2018-01-16 01:00
* now stateToPropMapping now can running perfectly!

#### 2018-01-15 21:00
* feature add: now cc instance support stateToPropMapping in two way, and support match all state keys by '*'
  ```
  // assumed we have two module below
  const module1 = {a:1,b:true,c:[]};
  const module2 = {foo:1,bar:'',b:'',c:''};

  //we have two ways to register a react class to cc

  // way 1 is like below, we have to give alias to avoid key duplicated
  @cc.connect('way1',{
    'module1/a': 'm1a',
    'module1/b': 'm1b',
    'module2/b': 'm2b',
    'module2/c': 'm2c',
    });
  class A extends Component{
    render(){
      // here $$propState may like:
      const {m1a, m1b, m2b, m2c} = this.$$propState;
    }
  }
  //if we write  @cc.connect('way1',{'module1/*': '', 'module2/*': ''});
  //cc will throw error, because both module1 and module2 has a key named b !!
  //this writing is safe only if you know the module's keys is totally different


  // way 2 we can give '*' and set param 3 true, or set isPropStateModuleMode = true in register method
  // @cc.register('way2',{stateToPropMapping:{'module1/*': '','module2/*': ''}, isPropStateModuleMode:true}); this writing is also ok!
  @cc.connect('way2',{'module1/*': '','module2/*': ''}, true);
  class A extends Component{
    render(){
      // here $$propState may like, $$propState'key mean module name^_^
      const {module1:{a,b,c}, module2:{foo,bar,b,c}} = this.$$propState;
    }
  }
  ```
  
#### 2018-01-15 8:00
* feature add: now cc top api support dispatch, i like it so much more than cc.setState

#### 2018-01-14 18:00
* feature add: now cc instance support watch multi module state changing by cc.connect!!!, this usually used for some react class can not belong to
a specify module, but have to watch multi module state changing, we know watch multi module can be implemented by sharedToGlobalMapping
in startup option, but if you hate set sharedToGlobalMapping for every module, you can use cc.connect or cc.register by set stateToPropMapping mapping,
the difference between sharedToGlobalMapping and stateToPropMapping is that:  for sharedToGlobalMapping, value get from this.state, for stateToPropMapping
, value can get from this.$$propState
```
// these code written in https://github.com/fantasticsoul/rcc-simple-demo/tree/master/src/cc-use-case/WatchMultiModule
// you can update the rcc-simple-demo lastest version, and run it, then switch tab watch-multi-module, you will see what happen
import React from 'react';
import cc from 'react-control-center';

class WatchMultiModule extends React.Component {
  render() {
    console.log('%c@@@ WatchMultiModule', 'color:green; border:1px solid green;');
    console.log(`type cc.setState('todo',{todoList:[{id:Date.now()+'_1',type:'todo',content:'nono'},{id:Date.now()+'_2',type:'todo',content:'nono'}]}) in console`);

    const { gbc, alias_content, counter_result, todoList } = this.$$propState;
    return (
      <div style={{width:'100%',height:'600px', border:'1px solid darkred'}}>
        <div>open your console</div>
        <div>type and then enter to see what happen <span style={{paddingLeft:'28px',color:'red'}}>cc.setState&#40;'counter',&#123;result &#58;  888&#125; &#41;</span></div>
        <div>type and then enter to see what happen <span style={{paddingLeft:'28px',color:'red'}}>cc.setGlobalState&#40; &#123;content:'wowowo'&#125; &#41;;</span></div>
        <div>{gbc}</div>
        <div>{alias_content}</div>
        <div>{counter_result}</div>
        <div>{todoList.length}</div>
      </div>
    );
  }
}

const stateToPropMapping = {
  '$$global/borderColor': 'gbc',
  '$$global/content': 'alias_content',
  'counter/result': 'counter_result',
  'todo/todoList': 'todoList',
};

//two way to declare watching multi module cc class
export default cc.connect('WatchMultiModule', stateToPropMapping)(WatchMultiModule);
//export default cc.register('WatchMultiModule', {stateToPropMapping})(WatchMultiModule);
```


#### 2018-01-12 15:00
* feature add: now cc instance support $$emitWith, $$off, cc top api support emit,emitWith,off,r, r is short for register, the param option is also been shorted
  ```
  // two way to register a ReactClass as a CcClass 
  cc.r('Introduction', { m: 'introduction', s: 'all', g: ['$$borderColor'] })(Introduction);
  cc.register('Introduction', { module: 'introduction', sharedStateKeys: 'all', globalStateKeys: ['$$borderColor'] })(Introduction);
  ```

#### 2018-01-11 08:00
* feature add: now cc support $$on, $$onIdentity, $$emit, $$emitIdentity in cc instance, you can call these method in any method of your cc instance except for constructor!(because all the cc method $$[cc method] were injected to your cc instance after your constructor been called), usually you can call $$on,$$onIdentity in computeWillMount and call $$emit,$$emitIdentity in in any other method except for constructor.

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

react-control-center，再一次颠覆你对状态管理的认识
cnode简介：https://cnodejs.org/topic/5c0620c4d3b8ab334e8da79e#5c39cf8fa4d44449266b024e
github地址：https://github.com/fantasticsoul/react-control-center
quick-start demo: https://github.com/fantasticsoul/rcc-simple-demo