import { Schema } from "mongoose";

const orderSchema = new Schema({
  productInfo:[{
    type: Schema.Types.ObjectId,
    ref:"Product",
  }],
  productCount:{
    type: [Number]
  },
  buyer:{
    type: Schema.Types.ObjectId,
    ref:"users",
  },
  shoppingStatus:{
    type: String,
    enum: ['배송준비중', '배송중', '배송완료', '결제완료'],
    default:"결제완료",
  },
  orderDate:{
    type: Date,
    default: new Date()
  },
  orderNumber:{
    type: String,
  },
  totalAmount:{
    type: Number,
  },
  totalPrice:{
    type: Number,
  },
  zipCode:{
    type: String,
  },
  extraAddress:{
    type: String,
  },
  extraAddress_2:{
    type: String,
  },
  receiverName:{
    type: String,
  },
  receiverPhone:{
    type: String,
  },
},{
    timestamps: true 
});

export { orderSchema };
