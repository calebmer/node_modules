var object = {
  a: 1,
  b: {
    c: 2
  }
};

var jsxA = {
  elementName: object.a,
  attributes: {},
  children: null
};
var jsxB = {
  elementName: object.b.c,
  attributes: {},
  children: null
};
var jsxC = {
  elementName: object.a,
  attributes: {},
  children: []
};
var jsxD = {
  elementName: object.b.c,
  attributes: {},
  children: []
};
var jsxE = {
  elementName: object.a,
  attributes: {},
  children: [object.a]
};
var jsxF = {
  elementName: object.b.c,
  attributes: {},
  children: [object.b.c]
};
