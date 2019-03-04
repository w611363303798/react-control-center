# react-control-center [C_C]
**without redux、mobx, writing react app with cc is a funny way also, it's definitely worth doing!**
**your star will be greatly appreciated^_^**
### for collecting feedback I create a QQ group number: 647642619, welcome to join it.

![one-demo](http://g.recordit.co/aIThT3wFUT.gif)

## [Online demo](https://codepen.io/fantasticsoul/pen/QYeMje) [Online advanced demo](https://codepen.io/fantasticsoul/pen/QYeMje) [Jsrun video](http://jsrun.net/vLXKp/play)

## why react-control-center
- focus on react state management.
-  few third party dependencies.
- it is very very progressive、flexible and easy to use, you can use cc partially only by writing very less code in your existed redux project 、dva project and etc, your app will still works perfectly.
- vue like program experience if you want, class api `$$computed` and instance api `$$emit`、`$$emitIdentity`、`$$on` 、`$$onIdentity`、`$$off` makes you do something interesting you never experienced before, but it is optional.
- simple understanding but powerful api designing, you can play your imagination to explore your cc coding way by powerful basic instance api like `$$dispatch`、`$$effect`、`setState`, class api like `$$beforeSetState`、`$$beforeBroadcastState`、`$$afterSetState`、 and top api like `setState`、`setGlobalState`、`emit`、`dispatch`、`invoke` and etc.
- high performance rendering way, cc own all cc class instance refs and know which instance should be rendered again every time when state changed.
- all in all, cc let you writing react app in react way, no magic concept.
  
## how to use
    $ npm install react-control-center

## [cc-quick-start](https://github.com/fantasticsoul/rcc-simple-demo)
    https://github.com/fantasticsoul/rcc-simple-demo    

## compatibility
    react 15+

## core concept
- 2 built-in modules
  > `$$global`、`$$default`
- 3 kinds of state
  > `refState`、`moduleState`、`globalState`
- 3 kinds of computed result can been get in `cc instance`
  > `$$refComputed`、`$$moduleComputed`、`$$globalComputed`
- 4 kinds of state key can been set in `cc class` and `cc instance`;
  > `globalStateKey`、`sharedStateKey`、`storedStateKey`、`temporaryStateKey`
- 5 recommended ways to trigger render in `cc instance`
  > `setState`、`$$dispatch`、`$$invoke`、`$$effect`、`$$xeffect`

![](https://github.com/fantasticsoul/static/blob/master/img/cc/cc3.png?raw=true)

## Getting Started

### Creating an App
Use [create-react-app](https://github.com/facebookincubator/create-react-app) to create an app:

```sh
$ npm i -g create-react-app
$ create-react-app cc-app
```
After creating, install react-control-center from npm:

```sh
$ cd cc-app
$ npm i --save react-control-center
$ npm start
```
### `index.js` [online demo](http://jsrun.net/b6XKp/play)
```js
import React from 'react'
import cc from 'react-control-center'

// startup cc with module mode
cc.startup(
  {
    isModuleMode: true,
    // declare a module state named 'counter'
    store: {
      counter: {
        num1: 0,
        num2: 0,
      }
    },
    reducer: {
      // a reducer module named 'counter'
      counter: {
        incNum1({ moduleState }) {
          return { num1: moduleState.num1 + 1 };
        },
        async incNum2({ moduleState }) {
          // await api.doSomethingOther();
          return { num2: moduleState.num2 + 1 };
        },
        decNum1({ moduleState }) {
          return { num1: moduleState.num1 - 1 };
        },
        decNum2({ moduleState }) {
          return { num2: moduleState.num2 - 1 };
        }
      },
      // cc allow you declare your customized reducer module
      foo: {
        incNum1AndNum2({ moduleState }) {
          const { num1, num2 } = moduleState;
          return { num1: num1 + 1, num2: num2 + 1 };
        },
        async incNum1AndNum2Wow({ dispatch }) {
          //this means use counter module reducer's incNum1 method to change counter module state
          dispatch('counter/incNum1');
          dispatch('counter/incNum2');

          // if this method is called by counter module's instance, the default state module in dispatch handler will be counter, so we can write like this: dispatch('/foo/incNum1');

          /** dispatch return a promise, so we can also write like below
           * await dispatch('counter/incNum1');
           * await dispatch('counter/incNum2');
           */
        }
      }
    }
  }
);

function incNum1(num1) {
  return { num1 };
}

async function incNum2(executionContext, sentence) {
  const { moduleState, dispatch, effect, xeffect } = executionContext;
  // you can use dispatch 、 effect、 xeffect to compose different custom function or reducer function to do interesting things
  return { num1: moduleState.num1 + 1 };
}

class Counter extends React.Component {
  // note wo don't define any state in constructor, only if you want to add anther key in your ref state, 
  // or your sharedStateKeys setting is not whole of the cc module state
  /**
      constructor(props, context) {
      super(props, context);
      this.state = {
          // as we declare sharedStateKeys as '*', this value will rewrited by cc store's num1, so you don't need declare it here
          // but if we declare sharedStateKeys as ['num2'], it means this cc component only share key num2's state changing,
          // and then the num1 will be current instance's private state key..
          num1:200,
          my_key1:33,
          my_key2:66,
      }

      // because we declare sharedStateKeys as '*', so the final merged state is
      {num1:0, num2:0, my_key1:33, my_key2:66}
  }
   */
  $$computed() {
    return {
      num1(num1) {
        return num1 * 100;
      }
    }
  }
  incNum1ByClassicalSetState = () => {
    this.setState({ num1: this.state.num1 + 1 });
  }
  incNum1ByDispatch = () => {
    this.$$dispatch('incNum1');
  }
  incNum1ByCustomFunction1 = () => {
    this.$$effect('counter', incNum1, this.state.num1 + 1);
    // or you can write like this:
    // this.$$effect(this.cc.ccState.module,incNum1, this.state.num1+1);
  }
  incNum1ByCustomFunction2 = () => {
    this.$$xeffect('counter', incNum2, `xffect will use custom function's first param to inject executionContext `);
  }
  incNum1ByInvoke = () => {
    // $$effect must user input first param as module
    //if you can make sure that you want to change the state of current instance's module, use $$invoke
    this.$$invoke(incNum1, this.state.num1 + 1);
  }
  render() {
    const { num1, num2 } = this.state;
    const { num1: scaledNum1 } = this.$$refComputed;
    return (
      <div>
        <span>scaledNum1 is {scaledNum1}</span>
        <hr />
        <span>num1 is {num1}</span>
        <hr />
        <span>num2 is {num2}</span>
        <hr />
        <button onClick={this.incNum1ByClassicalSetState}>inc num1 by classical setState</button>
        <button onClick={this.incNum1ByDispatch}>inc num1 by dispatch</button>
        <button data-cct="incNum1" onClick={this.$$domDispatch}>inc num1 by domDispatch</button>
        <button onClick={this.incNum1ByCustomFunction1}>inc num1 by custom function 1</button>
        <button onClick={this.incNum1ByCustomFunction2}>inc num1 by custom function 2</button>
        <button onClick={this.incNum1ByInvoke}>inc num1 by custom function 2</button>
        {/* 
      here we use $$domDispatch, 
      data-cct means action type,
      data-ccrm means reducer module name, if we don't specify it, 
      cc will use current instance's module name to be reducer module name,
      and current instance belong to counter module, but we haven't defined a function named incNum1AndNum2 in counter reducer,
      so we have to write data-ccrm="foo",
      by the way, data-ccm means module,
      and we needn't write data-ccm="counter", because current instance belong to counter module, only if we want to change other
      module's state we have to write a module name in data-ccm
    */}
        <button data-cct="incNum1AndNum2" data-ccrm="foo" onClick={this.$$domDispatch}>inc num1 and num2 both</button>
        <button data-cct="incNum1AndNum2Wow" data-ccrm="foo" onClick={this.$$domDispatch}>inc num1 and num2 both in another way</button>
        {/*
                  all cc insntance can communicate with emit&on or emitIdentity&onIdentity
              */}
        <button onClick={() => this.$$emit('hi', 'param1', 'param2')}>emitToApp</button>
        <button onClick={() => this.$$emitIdentity('hi2', 'identity', 'Iparam1', 'Iparam2')}>emitIdentityToApp</button>
      </div>
    );
  }
}
const CcCounter = cc.register('Counter', { module: 'counter', sharedStateKeys: '*' })(Counter);

class App extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = { showCounter: true };
  }
  componentDidMount() {
    this.$$on('hi', (p1, p2) => alert(`p1${p1} p2${p2}`));
    this.$$onIdentity('hi2', 'identity', (p1, p2) => alert(`p1${p1} p2${p2}`))
  }
  render() {
    return (
      <div>
        {/* let Counter unmount and mount again, to show their state will been recovered by cc from cc store */}
        <button onClick={() => this.setState({ showCounter: !this.state.showCounter })}>toggle counter view</button>
        {/* initialize 3 CcCounter, to show their state will sync from each other by cc */}
        {
          this.state.showCounter ?
            <React.Fragment>
              <CcCounter />
              <CcCounter />
              <CcCounter />
            </React.Fragment> :
            ''
        }
      </div>
    );
  }
}
//just register App as a cc component, here wo don't define module, cc will let it belong to cc's built-in module $$default.
const CcApp = cc.register('App')(App);

