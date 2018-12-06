import startup from './core/startup';
import register from './core/register';
import invoke from './core/invoke';
import setGlobalState from './core/setGlobalState';
import cc from './cc-context';

cc.startup = startup;
cc.register = register;
cc.invoke = invoke;
cc.setGlobalState = setGlobalState;

export default cc;