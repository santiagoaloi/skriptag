// Utilities
import { make } from 'vuex-pathify';
import { isEmpty, capitalize, startCase } from 'lodash';
import { httpsCallable } from 'firebase/functions';

import { doc, addDoc, setDoc, updateDoc, collection, serverTimestamp, getDoc } from 'firebase/firestore';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updatePassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  confirmPasswordReset,
  applyActionCode,
  checkActionCode,
  signInWithPopup,
  GoogleAuthProvider,
} from '@firebase/auth';
import { auth, db, functions } from '@/firebase/firebase';
import { store } from '@/store';
import router from '@/router';

const state = {
  user: {},
  userProfile: {},
  showresendEmailVerification: false,
  response: '',
};

const mutations = make.mutations(state);
const actions = {
  ...make.actions(state),

  // Re-sends the account activation email.
  // This relates to the authenticated user.
  async resendEmailVerification({ state }) {
    try {
      await sendEmailVerification(state.user);
      return {
        sent: true,
      };
    } catch ({ ...error }) {}
  },

  // Admin SDK, verifies the user via verificaion link.
  async findUserByEmailAndVerify({ dispatch }, email) {
    const veriyUser = httpsCallable(functions, 'verifiyUserByEmail');
    const result = await veriyUser(email);

    if (result.data.verified) {
      dispatch('refreshProfile');
      store.set('loaders/verificationInProgressLoader', false);
    }
  },

  // Admin SDK, disable any account matching the email.
  async disableAccountByEmail({ dispatch }, email) {
    try {
      const disableAccount = httpsCallable(functions, 'disableUserByEmail');
      const result = await disableAccount(email);

      if (result.data.disabled) {
        return {
          disabled: true,
        };
      }
    } catch ({ ...error }) {
      dispatch('errors/authMessagesSnackbar', error.code, { root: true });
    }
  },

  // Admin SDK, enable any account matching the email.
  async enableAccountByEmail({ dispatch }, email) {
    try {
      const enableAccount = httpsCallable(functions, 'enableUserByEmail');
      const result = await enableAccount(email);

      if (result.data.enabled) {
        return {
          enabled: true,
        };
      }
    } catch ({ ...error }) {
      dispatch('errors/authMessagesSnackbar', error.code, { root: true });
    }
  },

  // Admin SDK, remove any account matching the email.
  async deleteAccountByEmail({ dispatch }, email) {
    try {
      const deleteAccount = httpsCallable(functions, 'deleteUserByEmail');
      const result = await deleteAccount(email);

      if (result.data.deleted) {
        return {
          deleted: true,
        };
      }
    } catch ({ ...error }) {
      dispatch('errors/authMessagesSnackbar', error.code, { root: true });
    }
  },

  // Admin SDK, change account password { email, password}
  async chageUserPasswordByEmail({ dispatch }, { payload }) {
    try {
      const changePassword = httpsCallable(functions, 'chageUserPasswordByEmail');
      const result = await changePassword({ payload });

      if (result.data.changed) {
        return {
          changed: true,
        };
      }
    } catch ({ ...error }) {
      dispatch('errors/authMessagesSnackbar', error.code, { root: true });
    }
  },

  // Get the doc with the ID of the the authenticated user.
  async refreshProfile({ getters }) {
    const docRef = doc(db, 'users', getters.userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      store.set('authentication/userProfile', docSnap.data());
    }
  },

  //  Set the flag "verified" to the user account.
  async accountEmailVerification({ dispatch, state, getters }, code) {
    try {
      store.set('loaders/verificationInProgressLoader', true);

      const metadata = await checkActionCode(auth, code);
      await applyActionCode(auth, code);

      // Set user profile verified key to true (admin function)
      dispatch('findUserByEmailAndVerify', metadata.data.email);

      if (getters.isLoggedIn && !getters.verified) {
        // reloads user object to reflect emailVerified value as true.
        state.user.reload();
        router.push('profile');
        return;
      }

      if (!getters.isLoggedIn) {
        router.push('login');
        return;
      }

      dispatch('snackbar/snackbarSuccess', 'Your account is already verified.', {
        root: true,
      });
      store.set('loaders/verificationInProgressLoader', false);
    } catch ({ ...error }) {
      router.push('login');
      dispatch('errors/authMessagesSnackbar', error.code, { root: true });
      store.set('loaders/verificationInProgressLoader', false);
    }
  },

  // Generates a password recovery email from the login screen.
  async accountRecoveryRequest({ dispatch }, email) {
    store.set('loaders/authLoader', true);
    try {
      await sendPasswordResetEmail(auth, email);
      dispatch('snackbar/snackbarSuccess', 'Account recovery email sent.', { root: true });
      store.set('loaders/authLoader', false);
      router.push('login');
    } catch ({ ...error }) {
      dispatch('errors/authMessagesSnackbar', error.code, { root: true });
      store.set('loaders/authLoader', false);
    }
  },

  // Verification of temporary password reset token.
  // if valid, the account password will be changed.
  async accountRecoveryResetPassword({ dispatch }, { payload }) {
    const { oobCode, newPassword } = payload;
    store.set('loaders/authLoader', true);
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      dispatch('snackbar/snackbarSuccess', 'Account password changed.', { root: true });
      store.set('loaders/authLoader', false);
      router.push('login');
    } catch ({ ...error }) {
      dispatch('errors/authMessagesSnackbar', error.code, { root: true });
      store.set('loaders/authLoader', false);
    }
  },

  // Validates the current account password.
  // if valid, the account password will be changed.
  async accountResetPassword({ dispatch }, { credentials }) {
    store.set('loaders/authLoader', true);

    try {
      const credential = EmailAuthProvider.credential(auth.currentUser.email, credentials.currentPassword);
      const authenticated = await reauthenticateWithCredential(auth.currentUser, credential);

      await updatePassword(authenticated.user, credentials.newPassword);
      dispatch('snackbar/snackbarSuccess', 'Account password changed', { root: true });
      store.set('loaders/authLoader', false);
    } catch ({ ...error }) {
      dispatch('errors/authMessagesSnackbar', error.code, { root: true });
      store.set('loaders/authLoader', false);
    }
  },

  // Saves new user profile basic settings.
  async updateProfileSettings({ getters, state }) {
    const userProfile = doc(db, 'users', getters.userId);
    await updateDoc(userProfile, {
      ...state.userProfile,
    });
  },

  // Login user account, load user profile object and route to profile page.
  async login({ dispatch }, loginForm) {
    store.set('loaders/authLoader', true);
    const { email, password } = loginForm;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const { user } = userCredential;

      store.set('authentication/user', user);
      // store.set('authentication/uid', user.uid);

      store.set('loaders/authLoader', false);
      router.push('profile');
    } catch ({ ...error }) {
      dispatch('errors/authMessagesSnackbar', error.code, { root: true });
      store.set('loaders/authLoader', false);
    }
  },

  // Logout and clear user data objects in Vuex.
  async logout() {
    await signOut(auth);
    store.set('authentication/user', {});
    store.set('authentication/userProfile', {});
    router.push('/');
  },

  // Creates a new user account and routes to profile page.
  async signup({ dispatch }, signupForm) {
    store.set('loaders/signupLoader', true);

    const { email, password } = signupForm;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const { user } = userCredential;

      dispatch('addUserToUsersCollection', { user, signupForm });

      // Set user in Vuex and navigate to the new user profile.
      store.set('authentication/user', user);
      store.set('loaders/signupLoader', false);
      router.push('profile');

      await sendEmailVerification(userCredential.user);
    } catch ({ ...error }) {
      dispatch('errors/signupMessagesSnackbar', error.code, { root: true });
      store.set('loaders/signupLoader', false);
    }
  },

  // Creates user profile.
  addUserToUsersCollection(_, { user, signupForm }) {
    const { email } = signupForm;

    // Adds a document in a  firestore collection.
    // doc (Firestore instance, collection name, collection id).
    const userDocRef = doc(db, 'users', user.uid);

    // User profile fields to be created in db (payload)
    const userDocData = {
      uid: user.uid,
      email,
      name: signupForm.name.trim(),
      lastName: signupForm.lastName.trim(),
      photoURL: '',
      coverAvatar: '',
    };

    // SetDoc (Firestore, Payload)
    // creates the user profile in the db collection.
    setDoc(userDocRef, userDocData);
  },

  // Creates a new user account or login existing
  // using google credentials, and routes to profile page.
  async signupWithGoogle({ dispatch }) {
    store.set('loaders/signupLoader', true);

    try {
      const provider = new GoogleAuthProvider();

      const userCredential = await signInWithPopup(auth, provider);

      const { user } = userCredential;

      // Don't re-create the user prfofile, it the the user
      // already has a profile created.
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        dispatch('addUserToUsersCollectionGgoogle', { user });
      }

      // Set user in Vuex and navigate to the new user profile.
      store.set('authentication/user', user);
      store.set('loaders/signupLoader', false);
      router.push('profile');
    } catch ({ ...error }) {
      // dispatch('errors/signupMessagesSnackbar', error.code, { root: true });
      store.set('loaders/signupLoader', false);
    }
  },

  // If the google account has not profile docuemnt, it creates it.
  addUserToUsersCollectionGgoogle(_, { user }) {
    // Adds a document in a  firestore collection.
    // doc (Firestore instance, collection name, collection id).
    const userDocRef = doc(db, 'users', user.uid);

    const { uid, email, displayName, photoURL } = user;

    // Get an array of names
    const names = displayName.split(/(\s+)/);

    // User profile fields to be created in db (payload)
    const userDocData = {
      uid,
      email,
      // First name in the names array
      name: names[0],
      // Rest of the names in the names array
      lastName: names.slice(1).join('').trim(),
      verified: true,
      photoURL,
      coverAvatar: '',
    };

    // SetDoc (Firestore, Payload)
    // creates the user profile in the db collection.
    setDoc(userDocRef, userDocData);
  },

  // Validates current user password, if validated
  // returns the user object.
  async reAuthenticate(_, password) {
    const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
    const authenticated = await reauthenticateWithCredential(auth.currentUser, credential);

    return authenticated.user || {};
  },

  async addRole(_, { role }) {
    const { name, description } = role;
    const colRef = collection(db, 'roles');

    // Add a new document with a generated id.
    await addDoc(colRef, {
      name,
      alias: name,
      description,
    });
  },
};