// start the app，`render` is an enhanced `ReactDOM.render`
ReactDOM.render(<CcApp />, document.getElementById('app'))

```

## simple introduction
- using cc requires only two steps: `startup` and `register`, `startup` must been written in your app's entry file first line to make sure your `cc class` works well.
- you can set store、reducer、init、computed in `startup` method, but all of them is optional, so you can calling `startup` directly, that means cc run in non-module mode, and then cc only own two built-in modules:`$$default` and `$$global`.
```
import cc from 'react-control-center';

cc.startup();
```
- or you can run cc in module mode which is strongly recommended.
```
// here is a full example about startup
import cc from 'react-control-center';

cc.startup({
  isModuleMode: true,
  store:{
    $$global:{
      themeColor:'',
      borderColor:'',
      maskLoading:false,
    },
    fooModule:{
      foo:1,
      bar:2,
    }
  },
  reducer:{
    $$global:{
      setMaskLoadingTrue:()=>{
        return {maskLoading: true};
      },
      changeThemeColor:async function({payload:newColor, dispatch}){
        // set maskLoading as true firstly
        await dispatch({type:'setMaskLoadingTrue'});
        // save user choosing color to server
        await api.saveUserThemeColor(newColor);
        // change $$global state's themeColor to newColor
        // and maskLoading to false
        return {themeColor:newColor, maskLoading:false};
      },
      changeBorderColor:async function({payload:newColor, dispatch}){
        await dispatch({type:'setMaskLoadingTrue'});
        await api.saveUserBorderColor(newColor);
        return {borderColor:newColor, maskLoading:false};
      }
    },
    fooModule:{
      incFoo:({moduleState})=>{
        const foo = moduleState.foo+1;
        return {foo};
      }
    }
  },
  init:{
    // fetch user stored themeColor from server for $$global module
    $$global: setState=>{
      api.fetchUserThemeColor(themeColor=>{
        setState({themeColor});
      });
    }
  },
  computed:{
    $$global:{
      borderColor(borderColor){
        return `1px solid ${borderColor}`;
      }
    }
  }
});

