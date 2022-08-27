const xss = require('xss');
const whiteList = xss.getDefaultWhiteList();
whiteList.span.push(
  'style',
  'uid'
);
whiteList.div.push(
  "class",
  "data-w-e-type",
  "data-w-e-is-void",
  "data-title",
  "data-link",
  "data-iconimgsrc"
)


export {
  whiteList
}