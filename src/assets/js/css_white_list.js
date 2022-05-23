const xss = require('xss');
const whiteList = xss.getDefaultWhiteList();
whiteList.span.push('style');


export {
  whiteList
}