// now your can open your console in your chrome browser, and type sss to view the store tree ^_^
// type cc to view the top api
```
![](https://github.com/fantasticsoul/static/blob/master/img/cc/cc_module.png?raw=true)

- registering a `react class` is very easy, all `smart react component` (`react class`) can be registered as `cc component` (`cc class`), you must supply a unique `ccClassKey` for every `cc class`.
```
import react, {Component} from 'react';
import cc from 'react-control-center';

class Foo extends Component{...}

// now you've created a cc class named 'Foo', 
const _Foo = cc.register('Foo')(Foo);
// error will been throwed if you register Foo as cc class named 'Foo' again!
const _Foo2 = cc.register('Foo')(Foo);

export default _Foo;
```
- every `cc class` watch `$$default` module state changing by default if you don't specify a module while registering a `react class`, and by setting `sharedStateKeys` you can watch part state changing of your belonging module, `sharedStateKeys` is an empty array by default.
```
import react, {Component} from 'react';
import cc from 'react-control-center';

class Foo extends Component{...}

// now you've created a cc class named 'Foo', 
// it belonged to $$default module,
// but it's sharedStateKeys is empty, so it can not receive $$default 
// module state changing signal, and it's state changing can also not 
// effect other cc instance which is also belonged to '$$default'
export default cc.register('Foo');
```
```
import react, {Component} from 'react';
import cc from 'react-control-center';

