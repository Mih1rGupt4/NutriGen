import React from "react";
export default function About() {
  return (
    <div style={{textAlign: 'justify', overflowX: 'auto', fontSize: '15px', whiteSpace: 'pre-wrap' }}>
        <h1>NutriGen: Personalized Dietary Guidance With AI</h1>
        <p>
            People today live in a fast-paced world where there is an overwhelming variety of packaged food products, all of which make varied health claims. But figuring out whether a specific packaged food item is safe and compatible with a person's unique set of health issues has grown complicated and time-consuming. To help customers make informed nutritional decisions, there is an urgent need for a solution that makes use of cutting-edge technology, such as Generative AI. The objective of this project is to develop an application that harnesses the power of Generative AI to search the internet and analyze the nutritional content of packaged food products. The system will consider an individual's personalized health conditions, such as allergies, dietary restrictions, and nutritional requirements, to provide customized recommendations regarding the safety and suitability of these products for consumption. The application will provide an interface where it is easy to specify one’s health conditions. When the user searches a product, the data of the product is gathered and in-depth analysis of the contents is done using Gen AI model and NLP which is compared to the user’s current health condition and based on the information gathered, the product is rated on its safety to be consumed.
        </p>
        <h2>Team Members:</h2>
        <ul>
            <li>Charan C (1NH20AI020)</li>
            <li>Fizza Mirza (1NH20AI030)</li>
            <li>M Karthic Kumar (1NH20AI055)</li>
            <li>Mihir Gupta(1NH20AI061)</li>
        </ul>
    </div>
  );
}