const getters = {
  // Checks if the user is authenticated.

  isLoggedIn: (auth.onAuthStateChanged, (auth) => !isEmpty(auth.user)),

  getPasswordComplexity: () => (value) => {
    let progress = 0;

    // at least one number
    if (/\d/.test(value)) {
      progress += 20;
    }

    // at least one capital letter
    if (/(.*[A-Z].*)/.test(value)) {
      progress += 20;
    }

    // at least a lowercase
    if (/(.*[a-z].*)/.test(value)) {
      progress += 20;
    }

    // more than 5 digits
    if (value.length >= 6) {
      progress += 20;
    }

    // at least one special character
    if (/[^A-Za-z0-9]/.test(value)) {
      progress += 20;
    }

    return progress;
  },

  userId: (state, getters) => {
    if (getters.isLoggedIn) return state.user?.uid;
  },

  isProfileLoaded: (state, getters) => {
    if (getters.isLoggedIn) return !isEmpty(state.userProfile);
  },

  userEmail: (state, getters) => {
    if (getters.isLoggedIn) return state.user?.email;
  },

  verified: (state, getters) => {
    if (getters.isLoggedIn) return state.userProfile?.verified || getters.isAuthExternalProvider;
  },

  // Capitalize the first letter of every word.
  fullName: (state) => {
    if (state.userProfile && state.userProfile.name && state.userProfile.lastName) {
      const name = startCase(capitalize(state.userProfile.name));
      const lastName = startCase(capitalize(state.userProfile.lastName));
      return `${name} ${lastName}`;
    }
  },

  // isAuthMultiProvider: (state, getters) => {

  //   if (getters.isLoggedIn) return  state.user.providerData.some((provider) => provider.uid !== 'uid') ? 'background: #303036' : '';

  // },

  isAuthExternalProvider: (state, getters) => {
    if (getters.isLoggedIn) return state.user.providerData[0].providerId !== 'password';
  },

  authProvider: (state, getters) => {
    if (getters.isLoggedIn) return state.user.providerData[0].providerId;
  },

  profile: (state, getters) => {
    if (getters.isAuthExternalProvider) {
      return { ...state.user?.providerData[0], metadata: state.user?.metadata, ...state.userProfile };
    }
    if (!getters.isAuthExternalProvider) {
      return { metadata: state.user?.metadata, ...state.userProfile };
    }
  },

  // Shows first name and first letter of last name.
  firstAndShortLast: (state) => {
    if (state.userProfile && state.userProfile.name && state.userProfile.lastName) {
      const name = startCase(capitalize(state.userProfile.name));
      const lastName = startCase(capitalize(state.userProfile.lastName));
      return name && lastName ? `${name} ${lastName[0]}.` : `${name}`;
    }
  },

  // returns current user last login date/time.
  lastLogin: (state) => state.user?.metadata?.lastSignInTime,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
