var ZVariable = true;
var NotZVariable = true;

// Include attribute named after the variables to ensure variables are only recognized for elements
var jsxA = <ZVariable ZVariable=""/>;
var jsxB = <ZVariable ZVariable=""></ZVariable>;
var jsxC = <ZVariable ZVariable="">{ZVariable}</ZVariable>;
var jsxD = <NotZVariable NotZVariable=""/>;
var jsxE = <NotZVariable NotZVariable=""></NotZVariable>;
var jsxF = <NotZVariable NotZVariable="">{NotZVariable}</NotZVariable>;
