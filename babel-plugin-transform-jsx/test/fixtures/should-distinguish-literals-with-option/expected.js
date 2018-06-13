export default function (str) {
    return [{
        elementName: "a",
        attributes: {
            href: new LiteralNode("javascript:go()", "a href"),
            valueless: new LiteralNode("valueless", "a valueless")
        },
        children: [new LiteralNode("Text", "#text")]
    }, {
        elementName: "a",
        attributes: {
            href: "javascript:go()"
        },
        children: [new LiteralNode("Text", "#text")]
    }, {
        elementName: "a",
        attributes: babelHelpers.extends({
            href: str
        }, { spreaded: "" }),
        children: [str]
    }, {
        elementName: "a",
        attributes: {
            href: `${str}`
        },
        children: [new LiteralNode("Back ticks with an interpolation", "#text")]
    }];
}
