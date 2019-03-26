import register from '../core/helper/register';
import React from 'react';
import { CC_DISPATCHER } from '../support/constant';
import ccContext from '../cc-context';
import util from '../support/util';

export default function (fragmentHook, CustomizedComponent) {
  class DefaultComponent extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.$$fragment = this.$$fragment.bind(this);
    }
    $$fragment(fragmentContext) {
      if (fragmentHook) fragmentHook(fragmentContext);
    }
    render() {
      return this.props.children || <span style={{display:'none'}}/>;
    }
  }


  if (ccContext.refs[CC_DISPATCHER]) {
    if(util.isHotReloadMode()){
      util.justTip(`hot reload mode, CC_DISPATCHER existed`);
    }else{
      throw new Error(`CcDispatcher can only be initialize one time`);
    }
  }

  let TargetComponent = CustomizedComponent || DefaultComponent;
  return register(CC_DISPATCHER, { isSingle: true, __checkStartUp: false, __calledBy: 'cc' })(TargetComponent);
}