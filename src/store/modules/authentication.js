// Utilities
import { make } from 'vuex-pathify';
import { isEmpty, capitalize, startCase } from 'lodash';
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  deleteUser,
  updatePassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  confirmPasswordReset,
  applyActionCode,
} from '@firebase/auth';
import { auth, db } from '@/firebase/firebase';
import { store } from '@/store';
import router from '@/router';

const state = {
  user: {},
  profile: {},
  showResendActivationEmail: false,
  removeAccountDialog: false,
  verifyAccountDialog: false,
};

const mutations = make.mutations(state);
const actions = {
  ...make.actions(state),

  // Generates a password recovery email.
  async accountEmailVerification({ dispatch, state, getters }, code) {
    try {
      if (getters.isLoggedIn && !getters.verified) {
        await applyActionCode(auth, code);

        // reloads user object to reflect emailVerified value as true.
        state.user.reload();

        router.push('login');
        dispatch('snackbar/snackbarSuccess', 'Your account is now verified', {
          root: true,
        });
        return;
      }

      if (!getters.isLoggedIn) {
        await applyActionCode(auth, code);

        // reloads user object to reflect emailVerified value as true.
        // state.user.reload();

        router.push('login');
        dispatch('snackbar/snackbarSuccess', 'Your account is now verified', {
          root: true,
        });
        return;
      }

      dispatch('snackbar/snackbarSuccess', 'Your account is already verified.', {
        root: true,
      });
    } catch ({ ...error }) {
      router.push('login');
      dispatch('errors/authMessagesSnackbar', error.code, { root: true });
    }
  },

  // Generates a password recovery email.
  async accountRecovery({ dispatch }, email) {
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
      ...state.profile,
    });
  },

  // Logout and clear user data objects in Vuex.
  async logout({}) {
    await signOut(auth);
    store.set('authentication/user', {});
    store.set('authentication/profile', {});
    router.push('login');
  },

  // Removes the account and then routes the user to the homepage.
  async removeAccount({ dispatch }, password) {
    try {
      store.set('loaders/removeAccountLoader', true);
      const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
      const authenticated = await reauthenticateWithCredential(auth.currentUser, credential);

      // Pass authenticated.user for deletion.
      await deleteUser(authenticated.user);

      store.set('authentication/user', {});
      store.set('authentication/profile', {});
      dispatch('snackbar/snackbarSuccess', 'Account removed, Hope to see you again soon 💚', { root: true });
      router.push('/');
      store.set('loaders/removeAccountLoader', false);
    } catch ({ ...error }) {
      store.set('loaders/removeAccountLoader', false);
      // dispatch('snackbar/snackbarError', 'Incorrect password, try again', { root: true });
    }
  },

  // Creates a new user account and routes to profile page.
  async signup({ dispatch }, signupForm) {
    store.set('loaders/signupLoader', true);
    const { email, password } = signupForm;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const { user } = userCredential;

      // Adds a document in a  firestore collection.
      // doc (Firestore instance, collection name, collection id).
      const userDocRef = doc(db, 'users', user.uid);

      // User profile fields to be created in db (payload)
      const userDocData = {
        uid: user.uid,
        email,
        name: signupForm.name,
        lastName: signupForm.lastName,
        avatar: '',
        coverAvatar: '',
        dateCreated: serverTimestamp(),
      };

      // SetDoc (Firestore, Payload)
      // creates the user profile in the db collection.
      setDoc(userDocRef, userDocData);

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

  // Login user account, load user profile object and route to profile page.
  async login({ dispatch }, loginForm) {
    store.set('loaders/authLoader', true);
    const { email, password } = loginForm;
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      const { user } = userCredential;

      store.set('authentication/user', user);
      store.set('loaders/authLoader', false);
      router.push('profile');
    } catch ({ ...error }) {
      dispatch('errors/authMessagesSnackbar', error.code, { root: true });
      store.set('loaders/authLoader', false);
    }
  },

  // Re-sends the account activation email.
  async resendActivationEmail({ dispatch, getters }, password) {
    store.set('loaders/verifyLoader', true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, getters.userEmail, password);

      await sendEmailVerification(userCredential.user);
      store.set('loaders/verifyLoader', false);
      store.set('authentication/verifyAccountDialog', false);

      dispatch('snackbar/snackbarSuccess', 'We sent you an email to activate your account.', { root: true });
      return;
    } catch ({ ...error }) {
      dispatch('errors/authMessagesSnackbar', error.code, { root: true });
      store.set('loaders/verifyLoader', false);
    }
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

  userEmail: (state, getters) => {
    if (getters.isLoggedIn) return state.user?.email;
  },

  verified: (state, getters) => {
    if (getters.isLoggedIn) return state.user?.emailVerified;
  },

  // Capitalize the first letter of every word.
  fullName: (state) => {
    if (state.profile) {
      const name = startCase(capitalize(state.profile.name));
      const lastName = startCase(capitalize(state.profile.lastName));
      return `${name} ${lastName} `;
    }
  },

  // Shows first name and first letter of last name.
  firstAndShortLast: (state) => {
    if (state.profile) {
      const name = startCase(capitalize(state.profile.name));
      const lastName = startCase(capitalize(state.profile.lastName));
      return name && lastName ? `${name} ${lastName[0]}.` : `${name}`;
    }
  },

  // returns current user last login date/time.
  lastLogin: (state) => state.user?.metadata?.lastSignInTime,

  avatar: (state) => state.profile?.avatar,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
