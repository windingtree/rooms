db.createCollection('offers');
db.offers.createIndex({ 'createdAt': 1 }, { expireAfterSeconds: 600, name: 'createdAt' });
