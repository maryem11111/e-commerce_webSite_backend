const express = require('express');
const dbConnect = require('./config/dbConnect');
const app = express()
const cors = require('cors');
const dotenv = require('dotenv').config()
const PORT = process.env.PORT || 4000;
const authRouter = require('../backend/routes/authRoute');
const productRouter = require('../backend/routes/productRoute');
const blogRouter = require('../backend/routes/blogRoutes');
const categoryRouter = require('../backend/routes/categoryRoute');
const blogcategoryRouter = require('../backend/routes/blogCatRoute');
const brandRouter = require('../backend/routes/brandRoute');
const colorRouter = require('../backend/routes/colorRoute');
const enqRouter = require('../backend/routes/enqRoute');
const couponRouter = require('../backend/routes/couponRoute');  

const bodyParser = require('body-parser');
const { notFound, errorHandler } = require('./middlewares/errorHandler');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
dbConnect();
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser())

app.use('/api/user',authRouter);
app.use('/api/product',productRouter);
app.use("/api/blog",blogRouter);
app.use("/api/category",categoryRouter);
app.use("/api/blogcategory",blogcategoryRouter);
app.use("/api/brand",brandRouter);
app.use("/api/coupon",couponRouter);
app.use("/api/color",colorRouter);
app.use("/api/enquiry",enqRouter);



app.use(notFound);
app.use(errorHandler);


app.listen(PORT, ()=>{
    console.log(`Server is running at PORT ${PORT}`)
});
