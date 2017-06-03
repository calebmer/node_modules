/* @jsx Override true */

import Override from './pragma-override';

var object = new Override({
  elementName: 'div',
  attributes: {},
  children: [new Override({
    elementName: 'strong',
    attributes: {},
    children: ['Hello,']
  }), ' world!']
});
