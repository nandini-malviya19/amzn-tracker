const express = require("express");
const configureBrowser = require("./utils/configBrowser");
// const bodyParser=require("body-parser");
const app = express();
const path = require('path');
const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const sendEmail = require("./utils/sendEmail")
require('dotenv').config();
const Item = require("./models/tableModel.js")
const User = require("./models/userModel.js")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware")
const cors = require("cors")
const morgan=require("morgan")

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(morgan("dev"));
app.use(express.urlencoded({ limit: '25mb', extended: true }));


const mongoose = require("mongoose");
// mongoose.set('strictQuery', false);


const connectDB = async () => {
  console.log("here");
  try {
    await mongoose.connect(process.env.MONGODB_URL, {

    });
    console.log("Connected successfully to the database");
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
};




// WORKING
app.get("/", authMiddleware, async function (req, res) {


  // const kaamKiList = await Item.find()
  // .then(console.log(kaamKiList))
  //     .catch(err => {
  //         console.log(err);
  //     });

  const email = req.query.email;

  console.log(email, "email ka message")
  const list = await Item.find({});
  console.log(list);


  const linkArr = [];
  const priceArr = [];
  const currpriceArr = [];
  const aliasArr = [];

  for (let i = 0; i < list.length; i++) {
    linkArr.push(list[i].name);
    priceArr.push(list[i].pricing);
    aliasArr.push(list[i].alias);
    const html = await configureBrowser(list[i].name);
    const $ = cheerio.load(html);
    const element = $('.a-price-whole', 'span').eq(0);
    let price = element.text();

    let val = "";
    for (let i = 0; i < price.length; i++) {
      if (price[i] !== "," && price[i] !== ".") {
        val = val + price[i];
      }
    }
    price = parseInt(val);
    console.log(price);
    currpriceArr.push(price);

    // if (price <= priceArr[i] || price === null|| price==NaN) {
      sendEmail(
        `<h1>Buy the product using the link below</h1>${linkArr[i]}`, email
      )
    // }
  }

  // res.render("list", { newlistitem: linkArr, newpriceitem: priceArr, currPrice: currpriceArr, aliasName: aliasArr });
  // return res.status(200).json({ message: ' successfully', linkArr, priceArr, aliasArr });
  return res.status(200).json({ message: ' successfully', list, currpriceArr });


});

// app.get("/", authMiddleware, async function (req, res) {
//   try {
//     const email = req.query.email;
//     console.log(email, "email ka message")

//     // Fetch all items
//     const list = await Item.find({});

//     // Process items concurrently
//     const promises = list.map(async (item) => {
//       const html = await configureBrowser(item.name);
//       const $ = cheerio.load(html);
//       const element = $('.a-price-whole', 'span').eq(0);
//       let price = element.text().replace(/[^0-9.]/g, ''); // Extract digits and decimals
//       price = parseInt(price);

//       // Send email if condition met
//       if (price <= item.pricing || isNaN(price)) {
//         await sendEmail(`<h1>Buy the product using the link below</h1>${item.name}`, email);
//       }

//       return { 
//         link: item.name, 
//         price: item.price, 
//         alias: item.alias,
//         currPrice: price // Include current price
//       };
//     });

//     // Wait for all promises to resolve
//     const result = await Promise.all(promises);

//     return res.status(200).json({ message: 'successfully', list: result });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: 'Error occurred' });
//   }
// });





// WORKING
app.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, pricing, alias } = req.body; // Destructure fields from request body
    console.log(req.body);
    // Create a new item object using the 'item' model
    const taskItem = new Item({
      name: name, // Assuming 'link' is the name you want to save
      pricing: pricing,
      alias: alias
    });

    // Save the item to the database
    await taskItem.save();

    console.log(taskItem); // Log the saved item

    // Send a success response
    return res.status(200).send({
      success: true,
      message: "Item Added successfully",
      taskItem // Sending the saved item in the response
    });
  } catch (error) {
    console.log(error);
    // Send an error response if there's an exception
    return res.status(200).send({
      success: false,
      message: "Item not added",
      error: error.message // Sending the error message in the response
    });
  }
});

// WORKING
app.post("/delete", authMiddleware, async (req, res) => {
  const id = req.body._id;
  try {
    // Find the item by its ID in the database
    const item = await Item.findById(id);

    // If item doesn't exist, return 404 Not Found
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // If item exists, delete it from the database
    await Item.deleteOne({ _id: id });

    // Respond with success message
    return res.status(200).json({ message: 'Item deleted successfully' });
  } catch (err) {
    // If an error occurs, return 500 Internal Server Error
    console.error('Error deleting item:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }

})




//authRoutes
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });


    res.status(200).json({ success: true, message: "Authentication successful", token, user });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})

app.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const newUser = new User({
      email,
      password: hashedPassword
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({success:true, message: "User registered successfully", newUser });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/current-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(500).send({
        success: false,
        message: "User not found "
      });
    }
    return res.status(200).send({
      success: true,
      message: "User found",
      user
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Can't get the current user "
    });
  }
})

const PORT = 8000 || process.env.PORT;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => console.error("Error connecting to the database:", error));
