import register from '../core/helper/register';
import React from 'react';
import { CC_DISPATCHER } from '../support/constant';

export default register(CC_DISPATCHER, { isSingle:true, checkStartUp: false })(
  class extends React.Component {
    constructor(props, context){
      super(props, context);
    }
    render() {
      return this.props.children || '';
    }
  }
);
