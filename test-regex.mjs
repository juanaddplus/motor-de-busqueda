const address = "Carrera 17 a # 175-82";
const normAddress = address.toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .trim();

const clMatch = normAddress.match(/(?:calle|cll|cl|cl\s*e|cale)\s*([a-z])?\s*(\d+)/i) || normAddress.match(/(?:calle|cll|cl|cl\s*e|cale)\s*(\d+)/i);
const crMatch = normAddress.match(/(?:carrera|cra|cr|kr|krra|carera)\s*([a-z])?\s*(\d+)/i) || normAddress.match(/(?:carrera|cra|cr|kr|krra|carera)\s*(\d+)/i);

console.log("clMatch", clMatch);
console.log("crMatch", crMatch);

let clNum = null;
let crNum = null;

if (clMatch) clNum = parseInt(clMatch[clMatch.length - 1], 10);
if (crMatch) crNum = parseInt(crMatch[crMatch.length - 1], 10);

console.log("clNum", clNum);
console.log("crNum", crNum);

if (!clNum && !crNum) {
  const rawMatch = normAddress.match(/(\d+)[a-z\s]*(?:#|no|num|numero)\s*(\d+)/i);
  if (rawMatch) {
    clNum = parseInt(rawMatch[1], 10);
    crNum = parseInt(rawMatch[2], 10);
  }
} else if (clNum && !crNum) {
  const crossMatch = normAddress.match(/(?:#|no|num|numero)\s*(\d+)/i);
  if (crossMatch) crNum = parseInt(crossMatch[1], 10);
} else if (!clNum && crNum) {
  const crossMatch = normAddress.match(/(?:#|no|num|numero)\s*(\d+)/i);
  if (crossMatch) clNum = parseInt(crossMatch[1], 10);
}

console.log("final clNum", clNum);
console.log("final crNum", crNum);
