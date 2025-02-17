import { Router } from 'express';

const router = Router();

// Example controller function
const getExampleData = (req, res) => {
    res.json({ message: 'This is an example response' });
};

// Define routes
router.get('/example', getExampleData);

// Export the router
export default router;