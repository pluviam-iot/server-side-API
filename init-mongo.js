use pluviam;

db.createUser( { user: 'pluviam',
                 pwd: 'connect123',
                 roles: [ { role: 'clusterAdmin', db: 'admin' },
                          { role: 'readAnyDatabase', db: 'admin' },
                          'readWrite']});

db.createCollection('stations');
db.createCollection('weather');
