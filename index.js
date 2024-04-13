import { getProducts } from 'vinbudin';
import fs from 'fs/promises';
import json2csv from 'json2csv';

async function main() {
    try {
        const filePath = './json/products.json';
        const jsonData = await fs.readFile(filePath, 'utf-8');

        // Parse the JSON data
        const products = JSON.parse(jsonData);

        const pickedData = {}

        // Iterate over each product type
        Object.keys(products).forEach(async productType => {
            // Get products of this type
            const productsOfType = products[productType];

            // Calculate ISK_Per_ML_Ethanol and add it to each product of this type
            productsOfType.forEach(item => {
                const volume = item.productBottledVolume;
                const alcoholPercentage = item.productAlchoholVolume;
                const price = item.productPrice;

                const ethanolMLInBottle = volume * alcoholPercentage*0.01;
                const ISK_Per_ML_Ethanol = price / ethanolMLInBottle;

                item.ISK_Per_ML_Ethanol = Math.round(ISK_Per_ML_Ethanol * 1000) / 1000.0;
            });

            // Sort products of this type by ISK_Per_ML_Ethanol
            productsOfType.sort((a, b) => a.ISK_Per_ML_Ethanol - b.ISK_Per_ML_Ethanol);

            // Pick fields
            const picked = productsOfType.map(product => {
                return {
                    name: product.productName,
                    price: product.productPrice,
                    ISK_Per_ML_Ethanol: product.ISK_Per_ML_Ethanol,
                    alcoholPercentage: product.productAlchoholVolume,
                    volume_ML: product.productBottledVolume

                }
            })
            pickedData[productType] = picked
            // Save pickedData to json
            
        });
        const pickedDataFilePath = './json/pickedData.json';
        await fs.writeFile(pickedDataFilePath, JSON.stringify(pickedData));
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
