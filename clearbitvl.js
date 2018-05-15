//clearbit vettery linked application's purpose is to get the list of potential candidates to contact
// based from the vettery and linked links
//next advancement is to place the cover letter on the apply now page and submit on angel list 
let fs = require("fs");
const readline = require('readline');
let clearbit = require('clearbit')("");
const puppeteer = require('puppeteer');
let textCsv = fs.readFileSync("C:/gitHubRepo/scrapeRecipe/roundOfApplicationData.csv", 'utf8').split("\r\n");
console.log(textCsv.length);

// clear bit woks asynchronously . decided to run this function as a "async" and await
(async () => {
  ///should work for an angellist, hired, linkedin, buildnyc, stackoverflow,  vettery recipe 
  //keep a list of contacts
  let contacts = [];
  //go through every link in the file and only search for 
  // companies that have links to vettery and linked in
  for (let index = 1; index < textCsv.length - 1; index++) {
    let el = textCsv[index].split(",");
    let subel = el[3]
    let l = el[1];
    // console.log("l",l);
    // console.log("subel", subel);
    //filter out the links that we need
    if (l.indexOf("vettery") >= 0 || l.indexOf("linkedin") >= 0) {
      console.log("passed test", subel);
      //use the clearbit api to extract potential contacts based on the comapany names
      let domainFound = await clearbit.NameToDomain.find({ name: subel, stream: true }) //beginging of comment
        .then(async function (response) {
          console.log("nameToDomain:", response.domain);
          // console.log('Name: ', response.name);

          let contcts = await clearbit.Prospector.search({ domain: response.domain, limit: 1 })
            .then(function (response) {
              console.log("contcts response", response)
              sendContacts(response, contacts);
            })
            .catch(function (err) {
              console.log("contacts err", err)
              //person.company.name+","+person.name.givenName +","+ person.title+","+person.email
              sendContacts([{ company: { name: "noCompanyFound" }, name: { givenName: "noNameFound" }, title: "noTitleFound", email: "NoEmailFound" }], contacts)
            });
        }).catch(function (err) {

        })//done
    } else {
      // console.log("did not pass the test",subel);
    }
  }
  let att = "company,	name,	title,	email \n";
  createcsvDocument(contacts, att, 'listOfPotentialVetteryLinkedinCandidates.csv');
})();

// upated the contacts array
function sendContacts(contactsObj, contacts) {
  contactsObj.forEach(function (person) {
    console.log("people", person.name.fullName, person.title);
    if (person.name.fullName == null) person.name.fullName = "";
    if (person.title == null) person.title = "";
    contacts.push({ company: person.company.name, name: person.name.givenName, title: person.title.replace(",", "."), email: person.email })

  });
}
// create the csv file in the same root folder
function createcsvDocument(data, attrs, fileName) {
  let csv = attrs;
  data.forEach(function (row) {
    for (const key in row) {
      csv += row[key] + ",";
    }
    csv += "\n";
  });
  console.log("csvFile", csv);
  fs.writeFile(fileName, csv, function (err) {
    if (err) {
      console.log("error occured, file not saved or corrupted");
    } else {
      console.log("savedFile with no problems");
    }
  });
}

function soapText(str){
  str = str.trim();
  str = str.replace(","," ");
  return str.replace(/(\r\n\t|\n|\r\t)/gm, ''); 
}
