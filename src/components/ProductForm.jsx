import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Image, Card } from 'react-bootstrap';
import LoadingButton from './LoadingButton';
import azure_endpoint from '../azure-endpoint';

function ProductForm() {
  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [loadingButton, setLoadingButton] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  const [productNameError, setProductNameError] = useState('');

  const productImageHandler = (event) => {
    const file = event.target.files[0];
    setProductImage(file);

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };

      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const clearFormHandler = () => {
    setProductImage('');
    setPreviewUrl(null);
    setProductImage(null);
    setProductName('');
    setProductNameError('');
    setApiResponse('');
  };

  const onSubmit = async () => {
    // Validate product name
    if (!productName) {
      setProductNameError('Product Name is required');
      return;
    }

    // Clear previous errors
    setProductNameError('');

    setLoadingButton(true);
    // clear previous results from api
    setApiResponse(null);

    const formData = new FormData();
    formData.append('productName', productName);
    formData.append('productImage', productImage);

    // Using the Fetch API to azure function
    fetch(azure_endpoint.url, {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.text())
      .then((result) => {
        console.log('result : ' + result);
        // store the response
        setApiResponse(result.toString());
      })
      .catch((err) => {
        setApiResponse('Error making POST request');
        console.log(err.message);
      })
      .finally(() => {
        setLoadingButton(false);
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
      <h3 style={{textAlign: 'center'}}>Enter Product Name to extract its info or product image to extract text from it</h3>
        <Col md={6}>
          <Card>
            <Card.Body>
              <Form>
                <Form.Group controlId="productName" className="mb-3">
                  <Form.Label style={{fontWeight: 'bold'}}>Product Name:</Form.Label>
                  <Form.Control
                    type="text"
                    value={productName}
                    onChange={(event) => setProductName(event.target.value)}
                    required
                    isInvalid={!!productNameError}
                  />
                  <Form.Control.Feedback type="invalid">{productNameError}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="productImage" className="mb-3">
                  <Form.Label style={{fontWeight: 'bold'}}>Product Image:</Form.Label>
                  <Form.Control type="file" onChange={productImageHandler} accept="image/*" />
                </Form.Group>

                {previewUrl && (
                  <Form.Group controlId="imagePreview" className="mb-3">
                    <Form.Label>Image Preview:</Form.Label>
                    <Image src={previewUrl} alt="preview" style={{ maxWidth: '100%', border: '1px solid #ddd' }} />
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  {loadingButton ? (
                    <LoadingButton />
                  ) : (
                    <Row className="justify-content-center">
                      <Col md="auto">
                        <Button type="button" id="submit" onClick={onSubmit} style={{ backgroundColor: '#006400', color: '#ffffff'}}>
                          Submit
                        </Button>
                      </Col>
                      <Col md="auto">
                        <Button type="reset" id="reset" variant="secondary" onClick={clearFormHandler} style={{ backgroundColor: '#ffffff', color: 'darkgreen', borderColor: 'darkgreen' }}>
                          Reset
                        </Button>
                      </Col>
                    </Row>
                  )}
                </Form.Group>
              </Form>

              {/* Display final result */}
              {apiResponse && (
                <div style={{ textAlign: 'left', marginTop: '20px' }}>
                  <h4>Result</h4>
                  <pre style={{ overflowX: 'auto', fontSize: '15px', whiteSpace: 'pre-wrap' }}>{apiResponse}</pre>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default ProductForm;
