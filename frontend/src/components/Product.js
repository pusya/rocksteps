import React from 'react'
import { Link } from 'react-router-dom'
import { Card } from 'react-bootstrap'
import Rating from './Rating'

function Product({ product }) {
  return (
    <Card className="my-3 p-3 rounded">
      <Link to={`/product/${product._id}`}>
        {product.photos && product.photos.length > 0 && (
          <Card.Img src={product.photos[0].photo} />
        )}
      </Link>

      <Card.Body>
        <Link className={`links`} to={`/product/${product._id}`}>
          <Card.Title as="div">
            <strong>{product.name}</strong>
          </Card.Title>
        </Link>

        <Card.Text as="div">
          <div className="my-3">
            <Rating
              value={product.rating}
              text={`${product.numReviews} reviews`}
              color={'#f8e825'}
            />
          </div>
        </Card.Text>

        <Card.Text as="h5">${product.price}</Card.Text>
      </Card.Body>
    </Card>
  )
}

export default Product
