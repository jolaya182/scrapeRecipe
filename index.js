let fs = require("fs");
const readline = require('readline');
let clearbit = require('clearbit')("sk_f57934b45e4df7041c759337f52409f3");
const puppeteer = require('puppeteer');

let textCsv = fs.readFileSync("C:/scrape/testScrape.csv", 'utf8').split("\r\n");
///should work for an angellist, hired, linkedin, buildnyc, stackoverflow, workable,  vettery recipe 

//take away the last line
textCsv.splice(textCsv.length-1);
console.log(textCsv);

(async () => {
const browser = await puppeteer.launch({headless: false}); // default is true
  for(let i = 0; i < textCsv.length; i += 1){
    // const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(textCsv[i]);
    // console.log( "page url", page.url());

    // await browser.close();
  }
  let pages = await browser.pages();
  let count = 0;
  while(count < textCsv.length){
    pages = await browser.pages();
    count = pages.length;
  }
  console.log(pages.length);
  let data = [];
  let s = "";
  let currDate = "2/27/2018"
  let url = ""
  let jobTitle = "";
  let companyName = "";
  let skillsR = "";
  let req = "";
  let contactPerson = "";
  let contactTitle = "";
  let emailAddress = "";
  let socialFound = "";
  let whatIFindInteresting = "";
  let product1 = "";
  let product2 = "";
  let responded = "";
  let subjectTitle = "";
  let rejected = "";
  let note = "";
  for(let i = 0; i < pages.length; i += 1){

    s = 
    //reset s = ""
  }
  
})();

const rl = readline.createInterface({
  input : fs.createReadStream("C:/scrape/testScrape.csv"),
  // output: process.stdout 

});

let jobApplicationList = [];
rl.on('line',(line)=>{
  // console.log(`received:${line}`);
  jobApplicationList.push(line);

  // (async () => {
  //   const browser = await puppeteer.launch({headless: false}); // default is true
  //   // const browser = await puppeteer.launch();
  //   const page = await browser.newPage();
  //   await page.goto(line);
  
  //   // await browser.close();
  // })();

  // puppeteer.launch().then(async browser => {
  //   const page = await browser.newPage();
  //   await page.goto('https://example.com');
  //   await page.screenshot({path: 'screenshot.png'});
  //   await browser.close();
  // });
  
});

console.log(jobApplicationList);

// fs.close();


// (async () => {
//   const browser = await puppeteer.launch({headless: false}); // default is true
//   // const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto(line);
  
//   // Get the "viewport" of the page, as reported by the page.
//   const dimensions = await page.evaluate(() => {
//     return {
//       width: document.documentElement.clientWidth,
//       height: document.documentElement.clientHeight,
//       deviceScaleFactor: window.devicePixelRatio
//     };
//   });

//   console.log('Dimensions:', dimensions);

//   await browser.close();
// })();



// (async () => {
//   const browser = await puppeteer.launch({headless: false}); // default is true
//     // const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('https://example.com');
//     await page.screenshot({path: 'example.png'});
  
//     await browser.close();
//   })();
  
  
//   (async () => {
//     const browser = await puppeteer.launch({headless: false}); // default is true
//   // const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('https://news.ycombinator.com', {waitUntil: 'networkidle2'});
//   await page.pdf({path: 'hn.pdf', format: 'A4'});

//   await browser.close();
// })();




//what I need 

// clearbit.Prospector.search({domain: 'www.kean.edu' ,name:"katrina boseman"})
//   .then(function (response) {
//     var person  = response.person;
//     var company = response.company;

//     console.log('response: ',  response[0].email);
//     // console.log('Name: ',  person, " company: ", company);
//   })
//   .catch(clearbit.Enrichment.QueuedError, function (err) {
//     // Lookup is queued
//     console.log(err);
//   })
//   .catch(function (err) {
//     console.error(err);
//   });

// var Company = clearbit.Company;

// Company.find({domain: 'www.kean.edu', name:"katrina", last })
//   .then(function (company) {
//     console.log("response:",company);
//     // console.log('Name: ', company.name);
//   })
//   .catch(Company.QueuedError, function (err) {
//     // Company lookup queued - try again later
//   })
//   .catch(Company.NotFoundError, function (err) {
//     // Company could not be found
//     console.log(err);
//   })
//   .catch(function (err) {
//     console.error(err);
//   });

// clearbit.NameToDomain.find({ name:"kean university", stream: true})
//   .then(function (response) {
//     var person  = response.person;
//     var company = response.company;

//     console.log('Name: ', response);
//     // console.log('Name: ', person && person.name.fullName);

//   })
//   .catch(function (err) {
//     console.error(err);
//   });
// clearbit.Discovery