import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';
// const API_BASE_URL = 'https://expense-tracker-liart-gamma-91.vercel.app';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Exponential backoff retry logic
api.interceptors.response.use(null, async (error) => {
    const { config, response } = error;

    // Retry only on network errors or 5xx server errors
    // Idempotency allows us to safely retry POST requests too if we're sure the ID is the same
    if (!config || !config.retry) {
        return Promise.reject(error);
    }

    if (response && response.status < 500) {
        // Don't retry 4xx errors
        return Promise.reject(error);
    }

    config.retryCount = config.retryCount || 0;

    if (config.retryCount >= config.retry) {
        return Promise.reject(error);
    }

    config.retryCount += 1;

    const backoff = Math.pow(2, config.retryCount) * 1000; // 1s, 2s, 4s...

    console.log(`Retrying request... Attempt ${config.retryCount}`);

    await new Promise(resolve => setTimeout(resolve, backoff));

    return api(config);
});

export const createExpense = (data) => {
    return api.post('/expenses', data, { retry: 3 });
};

export const getExpenses = (params) => {
    return api.get('/expenses', { params, retry: 3 });
};
