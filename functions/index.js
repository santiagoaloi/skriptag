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

    // Send an email notifying the user.
    // Trigger Email extension.
    admin
      .firestore()
      .collection('mail')
      .add({
        to: email,
        message: {
          subject: 'Skriptag | Account Disabled ',
          html: 'Hi, </br> Your account has been disasbled. Please contact us or reply to this email if you need assistance.',
        },
      });

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

    // Send an email notifying the user.
    // Trigger Email extension.
    admin
      .firestore()
      .collection('mail')
      .add({
        to: email,
        message: {
          subject: 'Skriptag | Account Enabled ',
          html: `<table role="presentation" style="width:100%;border-collapse:collapse;border:0;border-spacing:0;">
           <tr>
        <td style="width:260px;padding:0;vertical-align:top;">
            <p>Your account ${email} is now enabled. </p>
            <p><a href="https://skriptag.com/login">Login</a></p>
        </td>
        <td style="width:20px;padding:0;font-size:0;line-height:0;">&nbsp;</td>
        <td style="width:260px;padding:0;vertical-align:top;">
            <p>Morbi porttitor, eget est accumsan dictum, nisi libero ultricies ipsum, in posuere mauris neque at erat. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In tempus adipiscing felis, sit amet blandit ipsum volutpat sed.</p>
            <p><a href="https://skriptag.com">Skriptag</a></p>
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

exports.chageUserPasswordByEmail = functions.https.onCall(async ({ payload }) => {
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
