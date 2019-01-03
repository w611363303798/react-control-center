import startup from './core/startup';
import register from './core/register';
import configure from './core/configure';
import invoke from './core/invoke';
import invokeSingle from './core/invoke-single';
import setGlobalState from './core/set-global-state';
import setState from './core/set-state';
import ccContext from './cc-context';
var defaultExport = {
  startup: startup,
  register: register,
  configure: configure,
  invoke: invoke,
  invokeSingle: invokeSingle,
  setGlobalState: setGlobalState,
  setState: setState,
  ccContext: ccContext
};

if (window) {
  window.cc = defaultExport;
}

export default defaultExport;