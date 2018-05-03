
// the purpose of this the application is to save time applying various job websites 
//by using a headless browser puppeteer to scrape job application data and clearbit api to 
// search for potential candidates that work in job that I am applying

//next advancement is get the cover letteron on the apply now page and submit on angel list 
///should work for an angellist, hired, linkedin, buildnyc, stackoverflow,  vettery recipe 
let fs = require("fs");
const readline = require('readline');
let clearbit = require('clearbit')("sk_586292a4b3c1ed19cbb759781e905644");
const puppeteer = require('puppeteer');
let textCsv = fs.readFileSync("C:/gitHubRepo/scrapeRecipe/listOFUrl.csv", 'utf8').split("\r\n");

//take away the last line
textCsv.splice(textCsv.length - 1);
console.log(textCsv);


(async () => {
  //can either set the chromium browser to open or run without the chromium browser
  // const browser = await puppeteer.launch({headless: false}); // default is true
  const browser = await puppeteer.launch();
  //list of selectors for each websites
  let recipe = {
    "angel": {
      title: "body#layouts-base-body > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(2) > h1",
      skillToScrape: "body#layouts-base-body > div > div:nth-of-type(3) > div > div:nth-of-type(3) > div:nth-of-type(2)",
      nameToScrape: "body#layouts-base-body > div:nth-of-type(6) > div > div > div > div > div > div > div:nth-of-type(3) > div:nth-of-type(2) > div > div > div > div:nth-of-type(3) > div >  a:nth-of-type(2) > span ",
      companyToScrap: "",
    },
    "vettery": {
      title: "html > body > candidate > div > div > candidate-interviews > div > div > candidate-interviews-expiring > candidate-interview-panel > div:nth-of-type(4) > candidate-interview-panel-content-container > candidate-interview-panel-content > div > div > span",
      skillToScrape: "",
      nameToScrape: "html > body > candidate > div > div > candidate-interviews > div > div > candidate-interviews-expiring > candidate-interview-panel > div:nth-of-type(4) > candidate-interview-panel-content-container > candidate-interview-panel-content > vet-collapsible > div > p",
      companyToScrap: "",
    },
    "stackoverflow": {
      title: "div#job-detail > div > div > div:nth-of-type(2) > div > h1 > a",
      skillToScrape: "div#overview-items > section:nth-of-type(2) > div > p",
      nameToScrape: "",
      companyToScrap: "div#job-detail > div > div > div:nth-of-type(2) > div:nth-of-type(2) > div > a",
    },
    "builtinnyc": {
      title: "html > body > div > main > div > div > div > div > div > div > div > div > div > article > div > h1 > span",
      skillToScrape: "",
      nameToScrape: "",
      companyToScrap: "",
    },
    "linkedin": {
      title: "html > body > div:nth-of-type(6) > div:nth-of-type(3) > div:nth-of-type(3) div > div > div > div > div > div > div > div:nth-of-type(3) > h1 ",//div#ember990 > div > div:nth-of-type(3) > h1
      skillToScrape: "div#job-details > ul:nth-of-type(2)",
      nameToScrape: "html > body > div:nth-of-type(6) > div:nth-of-type(3) > div:nth-of-type(3) div > div > div > div >div:nth-of-type(2) > article >  div > div:nth-of-type(2) > div > div > p",
      companyToScrap: "",       //div#ember1890 > div > p
    },
    "hired": {
      title: "",
      skillToScrape: "div#company-profile > div:nth-of-type(3) > div > div > div:nth-of-type(2) > div >  div:nth-of-type(3) > div > ul", //div#company-profile > div:nth-of-type(2) > div > div > div:nth-of-type(2) > div > div:nth-of-type(4) > div
      nameToScrape: "",
      companyToScrap: "div#company-profile > div:nth-of-type(2) > div > div > div > div:nth-of-type(2) > a > h1",
    },
    "glassdoor": {
      title: "div#HeroHeaderModule > div:nth-of-type(3) > div > div:nth-of-type(2) > h2 ",
      skillToScrape: "",
      nameToScrape: "",
      companyToScrap: "div#HeroHeaderModule > div:nth-of-type(3) > div > div:nth-of-type(2) > span:nth-of-type(2)",
    }
  }

  //hired;s title has to have a title+ "empployee" because they dont list their title instead the list company's name
  //linkedin will not work for every page since the ember# are inconsistent across pages 
  //linkedin can show the title of the person to contact
  // open a new tab for each line that the textCsv has
  let firstTime = true;

  //go through each website and open the page from the txtcsv file
  // and authenticate if necessary

  for (let i = 0; i < textCsv.length; i += 1) {
    // const browser = await puppeteer.launch();
    const page = await browser.newPage();
    let data = textCsv[i].split(';');
    //filter out the ctt for glassdoor
    if (data[0].indexOf("&ctt=")) {
      // console.log("data[]", data[0]);
      data = data[0].split("&ctt=");
      data[0] = data[0] + "\"";
    }  
    data[0] = data[0].replace(/['"]+/g, '');

    //need to authenticate with angellist
    if (data[0].indexOf("angel") != -1 && firstTime) {
      firstTime = false;
      const newPage1 = await browser.newPage();
      await newPage1.goto("https://angel.co/login");
      let us = "#user_email"//await newPage1.$("#user_email").catch(err => console.log("user email err",err));  //newPage1.evaluate(function(x){return document.querySelector(x)}, "#user_email").catch(err => console.log("useremail err",err));
      let ps = "#user_password"//await newPage1.$("#user_password").catch(err => console.log("password err",err));  //newPage1.evaluate(function(x){return document.querySelector(x)},"#user_password").catch(err => console.log("password err",err));
      let logb = "#new_user > div:nth-of-type(2) > input"//
      //  console.log("us",us ,  "ps", ps, "logb", logb);
      let u = "javi182pro@gmail.com";
      let p = "marieo23";

      await newPage1.waitForSelector(us).catch(err => console.log("wait on us err", err));
      await newPage1.waitForSelector(ps).catch(err => console.log("wait on ps err", err));
      await newPage1.waitForSelector(logb).catch(err => console.log("wait on logb err", err));

      await newPage1.click(us).catch(err => console.log("wait on click us err", err));
      await newPage1.keyboard.type(u, { delay: 100 }).catch(err => console.log("wait on type u err", err));;
      await newPage1.click(ps).catch(err => console.log("wait on  ps click err", err));;
      await newPage1.keyboard.type(p, { delay: 100 }).catch(err => console.log("wait on type p err", err));;
      await newPage1.click(logb).catch(err => console.log("wait on click logb err", err));;
      await newPage1.waitForNavigation({ waitUntil: 'networkidle2' }).catch(err => console.log("error on wait for navigation", err))
      console.log("U", u, "P", p);

    }
    // if it is vettery need to then authenticate
    console.log("data", data[0]);
    // if(data[0].indexOf("linkedin")){  //if it is linked then authenticate
    //   const u = "";
    //   const p = "";
    //   //needs to find a way to authenticate
    //   // const headers = new Map();
    //   // headers.set(
    //   //   'Authorization', `Basic ${ new Buffer(`${u}:${p}`).toString('base64') }`
    //   // );
    //   // const page = await browser.newPage();
    //   // await page.setExtraHTTPHeaders(headers);
    //   // await page.goto("www.linkedin.com");
    //  }else

    //cancel for now
    await page.goto(data[0], { waitUntil: 'networkidle2' }).catch(err => console.log("err going to the intial page", err));

    // await browser.close();
  }
  let count = 0;
  let pages = await browser.pages();


  // create the variables for each cell in the row
  console.log(pages.length - 1);
  let contacts = [];
  let companies = [];
  let data = [];
  let currDate = Date();
  let url = ""
  let jobTitle = "";
  let companyName = "";
  let s = "";
  let skillsR = "";
  let contactPerson = "";
  let contactInfo = "";
  let contactTitle = "";
  let emailAddress = "";
  let socialFound = "";
  let whatIFindInteresting = "";
  let product1 = "";
  let product2 = "";
  let whereIApplied = "";
  let respondedDoubleUp = "n/a";
  let subjectTitle = "";
  let rejected = "n/a";
  let note = "applied";
  let reachContactPerson = "";
  let reachContactTitle = "";
  let reachEmailAddress = "";
  let reachSocialFound = "online";

  let p = "";

  //go through list of pages(applications) and  extract the company name, job application title, 
  // jobs skills, and employee to contact if possible 
  // console.log("pages", pages);
  for (let i = 1; i < pages.length; i += 1) {
    p = pages[i];

    //get url
    url = p.url();
    //make sure you dont process these web pages
    if (url === "https://angel.co/login" || url === "https://angel.co/") break;
    console.log("url", url);
    //get the web host name
    let aryUrlName;
    if (url.indexOf("angel") !== -1) aryUrlName = "angel";      // if( url.indexOf( "vettery" ) !== -1 ) aryUrlName = "vettery";
    else if (url.indexOf("stackoverflow") !== -1) aryUrlName = "stackoverflow";
    else if (url.indexOf("builtinnyc") !== -1) aryUrlName = "builtinnyc";// else if(url.indexOf("linkedin") !== -1) aryUrlName = "linkedin";
    else if (url.indexOf("hired") !== -1) aryUrlName = "hired";
    else if (url.indexOf("glassdoor") !== -1) aryUrlName = "glassdoor";
    else if (url.indexOf("vettery") >= 0 || url.indexOf("linkedin") >= 0) {
      // since we have not authenticated with vettery and linkedin we need to create an empty 
      // job application row in the csv file
      whereIApplied = getNameFromUrl(url);
      // subjectTitle  place the jobTitle and the string " position" together-> soap it
      subjectTitle = "  position";
      console.log("textCsv[i] not found", textCsv[i])
      let d = textCsv[i - 1].split(",").join(";");
      putTogetherData(
        {
          currDate: Date(),
          url: d,
          jobTitle: "",
          companyName: "",
          s: "",
          skillsR: "",
          contactPerson: "",
          contactInfo: "",
          contactTitle: "",
          emailAddress: "",
          socialFound: "",
          whatIFindInteresting: "",
          product1: "",
          product2: "",
          whereIApplied: "",
          respondedDoubleUp: respondedDoubleUp,
          subjectTitle: "",
          rejected: rejected,
          note: note,
          reachContactPerson: "",
          reachContactTitle: "",
          reachEmailAddress: "",
          reachSocialFound: reachSocialFound,
        }, data
      )
      continue;
    }


    // console.log("host:",aryUrlName[1], " title", recipe[ aryUrlName[1] ].title  );
    console.log("host:", aryUrlName);
    let title = { t: recipe[aryUrlName].title, s: recipe[aryUrlName].skillToScrape, n: recipe[aryUrlName].nameToScrape, c: recipe[aryUrlName].companyToScrap, site: aryUrlName };
    //click on the apply now to gather the contact name information
    if (title.site == "angel") {
      let buttonDom = await p.evaluate(async () => {
        console.log("found angel");
        let applyNowClick = " html > body > div > div > div > div > div > div:nth-of-type(3) > div > div > div:nth-of-type(3) > a  ";//body#layouts-base-body > div > div > div > div > div > div > a > img
        return applyNowClick;
      });
      console.log("buttonDom", buttonDom);
      //click the apply now button to get the name to show and to query
      await p.waitForSelector(buttonDom).catch(err => console.log("error clickling apply now", err));
      await p.click(" html > body > div > div > div > div > div > div:nth-of-type(3) > div > div > div:nth-of-type(3) > a  ").catch(err => console.log("error clickling apply now", err));
     
    }
    // console.log( ">> title:", title );          
    let ti = title.t;
    let sk = title.s;
    let na = title.n;
    let co = title.c;
    // evaluate then return the doem element to the "t" object
    if (ti != "") await p.waitForSelector(ti).catch(err => console.log("error for title", err));
    if (sk != "") await p.waitForSelector(sk).catch(err => console.log("error for skill", err));
    if (na != "") await p.waitForSelector(na).catch(err => console.log("error for name", err));
    if (co != "") await p.waitForSelector(co).catch(err => console.log("error for name", err));

    //use a variable to hold the dom selectors available 
    let t = {
      t: title.t == "" ? "" : ti,  
      s: title.s == "" ? "" : sk,  
      n: title.n == "" ? "" : na, 
      c: title.c == "" ? "" : co,
      site: title.site
    }

    let foundTitle = "";
    let foundSkill = "";
    let foundName = "";
    let foundCompany = "";

    //each web host is processed differently according to the web host's selectors available 
    if (t.site === "angel") {
      console.log("t", t);
      foundTitle = await p.evaluate((ti) => { let str = document.querySelector(ti).textContent; console.log("ti", ti, "str", str); return str; }, t.t);
      foundSkill = await p.evaluate((sk) => { let str = document.querySelector(sk).textContent; console.log("sk", sk, "str", str); str.replace("\n", " "); return str; }, t.s);
      foundName = await p.evaluate((na) => { let str = document.querySelector(na).textContent; console.log("na", na, "str", str); return str; }, t.n);
      let spltTitleCompany = foundTitle.split("at"); //make changes according to receipe
      foundTitle = spltTitleCompany[0];
      foundCompany = spltTitleCompany[1];
    }
    else if (t.site === "vettery") {
      foundTitle = await p.evaluate((ti) => document.querySelector(ti).textContent, t.t);
      foundSkill = t.s;
      //click the button to get the name
      await p.click("body#layouts-base-body > div > div:nth-of-type(2) > div:nth-of-type(2) > div > div:nth-of-type(2) > div:nth-of-type(3) > div > div > div:nth-of-type(3) > a");
      foundName = await p.evaluate((na) => document.querySelector(na).textContent, t.n);
      foundCompany = t.c;
    }
    else if (t.site === "stackoverflow") {
      console.log("stackoverflow t", t);
      foundTitle = await p.evaluate((ti) => document.querySelector(ti).textContent, t.t);
      foundSkill = await p.evaluate((sk) => {
        let str = "";
        let g = document.querySelector(sk).childNodes;
        for (let i = 1; i < g.length - 1; i += 1) {
          if (g[i].nodeType == 1) {
            str += g[i].innerHTML.replace(/^\s+|\s+$/g, '') + " ";
            
          }
        }
        return str;
      }, t.s);
      foundName = t.n;
      foundCompany = await p.evaluate((co) => document.querySelector(co).textContent, t.c);
    }
    else if (t.site === "builtinnyc") {
      foundTitle = await p.evaluate((ti) => document.querySelector(ti).textContent, t.t);
      foundSkill = t.s;
      foundName = t.n;
      foundCompany = t.c;
      let spltTitleCompany = foundTitle.split(", "); //make changes according to receipe
      foundTitle = spltTitleCompany[0];
      foundCompany = spltTitleCompany[1];
    }
    else if (t.site === "linkedin") {
      console.log("t", t);
    }
    else if (t.site === "hired") {
      foundTitle = t.t;
      foundSkill = await p.evaluate((sk) => {
        let str = "";
        let g = document.querySelector(sk).childNodes;
        for (let i = 1; i < g.length - 1; i += 1) {
          if (g[i].nodeType == 1) {                    
            str += g[i].childNodes[1].innerHTML.replace(/^\s+|\s+$/g, '') + " ";
          }
        }
        return str;
      }, t.s);
      foundName = t.n;
      foundCompany = await p.evaluate((co) => document.querySelector(co).textContent, t.c);
    }
    else if (t.site === "glassdoor") {
      console.log("glassdoor t", t);
      foundTitle = await p.evaluate((ti) => document.querySelector(ti).textContent, t.t);
      foundSkill = t.s;
      foundName = t.n;
      foundCompany = await p.evaluate((co) => document.querySelector(co).textContent, t.c);
    }

    //test purposes
    // titleSkillName = {t:"Software Engineer - Front End at Iterable", s: "$100K–$140K0.04%–0.05%'", n:"Allison Cougan", site : "https://angel.co/iterable/jobs/12261-software-engineer-front-end" };
    let titleSkillName = { t: foundTitle, s: foundSkill, n: foundName, c: foundCompany, site: t.site };
    console.log("scrapedItems", titleSkillName);//scrapedItems
    
    //make sure no text have any commas in their text. if so this will produce a wrong round application csv file
    jobTitle = titleSkillName.t.replace(",", " ").replace(";", " ") || "n/a";; //make changes according to receipe
    companyName = titleSkillName.c.replace(",", " ").replace(";", " ") || "n/a";
    skillsR = titleSkillName.s.replace(",", " ").replace(";", " ") || "n/a";
    // the skill could be scraped and be empty, in that case return n/a
    if (titleSkillName.n == "") contactPerson = "n/a";
    else contactPerson = titleSkillName.n;
    console.log(">>>>  jobTitle", jobTitle, "companyName", companyName, "skillsR", skillsR);

    let domainFound = await clearbit.NameToDomain.find({ name: companyName, stream: true }) //beginging of comment
      .then(async function (response) {
        // console.log("nameToDomain:", response.domain);
        console.log('Name: ', response.name);

        let contcts = await clearbit.Prospector.search({ domain: response.domain, limit: 1 })
          .then(function (response) {
            console.log("contcts response", response)
            sendContacts(response, contacts);
          })
          .catch(function (err) {
            console.log("contacts err", err)
            sendContacts([{ company: { name: "noCompanyFound" }, name: { givenName: "noNameFound" }, title: "noTitleFound", email: "NoEmailFound" }], contacts)
          });

        if (contactPerson != "") {
          let emailTitle = await clearbit.Prospector.search({ domain: response.domain, name: contactPerson })// , name:contactPerson  ({domain: response.domain , name:contactPerson}
            .then(function (response) {
              // console.log("response from prospector:", response);
              //clear bit cannot received and empty string so we need to create an array with dummy data
              if (response.length < 1) { response = [{ name: { fullName: "no name found" }, title: "no title found", email: "no email found" }]; }
              // console.log('email response: ',  response[0].email, " title response" , response[0].title );
              whereIApplied = getNameFromUrl(url);
              // subjectTitle  place the jobTitle and the string " position" together-> soap it
              subjectTitle = jobTitle + " position";
              console.log("textCsv[i]", textCsv)
              //if the web link contains any commas then replace them with : since we cannot have commas in the text
              let d = textCsv[i - 1].split(",").join(";");
              putTogetherData(
                {
                  currDate: Date(),
                  url: d,
                  jobTitle: jobTitle,
                  companyName: companyName,
                  s: s,
                  skillsR: skillsR,
                  contactPerson: response[0].name.fullName,
                  contactInfo: contactInfo,
                  contactTitle: response[0].title,
                  emailAddress: response[0].email,
                  socialFound: socialFound,
                  whatIFindInteresting: whatIFindInteresting,
                  product1: product1,
                  product2: product2,
                  whereIApplied: whereIApplied,
                  respondedDoubleUp: respondedDoubleUp,
                  subjectTitle: subjectTitle,
                  rejected: rejected,
                  note: note,
                  reachContactPerson: reachContactPerson,
                  reachContactTitle: reachContactTitle,
                  reachEmailAddress: reachEmailAddress,
                  reachSocialFound: reachSocialFound,
                }, data
              )
              //return { e:response[0].email , t: response[0].title };
            })
            .catch(clearbit.Enrichment.QueuedError, function (err) {//done
              // Lookup is queued
              console.log("there was an error geting the company and the person", err);
            })
        } else {
          console.log('contactName is ""', err);
          whereIApplied = getNameFromUrl(url);
          // subjectTitle  place the jobTitle and the string " position" together-> soap it
          subjectTitle = jobTitle + " position";
          console.log("textCsv[i]", textCsv);
          let d = textCsv[i - 1].split(",").join(";");
          putTogetherData(
            {
              currDate: Date(),
              url: d,
              jobTitle: jobTitle,
              companyName: companyName,
              s: s,
              skillsR: skillsR,
              contactPerson: contactPerson,
              contactInfo: contactInfo,
              contactTitle: contactTitle,
              emailAddress: emailAddress,
              socialFound: socialFound,
              whatIFindInteresting: whatIFindInteresting,
              product1: product1,
              product2: product2,
              whereIApplied: whereIApplied,
              respondedDoubleUp: respondedDoubleUp,
              subjectTitle: subjectTitle,
              rejected: rejected,
              note: note,
              reachContactPerson: reachContactPerson,
              reachContactTitle: reachContactTitle,
              reachEmailAddress: reachEmailAddress,
              reachSocialFound: reachSocialFound,
            }, data
          )
        }

      })
      .catch(function (err) {//done
        console.error("there was an error geting the person email", err);
        whereIApplied = getNameFromUrl(url);
        // subjectTitle  place the jobTitle and the string " position" together-> soap it
        subjectTitle = jobTitle + " position";
        console.log("textCsv[i]", textCsv)
        let d = textCsv[i - 1].split(",").join(";");
        putTogetherData(
          {
            currDate: Date(),
            url: d,
            jobTitle: jobTitle,
            companyName: companyName,
            s: s,
            skillsR: skillsR,
            contactPerson: contactPerson,
            contactInfo: contactInfo,
            contactTitle: contactTitle,
            emailAddress: emailAddress,
            socialFound: socialFound,
            whatIFindInteresting: whatIFindInteresting,
            product1: product1,
            product2: product2,
            whereIApplied: whereIApplied,
            respondedDoubleUp: respondedDoubleUp,
            subjectTitle: subjectTitle,
            rejected: rejected,
            note: note,
            reachContactPerson: reachContactPerson,
            reachContactTitle: reachContactTitle,
            reachEmailAddress: reachEmailAddress,
            reachSocialFound: reachSocialFound,
          }, data
        )

      });
    // await browser.close();

  } //end of for loop
  //after looping through all the pages
  //create the round 4 csv document 
  //create the companyNames csv document  with all of the companies names using the link to google
  let att = "date,	link, title,	company,	skills,	requirements,	contactPerson,	contactInfo,	contactsTitle,	email,	socialMediaFound,	workTogetherTO-interestingThingOFCompanythatContinuesToBeAtTheForFrontOfTheirSpace,	fromThe-Product1,	toThe-Product2,	whereIApplied,	respondedDoubleUP,	subjectTitle,	rejected,	note , reachContactPerson, reachContactTitle, reachEmailAddress ,reachSocialFound,    \n";

  createcsvDocument(data, att, 'roundOfApplicationData.csv');
  let atr = "companyName, name, contactTitle, contactEmail \n"
  createcsvDocument(contacts, atr, 'listOfPotentialContacts.csv');  //last part of comment
})();

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
  // let hiddenElement = document.createElement('a');
  // hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  // hiddenElement.target = '_blank';
  // hiddenElement.download = 'people.csv';
  // hiddenElement.click();
}

function sendContacts(contactsObj, contacts) {
  contactsObj.forEach(function (person) {
    console.log("people", person.name.fullName, person.title);
    if (person.name.fullName == null) person.name.fullName = "";
    if (person.title == null) person.title = "";
    contacts.push({ company: person.company.name, name: person.name.givenName, title: person.title.replace(",", "."), email: person.email })

  });
}
//print each row in the data
function dataRows(dataRows) {
  console.log("dataRows", dataRows)
}
//place each job application inormation in one array
function putTogetherData(objData, data) {
  console.log("___putTogetherData", objData);
  data.push(objData);
  dataRows(data);
}
// short hand console function
function c(s) {
  console.log(s);
}
//extract the web host
function getNameFromUrl(s) {
  let str = s.slice(8);
  let strA = str.split(".");
  let item = strA[0];
  return item == "www" ? strA[1] : "Angellist";
}

// fs.close();

// puppeteer code that works as way to check how the functions work
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