const xss = require('xss');
const whiteList = xss.getDefaultWhiteList();
whiteList.span.push('style', 'uid');


export {
  whiteList
}