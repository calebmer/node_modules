export default function (str) {
  return [
      <a href="javascript:go()" valueless>Text</a>,
      <a href={"javascript:go()"}>{"Text"}</a>,
      <a href={str} {...({ spreaded: "" })}>{str}</a>,
      <a href={`${str}`}>Back ticks with an interpolation</a>
  ];
}
