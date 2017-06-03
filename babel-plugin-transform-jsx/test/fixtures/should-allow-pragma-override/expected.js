/* @jsx override */

import override from './pragma-override';

var object = override({
  elementName: 'div',
  attributes: {},
  children: [override({
    elementName: 'strong',
    attributes: {},
    children: ['Hello,']
  }), ' world!']
});
