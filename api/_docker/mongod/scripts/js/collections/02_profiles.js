db.createCollection('profiles');
db.profiles.createIndex({ 'email': 1 }, { unique: true, name: 'email' });
