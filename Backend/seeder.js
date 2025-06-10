const mongoose= require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");
const Cart = require("./models/Cart");
const products = require("./data/products");

dotenv.config();

mongoose.connect(process.env.MONGO_URL);
//Function to seed the database with products and users
const seedData=async () => {
    try{
        //clear the existing data
        await Product.deleteMany();
        await User.deleteMany();
        await Cart.deleteMany();

        //Create a default admin user
        const createdUser = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "123456",
            role:"admin",
        });

        //Assign the default user to each product
        const userID=createdUser._id;
        const sampleProducts = products.map((product) => {
            return { ...product, user :userID };
        });

        //Insert the sample products into the database
        await Product.insertMany(sampleProducts);
        console.log(" Product Data seeded successfully!");
    }
    catch(error){
        console.error("Error seeding data:", error);
        process.exit(1);
 }
};

seedData();
