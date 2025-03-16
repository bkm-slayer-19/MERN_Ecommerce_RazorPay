import { useContext, useState, useEffect } from "react";
import AppContext from "../../context/AppContext";
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';

const RelatedProduct = ({ category }) => {
  const { products, addToCart } = useContext(AppContext);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const fallbackImage = "https://via.placeholder.com/200x200?text=Product+Image";
  
  useEffect(() => {
    console.log("Category in RelatedProduct:", category);
    console.log("All products:", products);
    
    if (category && products && products.length > 0) {
      // Map categories to handle different formats
      const categoryMap = {
        "electronics": ["electronics", "mobiles", "laptops", "headphones", "cameras", "tablets"],
        "mobiles": ["electronics", "mobiles"],
        "laptops": ["electronics", "laptops"],
        "headphones": ["electronics", "headphones"],
        "cameras": ["electronics", "cameras"],
        "tablets": ["electronics", "tablets"]
      };
      
      // Get related categories
      const relatedCategories = categoryMap[category.toLowerCase()] || [category.toLowerCase()];
      
      console.log("Related categories:", relatedCategories);
      
      // Filter products by related categories
      const filtered = products.filter(product => 
        product?.category && relatedCategories.includes(product.category.toLowerCase())
      );
      
      console.log("Filtered related products:", filtered);
      setRelatedProducts(filtered);
    }
  }, [category, products]);

  const handleAddToCart = (product) => {
    addToCart(
      product._id,
      product.title,
      product.price,
      1,
      product.imgSrc
    );
  };

  const handleImageError = (productId) => {
    console.log(`Image for related product ${productId} failed to load, using fallback`);
    setImageErrors(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  return (
    <>
      <div className="container text-center">
        <h1>Related Products</h1>
        <div className="container d-flex justify-content-center align-items-center">
          <div className="row container d-flex justify-content-center align-items-center my-5">
            {relatedProducts && relatedProducts.length > 0 ? (
              relatedProducts.map((product) => (
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
                          onClick={() => handleAddToCart(product)}
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
                <h3>No related products found</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

RelatedProduct.propTypes = {
  category: PropTypes.string
};

export default RelatedProduct;
