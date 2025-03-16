import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext";
import { Link } from "react-router-dom";

const ShowProduct = () => {
  const { products, filteredData, addToCart } = useContext(AppContext);
  const [imageErrors, setImageErrors] = useState({});
  const fallbackImage = "https://via.placeholder.com/200x200?text=Product+Image";
  
  useEffect(() => {
    console.log("Products in ShowProduct:", products);
    console.log("FilteredData in ShowProduct:", filteredData);
  }, [products, filteredData]);

  const handleImageError = (productId) => {
    console.log(`Image for product ${productId} failed to load, using fallback`);
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  return (
    <>
      <div className="container d-flex justify-content-center align-items-center">
        <div className="row container d-flex justify-content-center align-items-center my-5">
          {filteredData && filteredData.length > 0 ? (
            filteredData.map((product) => (
              <div
                key={product._id}
                className="my-3 col-md-4 d-flex justify-content-center align-items-center"
              >
                <div
                  className="card bg-dark text-light text-center"
                  style={{ width: "18rem" }}
                >
                  <Link
                    to={`/product/${product._id}`}
                    className="d-flex justify-content-center align-items-center p-3"
                  >
                    <img
                      src={imageErrors[product._id] ? fallbackImage : product.imgSrc}
                      className="card-img-top"
                      alt={product.title}
                      onError={() => handleImageError(product._id)}
                      style={{
                        width: "200px",
                        height: "200px",
                        borderRadius: "10px",
                        border: "2px solid yellow",
                      }}
                    />
                  </Link>
                  <div className="card-body">
                    <h5 className="card-title">{product.title}</h5>
                    <div className="my-3">
                      <button className="btn btn-primary mx-3">
                        {product.price} {"₹"}
                      </button>
                      <button
                        className="btn btn-warning"
                        onClick={() =>
                          addToCart(
                            product._id,
                            product.title,
                            product.price,
                            1,
                            product.imgSrc
                          )
                        }
                      >
                        Add To Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center my-5">
              <h3>No products found</h3>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ShowProduct;