class Foo extends Component{...}
class Bar extends Component{...}

const _Foo = cc.register('Foo',{sharedStateKeys:['foo','bar']});
const _Bar = cc.register('Bar',{sharedStateKeys:['foo']});

// two cc class _Foo and _Bar were created above, now they all
// both belong to $$default module, because their different sharedStateKeys setting, when _Foo's one instance change foo and bar, _Foo's other instance will receive the latest foo and bar to render new view, and _Bar's all instance will only receive the latest foo to render new view
```
- every `cc class` can watch `$$global` module state changing naturally，that means every `cc class` can watch its own belonging module state changing and `$$global` module state changing both.
```
import react, {Component} from 'react';
import cc from 'react-control-center';

class Foo extends Component{...}
class Bar extends Component{...}

const _Foo = cc.register('Foo',{sharedStateKeys:['foo','bar'], globalStateKeys:['themeColor']});
const _Bar = cc.register('Bar',{sharedStateKeys:['foo'], globalStateKeys:['themeColor']});

// two cc class _Foo and _Bar were created above, now they all
// both watch the same globalStateKey themeColor, any cc instance change themeColor will
// trigger these two cc class's all instance to render new view.
```
- every `cc instance` has a `uniqueCcKey`, it is combined from `ccClassKey` and `ccKey`, if you don't supply a `ccKey` to a `cc instance` props explicitly, cc will generate one automatically.
- `storedStateKeys` is supply in ccOption that on cc instance's props, if you want some instance's state that doesn't belong to $$globalModule or its belongingModule either  can been recovered after it is been unmounted and mount again, `storedStateKeys` is what you want.
```
import react, {Component} from 'react';
import cc from 'react-control-center';

@cc.register('Foo', {module:'fooModule', sharedStateKeys:['foo'], globalStateKeys:['themeColor']})
export default class Foo extends Component{
  constructor(props, context){
    super(props, context);
    this.state = {
      // priv_key1 and priv_key2's value will been recovered from cc's refStore,
      // if you set storedStateKeys in cc instance's prop ccOption, and note that!
      // using this feature you must explicitly supply ccKey on cc instance's prop ccKey
      priv_key1:'wow',
      priv_key2:'cool',
      // foo's value will been recovered from it's fooModule module 
      // because of setting sharedStateKeys ['foo']
      foo:'',
      // themeColor's value will been recovered from $$global module 
      // because of setting globalStateKeys ['themeColor']
      themeColor:'',
      // lostKey is the key that cc called temporaryKey, 
      // its value will be lost while the cc instance unmount
      lostKey:'',
    };
  }
}

------------------------------------------------
import Foo from './Foo'; //now Foo is a cc class

class App extends Component{
  render(){
    return (
      <div>
        <Foo ccKey="foo1" ccOption={{storedStateKeys:['priv_key1']}} />
        <Foo ccKey="foo1" ccOption={{storedStateKeys:['priv_key1', 'priv_key2']}} />
        <Foo />
      </div>
    );
  }
}
```

## react class、 cc class and cc instance relationship
![](https://raw.githubusercontent.com/fantasticsoul/static/master/img/cc/cc2.png)
---
## how cc instance's state and prop state comes
![](https://raw.githubusercontent.com/fantasticsoul/static/master/img/cc/cc-class-and-ins.png)

