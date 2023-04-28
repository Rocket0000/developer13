import { model } from "mongoose";
import { productSchema } from "../schemas/productSchema";

export const Product = model("Product", productSchema);

// 상품 생성
const createProduct = async (productInfo) => {
  const createdproduct = await Product.create(productInfo);
  return createdproduct;
};

// 이름 기반 상품 조회
const findProductByName = async (name) => {
  const product = await Product.findOne({ name: name });
  return product;
};

//id로 조회해오기
const findProductById = async (productId) => {
  const product = await Product.findById({ _id: productId });
  return product;
};

// 전체 목록 조회
const findAllproducts = async () => {
  const products = await Product.find({});
  return products;
};

// 상품 업데이트
const updateProduct = async (name, update) => {
  const filter = { name: name };
  const option = { returnOriginal: false };

  const updateProduct = await Product.findOneAndUpdate(filter, update, option);
  return updateProduct;
};

// 상품 삭제
const deleteProduct = async (name) => {
  const deletedProduct = await Product.findOneAndRemove({ name: name });
  return deletedProduct;
};

// 카테고리 ID로 상품 가져오기
const findAllByCategoryId = async (categoryId) => {
  const getProductCategoryId = await Product.find({ category: categoryId });
  return getProductCategoryId;
};

export {
  findProductByName,
  createProduct,
  updateProduct,
  deleteProduct,
  findAllproducts,
  findProductById,
  findAllByCategoryId,
};
