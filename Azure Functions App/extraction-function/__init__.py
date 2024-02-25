import os
import logging
import base64
from io import BytesIO
from datetime import datetime
import azure.functions as func
from azure.data.tables import TableServiceClient
from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from msrest.authentication import CognitiveServicesCredentials
import openai


def ocr(image_content) -> str:
    image_stream = BytesIO(image_content)
    subscription_key = os.getenv("AZURE_COMPUTER_VISION_SUBSCRIPTION_KEY")
    endpoint = os.getenv("AZURE_COMPUTER_VISION_ENDPOINT")

    computervision_client = ComputerVisionClient(endpoint, CognitiveServicesCredentials(subscription_key))

    result = computervision_client.recognize_printed_text_in_stream(image_stream)

    recognized_text = ""
    for region in result.regions:
        for line in region.lines:
            for word in line.words:
                recognized_text += word.text + " "

    return recognized_text

def upload_image_to_table(image_content):
    connection_string = os.getenv("AZURE_STORAGE_CONNECTION_STRING")
    table_service_client = TableServiceClient.from_connection_string(conn_str=connection_string)
    table_client = table_service_client.get_table_client(table_name="test")

    email = "user3@example.com"
    current_time = datetime.now()
    formatted_time = current_time.isoformat()

    base64_image = base64.b64encode(image_content).decode('utf-8')
    new_val = 'Image: ' + base64_image
    logging.info(new_val)
    email = "user3@example.com"

    image_entity = {
        "PartitionKey": email,
        "RowKey": formatted_time,
        "Image": base64_image
    }

    table_client.create_entity(entity=image_entity)

def chat_completion_from_chatgpt(productName):
    logging.info('Initiating chat completion request.')
    client = openai.OpenAI(api_key=os.getenv("MY_OPENAI_SECRET_KEY"))

    prompt = f"Act as a database. I will give you a packaged product name and you have to give me with brief bullet points on its nutrition information without any other information. If the product name is unknown then reply with 'The product name provided is unknown please try again.'. Now please give me info about {productName}"
    
    # create a chat completion
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": prompt},
        ]
    )

    result = response.choices[0].message.content
   
    logging.info(f'Chat response: {result}')
    return result

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    if req.method != 'POST':
        return func.HttpResponse(
            "Please use a POST request",
            status_code=400 
        )

    product_name = req.form.get('productName')

    if not product_name:
        return func.HttpResponse(
            "Please pass neccessary arguments",
            status_code=400 
        )
    
    if 'productImage' in req.files:
        image_file = req.files['productImage']
        image_content = image_file.read()
        
        recognized_text = ocr(image_content)
        logging.info(f"Recognized text from the image: {recognized_text}")
        
        upload_image_to_table(image_content)
        logging.info('uploaded image into table')

        return func.HttpResponse(
            f"Received productName: {product_name}, \n Recognized text: {recognized_text}",
            status_code=200
        )
    else:
        response = chat_completion_from_chatgpt(product_name)
        return func.HttpResponse(f"Received productName: {product_name}, \n\nExtracted Information : \n{response}")