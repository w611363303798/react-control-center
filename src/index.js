import startup from './core/startup';
import register from './core/register';
import registerToDefault from './core/register-to-default';
import registerSingleClassToDefault from './core/register-single-class-to-default';
import configure from './core/configure';
import invoke from './core/invoke';
import invokeSingle from './core/invoke-single';
import setGlobalState from './core/set-global-state';
import setState from './core/set-state';
import ccContext from './cc-context';

const defaultExport = {
  startup,
  register,
  registerToDefault,
  registerSingleClassToDefault,
  configure,
  invoke,
  invokeSingle,
  setGlobalState,
  setState,
  ccContext,
}

if (window) {
  window.cc = defaultExport;
}

export default defaultExport;
