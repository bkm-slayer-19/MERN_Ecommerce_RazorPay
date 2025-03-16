import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import RelatedProduct from "./RelatedProduct";
import AppContext from "../../context/AppContext";

const ProductDetail = () => {
  const [product, setProduct] = useState();
  const [imageError, setImageError] = useState(false);
  const { id } = useParams();
  const url = "http://localhost:3000/api";
  const { addToCart } = useContext(AppContext);
  const fallbackImage = "https://via.placeholder.com/250x250?text=Product+Image";

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log("Fetching product with ID:", id);
        const api = await axios.get(`${url}/product/${id}`, {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: false,
        });
        console.log("Product data:", api.data);
        setProduct(api.data.product);
        setImageError(false); // Reset image error state when loading a new product
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(
        product._id,
        product.title,
        product.price,
        1,
        product.imgSrc
      );
    }
  };

  const handleImageError = () => {
    console.log("Image failed to load, using fallback");
    setImageError(true);
  };

  return (
    <>
      <div
        className="container text-center my-5"
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <div className="left">
          <img
            src={imageError ? fallbackImage : product?.imgSrc}
            alt={product?.title}
            onError={handleImageError}
            style={{ width: "250px", height: "250px",borderRadius:'10px',border:"2px solid yellow" }}
          />
        </div>
        <div className="right">
          <h1>{product?.title}</h1>
          <p>{product?.description}</p>
          <h1>
            {product?.price}{" "}
            {"₹"}
          </h1>
          <h3>Category: {product?.category}</h3>
          <div className="my-5">
            <button className="btn btn-danger mx-3" style={{fontWeight:'bold'}}>Buy Now</button>
            <button 
              className="btn btn-warning" 
              style={{fontWeight:'bold'}}
              onClick={handleAddToCart}
            >
              Add To Cart
            </button>
          </div>
        </div>
      </div>

      <RelatedProduct category={product?.category} />
    </>
  );
};

export default ProductDetail;
