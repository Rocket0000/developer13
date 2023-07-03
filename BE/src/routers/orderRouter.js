import { Router } from "express";
import is from "@sindresorhus/is";
// 폴더에서 import하면, 자동으로 폴더의 index.js에서 가져옴
import { loginRequired } from "../middlewares";
import { orderService } from "../services";

const orderRouter = Router();

//주문내역 전체 조회
orderRouter.get("/admin/orders", async (req, res, next) => {
  try {
    const orders = await orderService.getOrders();

    res.status(200).send(orders);
  } catch (error) {
    next(error);
  }
});

//마이페이지에서 주문내역 조회
orderRouter.get(
  "/mypage/orders/:orderId",
  loginRequired,
  async (req, res, next) => {
    try {
      const order = await orderService.getOrderId(req.params.orderId);

      res.status(200).send(order);
    } catch (error) {
      next(error);
    }
  }
);

//관리자 수정 가능
orderRouter.patch(
  "/admin/orders/:orderId",
  loginRequired,
  async (req, res, next) => {
    try {
      const orderId = req.params.orderId;

      const orderInfoReq = { orderId };

      const shoppingStatus = req.body.shoppingStatus;

      const toUpdate = {
        ...(shoppingStatus && { shoppingStatus }),
      };

      const updateOrderInfo = await orderService.setOrder(
        orderInfoReq,
        toUpdate
      );

      res.status(200).json(updateOrderInfo);
    } catch (error) {
      next(error);
    }
  }
);

//주문 수정
orderRouter.patch(
  "/mypage/order/:orderId",
  loginRequired,
  async (req, res, next) => {
    try {
      const orderId = req.params.orderId;

      const orderInfoReq = { orderId };

      const receiverName = req.body.receiverName;
      const zipCode = req.body.zipCode;
      const extraAddress = req.body.extraAddress;
      const extraAddress_2 = req.body.extraAddress_2;
      const receiverPhone = req.body.receiverPhone;

      const toUpdate = {
        ...(receiverName && { receiverName }),
        ...(zipCode && { zipCode }),
        ...(extraAddress && { extraAddress }),
        ...(extraAddress_2 && { extraAddress_2 }),
        ...(receiverPhone && { receiverPhone }),
      };

      const updateOrderInfo = await orderService.setOrder(
        orderInfoReq,
        toUpdate
      );

      res.status(200).json(updateOrderInfo);
    } catch (error) {
      next(error);
    }
  }
);

// 주문하기
orderRouter.post("/order/order_info", loginRequired, async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    const productInfo = req.body.productInfo;
    const productCount = req.body.productCount;
    const buyer = req.body.buyer;
    const shoppingStatus = req.body.shoppingStatus;
    const orderDate = req.body.orderDate;
    const orderNumber = req.body.orderNumber;
    const totalAmount = req.body.totalAmount;
    const totalPrice = req.body.totalPrice;
    const zipCode = req.body.zipCode;
    const extraAddress = req.body.extraAddress;
    const extraAddress_2 = req.body.extraAddress_2;
    const receiverName = req.body.receiverName;
    const receiverPhone = req.body.receiverPhone;

    // 위 데이터를 유저 db에 추가하기
    const newOrder = await orderService.addOrder({
      productInfo,
      productCount,
      buyer,
      shoppingStatus,
      orderDate,
      orderNumber,
      totalAmount,
      totalPrice,
      zipCode,
      extraAddress,
      extraAddress_2,
      receiverName,
      receiverPhone,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

//장바구니
orderRouter.post("/cart/order", loginRequired, async (req, res, next) => {
  try {
    // Content-Type: application/json 설정을 안 한 경우, 에러를 만들도록 함.
    // application/json 설정을 프론트에서 안 하면, body가 비어 있게 됨.
    if (is.emptyObject(req.body)) {
      throw new Error(
        "headers의 Content-Type을 application/json으로 설정해주세요"
      );
    }

    const productInfo = req.body.productInfo;
    const productCount = req.body.productCount;
    const buyer = req.body.buyer;
    const shoppingStatus = req.body.shoppingStatus;
    const orderDate = req.body.orderDate;
    const orderNumber = req.body.orderNumber;
    const totalAmount = req.body.totalAmount;
    const totalPrice = req.body.totalPrice;
    const zipCode = req.body.zipCode;
    const extraAddress = req.body.extraAddress;
    const extraAddress_2 = req.body.extraAddress_2;
    const receiverName = req.body.receiverName;
    const receiverPhone = req.body.receiverPhone;

    // 위 데이터를 유저 db에 추가하기
    const newOrder = await orderService.addOrder({
      productInfo,
      productCount,
      buyer,
      shoppingStatus,
      orderDate,
      orderNumber,
      totalAmount,
      totalPrice,
      zipCode,
      extraAddress,
      extraAddress_2,
      receiverName,
      receiverPhone,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    next(error);
  }
});

//주문삭제
orderRouter.delete(
  "/mypage/orders/:orderId",
  loginRequired,
  async (req, res, next) => {
    try {
      await orderService.deleteOrder(req.params);

      res.status(201).send();
    } catch (error) {
      next(error);
    }
  }
);

//관리자 주문삭제
orderRouter.delete(
  "/admin/orders/:orderId",
  loginRequired,
  async (req, res, next) => {
    try {
      await orderService.deleteOrder(req.params);

      res.status(201).send();
    } catch (error) {
      next(error);
    }
  }
);

export { orderRouter };
