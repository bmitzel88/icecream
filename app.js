// Import the express module
import express from 'express';

// Create an instance
const app = express();

// Define a port number
const PORT = 3001;

// Create an array to store orders
const orders = [];

// Enable static file serving
app.use(express.static('public'));

// App middleware to allow the app to parse form data
// Access form data through req.body
app.use(express.urlencoded({ extended: true }));

// Set view engine to EJS
app.set('view engine', 'ejs');

// Define a default route ("/")
app.get('/', (req, res) =>{
    res.render('home');
});

app.post('/submit-order', (req, res) =>{
    const order = req.body;
    order['timestamp'] = new Date();

    console.log(order);

    // Add order object to orders array
    orders.push(order);
    console.log(orders);

    //Display the confirmation page
    res.render('confirm', { order });
});


// Start server on designated port
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
