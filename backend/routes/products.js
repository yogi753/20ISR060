const axios = require('axios');
const express = require('express');
const crypto = require('crypto');
const cors = require('cors');

const router = express.Router();
router.use(cors()); 
router.use(express.json()); 

const BASE_URL = 'http://20.244.56.144/test'; 

const generateProductId = (product) => {
    return crypto.createHash('md5').update(JSON.stringify(product)).digest('hex');
};

const BEARER_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE4NzA1Njg5LCJpYXQiOjE3MTg3MDUzODksImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6Ijc3YTNjZTEwLTJhNTAtNGM4ZS05MjY0LTUzZjU2OTI2MDY4ZiIsInN1YiI6Inlva2VzaHIuMjBtc2NAa29uZ3UuZWR1In0sImNvbXBhbnlOYW1lIjoiZ29NYXJ0IiwiY2xpZW50SUQiOiI3N2EzY2UxMC0yYTUwLTRjOGUtOTI2NC01M2Y1NjkyNjA2OGYiLCJjbGllbnRTZWNyZXQiOiJ6a1N1ckdtdlFPVVFXcGRDIiwib3duZXJOYW1lIjoiWW9rZXNoIiwib3duZXJFbWFpbCI6Inlva2VzaHIuMjBtc2NAa29uZ3UuZWR1Iiwicm9sbE5vIjoiMjBJU1IwNjAifQ.r6FbJy5djxnJv2v3oAtsUVmHV6TUTAdjx_segNd02Bg';

const axiosConfig = {
    headers: {
        Authorization: `Bearer ${BEARER_TOKEN}`
    }
};

router.get('/companies/:company/categories/:category/products', async (req, res) => {
    const { company, category } = req.params;
    const { top, minPrice, maxPrice, sort_by, order } = req.query;

    const url = `${BASE_URL}/companies/${company}/categories/${category}/products`;

    try {
        const response = await axios.get(url, {
            params: { top, minPrice, maxPrice, sort_by, order },
            ...axiosConfig
        });

        const products = response.data.map(product => ({
            ...product,
            company,
            id: generateProductId(product)
        }));


        products.sort((a, b) => {
            if (order === 'asc') return a[sort_by] - b[sort_by];
            return b[sort_by] - a[sort_by];
        });

        res.json(products);
        console.log(products)
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).send('Error fetching products');
    }
});

router.get('/companies/:company/categories/:category/products/:productid', async (req, res) => {
    const { company, category, productid } = req.params;

    try {
        const response = await axios.get(`${BASE_URL}/companies/${company}/categories/${category}/products`, axiosConfig);
        const product = response.data.find(p => generateProductId(p) === productid);

        if (product) {
            res.json({ ...product, company, id: productid });
        } else {
            res.status(404).send('Product not found');
        }
    } catch (err) {
        console.error('Error fetching product details:', err);
        res.status(500).send('Error fetching product details');
    }
});

module.exports = router;
