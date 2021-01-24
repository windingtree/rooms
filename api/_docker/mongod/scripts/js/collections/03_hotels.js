db.createCollection('hotels');
db.hotels.createIndex({ location: '2dsphere' }, { name: 'location' });
