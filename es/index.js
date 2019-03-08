import _startup from './core/startup';
import _register from './core/register';
import _r from './core/r';
import _registerToDefault from './core/register-to-default';
import _registerSingleClassToDefault from './core/register-single-class-to-default';
import _configure from './core/configure';
import _invoke from './core/invoke';
import _invokeSingle from './core/invoke-single';
import _setGlobalState from './core/set-global-state';
import _setState from './core/set-state';
import _getState from './core/get-state';
import _emit from './core/emit';
import _emitWith from './core/emit-with';
import _off from './core/off';
import _connect from './core/connect';
import _dispatch from './core/dispatch';
import _ccContext from './cc-context';
import _CcDispatcher from './component/CcDispatcher';
import _CcFragment from './component/CcFragment';
export var startup = _startup;
export var register = _register;
export var r = _r;
export var registerToDefault = _registerToDefault;
export var registerSingleClassToDefault = _registerSingleClassToDefault;
export var configure = _configure;
export var invoke = _invoke;
export var invokeSingle = _invokeSingle;
export var setGlobalState = _setGlobalState;
export var setState = _setState;
export var getState = _getState;
export var emit = _emit;
export var emitWith = _emitWith;
export var off = _off;
export var connect = _connect;
export var dispatch = _dispatch;
export var ccContext = _ccContext;
export var CcDispatcher = _CcDispatcher;
export var CcFragment = _CcFragment;
var defaultExport = {
  emit: _emit,
  emitWith: _emitWith,
  off: _off,
  connect: _connect,
  dispatch: _dispatch,
  startup: _startup,
  register: _register,
  r: _r,
  registerToDefault: _registerToDefault,
  registerSingleClassToDefault: _registerSingleClassToDefault,
  configure: _configure,
  invoke: _invoke,
  invokeSingle: _invokeSingle,
  setGlobalState: _setGlobalState,
  setState: _setState,
  getState: _getState,
  ccContext: _ccContext,
  CcDispatcher: _CcDispatcher,
  CcFragment: _CcFragment
};

if (window) {
  window.cc = defaultExport;
}

export default defaultExport;