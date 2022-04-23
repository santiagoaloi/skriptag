const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp();

exports.listAllUsers = functions.https.onCall(() =>
  admin
    .auth()
    .listUsers(1000)
    .then((listUsersResult) => listUsersResult.users)
    .catch((error) => error),
);

exports.listAllUsersEmulator = functions.https.onCall(() =>
  admin
    .auth()
    .listUsers(1000)
    .then((listUsersResult) => listUsersResult.users)
    .catch((error) => error),
);
