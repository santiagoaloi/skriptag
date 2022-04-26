const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp();

// exports.listAllUsersEmulator = functions.https.onCall(() =>
//   admin
//     .auth()
//     .listUsers(1000)
//     .then((listUsersResult) => listUsersResult.users)
//     .catch((error) => error),
// );

exports.verifiyUserByEmail = functions.https.onCall(async (email) => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    const id = user.uid;
    const docRef = admin.firestore().doc(`users/${id}`);
    await docRef.update({ verified: true });
    return {
      verified: true,
    };
  } catch (ex) {
    return { message: `Error!  ${ex.message}` };
  }
});

exports.disableUserByEmail = functions.https.onCall(async (email) => {
  try {
    const user = await admin.auth().getUserByEmail(email);

    await admin.auth().updateUser(user.uid, {
      disabled: true,
    });

    const docRef = admin.firestore().collection('users').doc(user.uid);

    await docRef.update({ disabled: true });

    return {
      disabled: true,
    };
  } catch (ex) {
    return { message: `Error!  ${ex.message}` };
  }
});

exports.enableUserByEmail = functions.https.onCall(async (email) => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    const id = user.uid;

    await admin.auth().updateUser(id, {
      disabled: false,
    });

    const docRef = admin.firestore().doc(`users/${id}`);
    await docRef.update({ disabled: false });
    return {
      enabled: true,
    };
  } catch (ex) {
    return { message: `Error!  ${ex.message}` };
  }
});

exports.deleteUserByEmail = functions.https.onCall(async (email) => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    const id = user.uid;

    await admin.auth().deleteUser(id);

    // The Delete User Data extension will take some seconds
    // before deleting the user document, this will visually
    // accelerate that, since a computed propery will ignore removed === true
    const docRef = admin.firestore().doc(`users/${id}`);
    await docRef.update({ removed: true });

    return {
      deleted: true,
    };
  } catch (ex) {
    return { message: `Error!  ${ex.message}` };
  }
});
