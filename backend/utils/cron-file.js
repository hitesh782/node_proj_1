const cron = require('node-cron');

// Schedule a task to run every 20 seconds
cron.schedule('*/20 * * * * *', () => {
    console.log('Task is running every 20 seconds');
});

// Schedule a task to run every minute
cron.schedule('* * * * *', () => {
    console.log('Task is running every minute');
});

// Schedule a task to run at midnight every day
cron.schedule('0 0 * * *', () => {
    console.log('Task is running at midnight every day');
});

// Schedule a task to run every Monday at 1am
cron.schedule('0 1 * * 1', () => {
    console.log('Task is running every Monday at 1am');
});
