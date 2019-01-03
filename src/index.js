import startup from './core/startup';
import register from './core/register';
import configure from './core/configure';
import invoke from './core/invoke';
import invokeSingle from './core/invoke-single';
import setGlobalState from './core/set-global-state';
import setState from './core/set-state';
import ccContext from './cc-context';

const defaultExport = {
  startup,
  register,
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
