import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams, useNavigate } from 'react-router-dom'
import {
  Col,
  Row,
  Image,
  ListGroup,
  Button,
  Form,
  Carousel,
  Card,
} from 'react-bootstrap'
import Rating from '../components/Rating'
import Loader from '../components/Loader'
import Message from '../components/Message'
import {
  listProductDetails,
  createProductReview,
} from '../actions/productActions'
import { PRODUCT_CREATE_REVIEW_RESET } from '../constants/productConstants'
import { PRODUCT_DETAILS_RESET } from '../constants/productConstants'

function ProductScreen() {
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState(35)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const { id } = useParams()
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const productDetails = useSelector((state) => state.productDetails)
  const { loading, error, product } = productDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productReviewCreate = useSelector((state) => state.productReviewCreate)
  const {
    loading: loadingProductReview,
    error: errorProductReview,
    success: successProductReview,
  } = productReviewCreate

  useEffect(() => {
    dispatch({ type: PRODUCT_DETAILS_RESET })
    dispatch(listProductDetails(id))
    if (successProductReview) {
      setRating(0)
      setComment('')
      dispatch({ type: PRODUCT_CREATE_REVIEW_RESET })
    }
  }, [dispatch, id, successProductReview])

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}&size=${size}`)
  }

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      createProductReview(id, {
        rating,
        comment,
      })
    )
  }

  return (
    <div>
      <Link to="/" className="btn btn-light my-3">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Row className="mb-5 justify-content-center">
            <Col md={5}>
              <Carousel variant="dark">
                {product.photos &&
                  product.photos.length > 0 &&
                  product.photos.map((photo) => (
                    <Carousel.Item key={photo.id}>
                      <Image
                        src={photo.photo}
                        alt={product.name}
                        fluid
                        className="d-block w-100 product-img"
                      />
                    </Carousel.Item>
                  ))}
              </Carousel>
            </Col>

            <Col md={{ span: 5, offset: 1 }}>
              <Card>
                <ListGroup variant="flush">
                  <ListGroup.Item style={{ border: 'none' }}>
                    <h3>{product.name}</h3>
                  </ListGroup.Item>

                  <ListGroup.Item style={{ border: 'none' }}>
                    <h5>
                      <strong>${product.price}</strong>
                    </h5>
                  </ListGroup.Item>

                  <ListGroup.Item style={{ border: 'none' }}>
                    <Rating
                      value={product.rating}
                      text={`${product.numReviews} reviews`}
                      color={'#f8e829'}
                    />
                  </ListGroup.Item>

                  <ListGroup.Item style={{ border: 'none' }}>
                    Description: {product.description}
                  </ListGroup.Item>

                  <ListGroup.Item>
                    <Row>
                      <Col>
                        {product.countInStock === 0
                          ? 'Out of Stock'
                          : product.countInStock < 5
                          ? 'Low in Stock'
                          : 'In Stock'}
                      </Col>
                    </Row>
                  </ListGroup.Item>

                  {product.countInStock > 0 && (
                    <>
                      <ListGroup.Item style={{ border: 'none' }}>
                        <Row>
                          <Col md={3}>
                            <Form.Label htmlFor="inlineFormInput">
                              Size:
                            </Form.Label>
                          </Col>
                          <Col md={8}>
                            <Form.Control
                              as="select"
                              value={size}
                              onChange={(e) => setSize(e.target.value)}
                            >
                              {[...Array(12).keys()].map((x) => (
                                <option key={x + 35} value={x + 35}>
                                  {x + 35} ({x + 3.5}M / {x + 4.5}W)
                                </option>
                              ))}
                            </Form.Control>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <Row>
                          <Col md={3}>
                            <Form.Label htmlFor="inlineFormInput">
                              Qty:
                            </Form.Label>
                          </Col>
                          <Col md={2}>
                            <Form.Control
                              as="select"
                              value={qty}
                              onChange={(e) => setQty(e.target.value)}
                            >
                              {[...Array(8).keys()].map((x) => (
                                <option key={x + 1} value={x + 1}>
                                  {x + 1}
                                </option>
                              ))}
                            </Form.Control>
                          </Col>
                          <Col md={6}>
                            <div className="d-grid">
                              <Button
                                onClick={addToCartHandler}
                                className="btn-block"
                                disabled={product.countInStock === 0}
                                type="button"
                              >
                                Add to Cart
                              </Button>
                            </div>
                          </Col>
                        </Row>
                        <Row></Row>
                      </ListGroup.Item>
                    </>
                  )}
                </ListGroup>
              </Card>
            </Col>
          </Row>

          <Row className="mt-2 justify-content-center">
            <Col md={6} className="mt-5">
              <h4>Reviews</h4>
              {product.reviews.length === 0 && (
                <Message variant="info">No Reviews</Message>
              )}

              <ListGroup variant="flush">
                {product.reviews.map((review) => (
                  <ListGroup.Item key={review._id}>
                    <strong>{review.name}</strong>
                    <Rating value={review.rating} color="#f8e825" />
                    <p>{review.createdAt.substring(0, 10)}</p>
                    <p>{review.comment}</p>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>

            <Col md={{ span: 4, offset: 1 }} className="mt-5">
              <ListGroup.Item>
                <h5>Write a Review</h5>

                {loadingProductReview && <Loader />}
                {successProductReview && (
                  <Message variant="success">Submitted</Message>
                )}
                {errorProductReview && (
                  <Message variant="danger">{errorProductReview}</Message>
                )}

                {userInfo ? (
                  <Form onSubmit={submitHandler}>
                    <Form.Group controlId="rating" className="my-3">
                      <Form.Label>Rating</Form.Label>
                      <Form.Control
                        as="select"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                      >
                        <option value="">Select...</option>
                        <option value="1">1 - Poor</option>
                        <option value="2">2 - Fair</option>
                        <option value="3">3 - Good</option>
                        <option value="4">4 - Very Good</option>
                        <option value="5">5 - Excellent</option>
                      </Form.Control>
                    </Form.Group>

                    <Form.Group controlId="comment" className="mb-3">
                      <Form.Label>Comment</Form.Label>
                      <Form.Control
                        as="textarea"
                        value={comment}
                        rows={4}
                        onChange={(e) => setComment(e.target.value)}
                      ></Form.Control>
                    </Form.Group>

                    <Button
                      disabled={loadingProductReview}
                      type="submit"
                      variant="primary"
                    >
                      Submit
                    </Button>
                  </Form>
                ) : (
                  <Message variant="info">
                    Please <Link to="/login">login</Link> to write a review
                  </Message>
                )}
              </ListGroup.Item>
            </Col>
          </Row>
        </div>
      )}
    </div>
  )
}

export default ProductScreen
