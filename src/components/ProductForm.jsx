import React, { useState } from 'react';
import LoadingButton from './LoadingButton';
import azure_endpoint from '../azure-endpoint';
function ProductForm() {

  const [productName, setProductName] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [loadingButton, setLoadingButton] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);
  
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
  }

  const onSubmit = async () => {
    console.log('initiating form submission');
    
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
      console.log("result : " + result);
      // store the response
      setApiResponse(result.toString());
    })
    .catch((err) => {
        setApiResponse("Error making POST request");
        console.log(err.message);
    }).finally(() => {
      setLoadingButton(false);
    });
  };


  return (
    <div>
        <div className='form'>
      
          <label htmlFor="productName">Product Name :</label>
          <input
              type="text"
              id="productName"
              value={productName}
              onChange={(event) => {setProductName(event.target.value);}}
              required
          />

          <label htmlFor="productImage">Product productImage :</label>
          <input
              type="file"
              id="productImage"
              onChange={productImageHandler}
              accept="image/*"
          />
          
          {/* Preview selected Image */}
          <div>
              {previewUrl && (
                <>
                    <label>productImage Preview : </label>
                    <img src={previewUrl} alt="preview" style={{ maxWidth: '200px' }} />
                </>
              )}
          </div>
          
          {/* Replace Submit with Loading button while processing */}
          <div>
              {loadingButton ? 
                  <LoadingButton/> : 
                  <button type="submit" id='submit' onClick={onSubmit}>Submit</button>
              }
              <button type="reset" id="reset" onClick={clearFormHandler}>Reset</button>
          </div> 
        </div>

        {/* Display final result */}
        {apiResponse && (
          <div style={{textAlign:"left", }}>
              <h4>Result</h4>
              <pre style={{ width: "70%", overflowX: "auto", fontSize: "15px", whiteSpace: "pre-wrap" }}>
                {apiResponse}
              </pre>
          </div>
        )}

    </div>
  );
};

export default ProductForm;
