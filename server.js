const express = require('express')
const bodyParser = require('body-parser')
const fs = require("fs")
const path = require("path")
const puppeteer  = require("puppeteer")
const { fileURLToPath } = require('url')


const app = express()

app.use(express.json())

app.use("/public" ,express.static(path.join (__dirname,"public")))


// app.get("/test", (req, res) => {
//     res.send("test is working")
// })

app.post("/generate-pdf", async(req, res) => {
    const data = req.body;
    const templatePath =path.join(__dirname,
        "templates","certificate.html")
    let html = fs.readFileSync(templatePath,"utf-8")
    html= html.replace("{{name}}",data.name || "Your Name")
    .replace("{{dob}}",data.dob || "DD-MM-YYYY")
     .replace("{{gender}}",data.gender || "Gender")
      .replace("{{bloodGroup}}",data.bloodgroup || "Blood Group")
      .replace("{{dateTime}}",data.dateTime || new Date().toLocaleString());
       
      const  browser = await puppeteer.launch({
        headers :"new"});
        const page   = await browser.newPage();
        await page.setContent(html,{waitUntil: "networkidle0"})

        const pdfpath = path.join(__dirname,"pdf",`certificate_${Date.now()}.pdf`);
        await page.pdf({path :   pdfpath,format : "A4"});
        
        await browser.close();
        res.json({ success : true , file :pdfpath})
})






app.listen(4000, () => {
    console.log("server is created")
})