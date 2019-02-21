import startup from './core/startup';
import register from './core/register';
import r from './core/r';
import registerToDefault from './core/register-to-default';
import registerSingleClassToDefault from './core/register-single-class-to-default';
import configure from './core/configure';
import invoke from './core/invoke';
import invokeSingle from './core/invoke-single';
import setGlobalState from './core/set-global-state';
import setState from './core/set-state';
import getState from './core/get-state';
import emit from './core/emit';
import emitWith from './core/emit-with';
import off from './core/off';
import connect from './core/connect';
import dispatch from './core/dispatch';
import ccContext from './cc-context';
var defaultExport = {
  emit: emit,
  emitWith: emitWith,
  off: off,
  connect: connect,
  dispatch: dispatch,
  startup: startup,
  register: register,
  r: r,
  registerToDefault: registerToDefault,
  registerSingleClassToDefault: registerSingleClassToDefault,
  configure: configure,
  invoke: invoke,
  invokeSingle: invokeSingle,
  setGlobalState: setGlobalState,
  setState: setState,
  getState: getState,
  ccContext: ccContext
};

if (window) {
  window.cc = defaultExport;
}

export default defaultExport;