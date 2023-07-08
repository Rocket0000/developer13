import { model } from "mongoose";
import { orderSchema } from "../schemas/orderSchema";

const Order = model("order", orderSchema);

export class OrderModel {

  //주문한ID로 불러오기
  async findByOrderId(orderId){
    const order = await Order.findOne({_id: orderId})
                              .populate('productInfo')
                              .populate('buyer')
    return order
  }

  //모든 주문 조회
  async findAllOrder(){
    const orderList = await Order.find({})
      .populate("productInfo")
      .populate("buyer");
    return orderList;
  }
  //주문하기
  async create(orderInfo) {
    const createNewOrder = await Order.create(orderInfo);

    return createNewOrder;
  }

  async update({ orderId, update }) {
    const filter = { _id: orderId };
    const option = { returnOriginal: false };

    const updateOrder = await Order.findOneAndUpdate(filter, update, option);
    return updateOrder;
  }

  async deleteOrder(orderId){
    const deleteOrder = await Order.findOneAndRemove({_id:orderId})

    return deleteOrder
  }
}

const orderModel = new OrderModel();

export { orderModel };
