const admin = require('firebase-admin');
const functions = require('firebase-functions');

admin.initializeApp();

// Appcheck protected / reCAPTCHA authorices only skriptag.com domain.
exports.listAllUsers = functions.region('europe-west1').https.onCall(async (data, context) => {
  // If appCheck fails, terminate the funciton.
  if (context.app === undefined) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called from an App Check verified app.');
  }

  // If the user is not authenticated, terminate the function.
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated');
  }

  try {
    const all = await admin.auth().listUsers();

    return {
      ...all.users,
    };
  } catch (error) {
    return { message: `Error listing users!  ${error}` };
  }
});

exports.verifiyUserByEmail = functions.region('europe-west1').https.onCall(async (email) => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    const docRef = admin.firestore().collection('users').doc(user.uid);
    await docRef.update({ verified: true });

    return {
      verified: true,
    };
  } catch (ex) {
    return { message: `Error!  ${ex.message}` };
  }
});

exports.disableUserByEmail = functions.region('europe-west1').https.onCall(async (email, context) => {
  // If appCheck fails, terminate the funciton.
  if (context.app === undefined) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called from an App Check verified app.');
  }

  // If the user is not authenticated, terminate the function.
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated');
  }

  const profile = admin.firestore().collection('users').doc(context.auth.uid);

  // console.log(profile);

  try {
    // Sets the disabled flag in the user account.
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().updateUser(user.uid, {
      disabled: true,
    });

    // Sets the disabled flag in the user profile document.
    const docRef = admin.firestore().collection('users').doc(user.uid);
    await docRef.update({ disabled: true });

    // Send an email notifying the usser of thi acttion.
    admin
      .firestore()
      .collection('mail')
      .add({
        to: email,
        message: {
          subject: 'Skriptag | Account Disabled.',
          html: `
          <div itemscope="" itemtype="https://skriptag.com">
            <meta itemprop="name" content="Skriptag Support">
            <meta itemprop="logo" content="https://media.skriptag.com/favt-slim.png">
          </div>
          <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
           <tr>
            <td style="width:260px;padding:0;vertical-align:top;">
            <p>Hello,</p>
              <p>Your account ${email} is now disabled. </p>
              <p>If you need assistance reply to this email and we'll get back to you asap.</a></p>
              <p>Thanks,</p>
              <p>Your skriptag team</p>
            </td>
            </tr>
         </table>`,
        },
      });

    return {
      disabled: true,
    };
  } catch (ex) {
    return { message: `Error!  ${ex.message}` };
  }
});

exports.enableUserByEmail = functions.region('europe-west1').https.onCall(async (email) => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    const id = user.uid;

    await admin.auth().updateUser(id, {
      disabled: false,
    });

    // Send an email notifying the user.
    // Trigger Email extension.
    admin
      .firestore()
      .collection('mail')
      .add({
        to: email,
        message: {
          subject: 'Skriptag | Account Enabled ',
          html: `
          <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
           <tr>
            <td style="width:260px;padding:0;vertical-align:top;">
            <p>Hello,</p>
              <p>Your account ${email} is now enabled. </p>
              <p>Click here to <a href="https://skriptag.com/login">Login</a></p>
              <p>Thanks,</p>
              <p>Your skriptag team</p>
            </td>
            </tr>
         </table>`,
        },
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

exports.deleteUserByEmail = functions.region('europe-west1').https.onCall(async (email) => {
  try {
    const user = await admin.auth().getUserByEmail(email);
    const id = user.uid;

    await admin.auth().deleteUser(id);

    // Send an email notifying the user.
    // Trigger Email extension.
    admin
      .firestore()
      .collection('mail')
      .add({
        to: email,
        message: {
          subject: 'Skriptag | Account Removed.',
          html: `
          <table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
           <tr>
            <td style="width:260px;padding:0;vertical-align:top;">
            <p>Hello,</p>
              <p>Your account ${email} is now removed from our records.</p>
              <p>If you need assistance reply to this email and we'll get back to you asap.</a></p>
              <p>Thanks,</p>
              <p>Your skriptag team</p>
            </td>
            </tr>
         </table>`,
        },
      });

    // The Delete User Data extension will take some seconds
    // before deleting the user document, this will visually
    // accelerate that, since a computed propery will ignore removed === true
    const docRef = admin.firestore().doc(`users/${id}`);
    await docRef.update({ removed: true });

    return {
      removed: true,
    };
  } catch (ex) {
    return { message: `Error!  ${ex.message}` };
  }
});

exports.chageUserPasswordByEmail = functions.region('europe-west1').https.onCall(async ({ payload }) => {
  try {
    const { email, password } = payload;
    const user = await admin.auth().getUserByEmail(email);

    await admin.auth().updateUser(user.uid, {
      password,
    });

    return {
      changed: true,
    };
  } catch (ex) {
    return { message: `Error!  ${ex.message}` };
  }
});
