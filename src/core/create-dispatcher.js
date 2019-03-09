import register from '../core/helper/register';
import React from 'react';
import { CC_DISPATCHER } from '../support/constant';
import ccContext from '../cc-context';

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
      return this.props.children || '';
    }
  }

  if (ccContext.refs[CC_DISPATCHER]) {
    throw new Error(`CcDispatcher can only be initialize one time`);
  }

  let TargetComponent = CustomizedComponent || DefaultComponent;
  return register(CC_DISPATCHER, { isSingle: true, __checkStartUp: false, __calledBy:'cc' })(TargetComponent);
}