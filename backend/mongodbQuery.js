const { MongoClient } = require('mongodb');
require('dotenv').config();

async function test() {
    try {
        console.log('Connecting...');
        const client = await MongoClient.connect(process.env.MONGODB_URI);
        console.log('Connected!');
        await client.close();
    } catch (e) {
        console.error('Error:', e.message);
    }
}
test();