# react-control-center [C_C]
**without redux、mobx, writing react app with cc is a funny way also, it's definitely worth doing!**

## why react-control-center
- focus on react state management.
- few third party dependencies.
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

![](https://user-gold-cdn.xitu.io/2019/1/21/1686e03f133218ad?w=845&h=784&f=png&s=76088)

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
![](https://user-gold-cdn.xitu.io/2019/1/16/168559cf0123ae69?w=1379&h=816&f=png&s=197933)

