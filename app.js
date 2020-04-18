const express = require('express');
const morgan = require('morgan');
const app = express();

app.use(morgan('dev'));

app.listen(8000, () => {
    console.log('Express server is listening on port 8000!');
});

app.get('/echo', (req, res) => {
    const responseText = `Here are some details of your request:
      Base URL: ${req.baseUrl}
      Host: ${req.hostname}
      Path: ${req.path}
      Protocol: ${req.protocol}
      Secure: ${req.secure}
    `;
    res.send(responseText);
});

app.get('/queryViewer', (req, res) => {
    console.log(req.query);
    res.end(); //do not send any data back to the client
});

app.get('/greetings', (req, res) => {
    //1. get values from the request
    const name = req.query.name;
    const race = req.query.race;

    //2. validate the values
    if (!name) {
        //3. name was not provided
        return res.status(400).send('Please provide a name');
    }

    if (!race) {
        //3. race was not provided
        return res.status(400).send('Please provide a race');
    }

    //4. and 5. both name and race are valid so do the processing.
    const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;

    //6. send the response 
    res.send(greeting);
});


//Drill #1 - Sum Route Handler 

app.get('/sum', (req, res) => {
    const a = req.query.a;
    const b = req.query.b;

    //shorter way of saying the same thing
    // const {a, b} = req.query;


    //Validation: a and b are required and must be numbers

    if(!a) {
        return res 
            .status(400)
            .send('a is required');
    }

    if(!b)  {
        return res  
            .status(400)
            .send('b is required');
    }


    //Convert input to number using JS parseFloat function
    const numA = parseFloat(a);
    const numB = parseFloat(b);

    if(Number.isNaN(numA)) {
        return res 
            .status(400)
            .send('a must be a number');
    }

    if(Number.isNaN(numB)) {
        return res  
            .status(400)
            .send('b must be a number');
    }

    //Validation passed so perform the task

    const c = numA + numB;

    //Format response string

    const responseString = `The sum of ${numA} and ${numB} is ${c}`;

    //Send response

    res 
        .status(200)
        .send(responseString);
});


//     res.send(`The sum of ${a} and ${b} is ${Number(a) + Number(b)}`)
// });


//Drill #2 - Cipher Handler 
app.get('/cipher', (req, res) => {
    const { text, shift } = req.query;
    console.log(text)

    //Validation: both values are required, shift must be a number

    if(!text) {
        return res
            .status(400)
            .send('text is required');
    }

    if(!shift) {
        return res  
            .status(400)
            .send('shift is required');
    }

    const numShift = parseFloat(shift);

    if(Number.isNaN(numShift)) {
        return res  
            .status(400)
            .send('shift must be a number');
    }

    //Once valid, perform task. Make text uppercase for convenience; ignore other characters and convert only letters.
    //Create loop over the characters and convert each letter using the shift

    const base = 'A'.charCodeAt(0);  //get char code

    const cipher = text
        .toUpperCase()
        .split('')   //create array of characters
        .map(char => {    //map each original character to a converted char
            const code = char.charCodeAt(0);   //get char code
            if(code < base || code > (base + 26))  {
                return char;
            }

            //otherwise convert and get distance from A
            let diff = code - base;
            diff += numShift;

            //if case shift takes value past Z, cycle to beginning
            diff = diff % 26;

            //convert back to a character
            const shiftedChar = String.fromCharCode(base + diff);
            return shiftedChar;
        })

        //construct a string from the array
        .join('');  

        //Return the response
        res
            .status(200)
            .send(cipher);
    });

//Lotto

app.get('/lotto', (req, res) => {
    const { numbers } = req.query;


    //validation: 1) numbers array exists; 2) must be array; 3) must be 6 numbers; 4) numbers between 1-20

    if(!Array.isArray(numbers)) {
        return res
        .status(400)
        .send("numbers must be an array");
    }

    const guesses = numbers 
        .map(n => parseInt(n))
        .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));

    if(guesses.length != 6) {
        return res
            .status(400)
            .send("numbers must contain 6 integers between 1 and 20");
    }

    //list of 20 numbers to choose from

    const stockNumbers = Array(20).fill(1).map((_, i) => i + 1);

    //choose random 6 numbers

    const winningNumbers = [];
    for(let i = 0; i < 6; i++) {
        const ran = Math.floor(Math.random() * stockNumbers.length);
        winningNumbers.push(stockNumbers[ran]);
        stockNumbers.splice(ran, 1); 
    }

    //compare guess to winning number
    let diff = winningNumbers.filter(n => !guesses.includes(n));

    //construct response
    let responseText; 

    switch(diff.length) {
        case 0:
            responseText = 'You are amazing!  You win!!';
            break;
        case 1: 
            responseText = 'Congrats. You win $1000!';
            break; 
        case 2:
            responseText = 'Congrats, you win a free coca-cola';
            break;
        default: 
            responseText = 'Sorry, you lose';
    }


    // uncomment below to see how the results ran

  // res.json({
  //   guesses,
  //   winningNumbers,
  //   diff,
  //   responseText
  // });

    res.send(responseText);
});

