const { writeFile, readFile } = require("fs");
const varA = 5;
const varB = 4;

const varC = varA + varB;
// console.log(`Value of varC is ${varC}`);

writeFile("./output.txt", `Value of varC is ${varC}\n`, (err, result) => {
    // console.log("at point 1");
    if (err) {
      console.log("This error happened: ", err);
    } else {
      // here you write your next line
    }
});

readFile('./input.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("the input file data is:", data);
    const [numberA, numberB] = data.split(" ");
    console.log(numberA, numberB)
    const numberC = numberA - numberB;
    console.log("the difference between both number is ", numberC);
});