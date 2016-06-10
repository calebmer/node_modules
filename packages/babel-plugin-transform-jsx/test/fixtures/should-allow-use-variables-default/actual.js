var UppercaseVariable = true;
var lowercaseVariable = true;

// Include attribute named after the variables to ensure variables are only recognized for elements
var jsxA = <UppercaseVariable UppercaseVariable=""/>;
var jsxB = <UppercaseVariable UppercaseVariable=""></UppercaseVariable>;
var jsxC = <UppercaseVariable UppercaseVariable="">{UppercaseVariable}</UppercaseVariable>;
var jsxD = <lowercaseVariable lowercaseVariable=""/>;
var jsxE = <lowercaseVariable lowercaseVariable=""></lowercaseVariable>;
var jsxF = <lowercaseVariable lowercaseVariable="">{lowercaseVariable}</lowercaseVariable>;
