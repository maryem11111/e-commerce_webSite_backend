// const mongoose = require('mongoose'); // Erase if already required

// // Declare the Schema of the Mongo model
// var orderSchema = new mongoose.Schema({
//    products: [
//     {
//         product:{
//             type:  mongoose.Schema.Types.ObjectId,
//             ref: "Product",
//             },
//             count: Number,
//             color: String,
//     },
//    ],
//    paymentIntent: {},
//    orderStatus: {
//        type: String,
//        default: "Not Processed",
//        enum: [
//            "Not Processed",
//            "Cash On Delivery",
//            "Processing",
//            "Dispatched",
//            "Cancelled",
//            "Delivered",
//        ],
//    },
//    orderedBy: {
//        type: mongoose.Schema.Types.ObjectId,
//        ref: "User",
//    },
// },
// {
//     timestamps:true,
// });

// //Export the model
// module.exports = mongoose.model('Order', orderSchema);
const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var orderSchema = new mongoose.Schema({
   products: [
    {
        product:{
            type:  mongoose.Schema.Types.ObjectId,
            ref: "Product",
        },
        count: Number,
        color: String,
    },
   ],
   paymentIntent: {},
   orderStatus: {
       type: String,
       default: "Not Processed",
       enum: [
           "Not Processed",
           "Cash on Delivery",  // Assurez-vous que la casse est correcte ici
           "Processing",
           "Dispatched",
           "Cancelled",
           "Delivered",
       ],
   },
   orderedBy: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
   },
},
{
    timestamps: true,
});

// Export the model
module.exports = mongoose.model('Order', orderSchema);
