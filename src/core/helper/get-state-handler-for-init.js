import ccContext from '../../cc-context';
import util from '../../support/util';
import setState from './set-state';

export default function (module) {
  return state => {
    try {
      setState(module, state, true);
    } catch (err) {
      ccContext.store.setState(module, state);//store this state;
      util.justTip(`no ccInstance found for module ${module} currently, cc will just store it, lately ccInstance will pick this state to render`);
    }
  }
}
