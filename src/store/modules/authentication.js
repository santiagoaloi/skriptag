// Utilities
import { make } from 'vuex-pathify';
import { isEmpty, capitalize, startCase } from 'lodash';
import { httpsCallable } from 'firebase/functions';
import {
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
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
  GithubAuthProvider,
  setPersistence,
  browserSessionPersistence,
} from '@firebase/auth';
import { route } from '@/utils/route';
import { auth, db, functions } from '@/firebase/firebase';
import { store } from '@/store';
import router from '@/router';

const state = {
  user: {},
  profile: {},
  roles: [],
  users: [],
  capabilities: [],
  showresendEmailVerification: false,
  response: '',
  isSessionPersisted: true,
  unSubscriveProfile: undefined,
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

  // Admin SDK, verifies the user email via verificaion link.
  async findUserByEmailAndVerify({ dispatch }, email) {
    const veriyUser = httpsCallable(functions, 'verifiyUserByEmail');
    const result = await veriyUser(email);

    if (!result.data.verified) return;

    dispatch('snackbar/snackbarSuccess', `Your account ${email} is now verified.`, { root: true });
    store.set('loaders/verificationInProgressLoader', false);
  },

  // Admin SDK, disable any account matching the email.
  async disableAccountByEmail({ dispatch }, email) {
    try {
      const disableAccount = httpsCallable(functions, 'disableUserByEmail');
      const result = await disableAccount(email);

      if (!result.data.disabled) return;

      return {
        disabled: true,
      };
    } catch ({ ...error }) {
      dispatch('errors/authMessagesSnackbar', error.code, { root: true });
    }
  },

  // Admin SDK, enable any account matching the email.
  async enableAccountByEmail({ dispatch }, email) {
    try {
      const enableAccount = httpsCallable(functions, 'enableUserByEmail');
      const result = await enableAccount(email);

      if (!result.data.enabled) return;

      return {
        enabled: true,
      };
    } catch ({ ...error }) {
      dispatch('errors/authMessagesSnackbar', error.code, { root: true });
    }
  },

  // Admin SDK, remove any account matching the email.
  async deleteAccountByEmail({ dispatch }, email) {
    try {
      const deleteAccount = httpsCallable(functions, 'deleteUserByEmail');
      const result = await deleteAccount(email);

      if (!result.data.removed) return;
      return {
        removed: true,
      };
    } catch ({ ...error }) {
      dispatch('errors/authMessagesSnackbar', error.code, { root: true });
    }
  },

  async unlinkProfileImage({ getters }) {
    try {
      const profile = doc(db, 'users', getters.userId);

      await updateDoc(profile, {
        photoURL: '',
      });

      return {
        saved: true,
      };
    } catch ({ ...error }) {
      return {
        saved: false,
      };
    }
  },

  // Admin SDK, change account password { email, password }
  async changeUserPasswordByEmail({ dispatch }, { payload }) {
    try {
      const changePassword = httpsCallable(functions, 'changeUserPasswordByEmail');
      const result = await changePassword({ payload });

      if (!result.data.changed) return;

      return {
        changed: true,
      };
    } catch ({ ...error }) {
      dispatch('errors/authMessagesSnackbar', error.code, { root: true });
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
      await router.push('login');
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

      await router.push('login');
      store.set('loaders/authLoader', false);
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
    try {
      const profile = doc(db, 'users', getters.userId);

      await updateDoc(profile, {
        ...state.profile,
      });

      return {
        saved: true,
      };
    } catch ({ ...error }) {
      return {
        saved: false,
      };
    }
  },

  // Login user account, load user profile object and route to profile page.
  async login({ dispatch, state }, loginForm) {
    store.set('loaders/authLoader', true);
    const { email, password } = loginForm;

    try {
      // Do not persist the user session if the tab or browser is closed.
      if (!state.isSessionPersisted) {
        await setPersistence(auth, browserSessionPersistence);
      }

      await signInWithEmailAndPassword(auth, email, password);
      await router.push('profile');

      store.set('loaders/authLoader', false);
    } catch ({ ...error }) {
      dispatch('errors/authMessagesSnackbar', error.code, { root: true });
      store.set('loaders/authLoader', false);
    }
  },

  // Logout and clear user data objects in Vuex.
  async logout() {
    route('/');
    await signOut(auth);
  },

  // Creates a new user account and routes to profile page.
  async signup({ dispatch }, signupForm) {
    store.set('loaders/signupLoader', true);

    const { email, password } = signupForm;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const { user } = userCredential;

      await dispatch('addUserToUsersCollection', { user, signupForm });
      await sendEmailVerification(userCredential.user);

      router.push('profile');
      store.set('loaders/signupLoader', false);
    } catch ({ ...error }) {
      dispatch('errors/authMessagesSnackbar', error.code, { root: true });
      store.set('loaders/signupLoader', false);
    }
  },

  // Creates user profile.
  async addUserToUsersCollection(_, { user, signupForm }) {
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
      disabled: false,
      verified: false,
      roles: [],
    };

    // SetDoc (Firestore, Payload)
    // creates the user profile in the db collection.
    await setDoc(userDocRef, userDocData);
  },

  // If the google account has not profile docuemnt, it creates it.
  async addUserToUsersCollectionGgoogle(_, { user }) {
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
      photoURL,
      coverAvatar: '',
      disabled: false,
      verified: true,
      roles: [],
    };

    // SetDoc (Firestore, Payload)
    // creates the user profile in the db collection.

    try {
      await setDoc(userDocRef, userDocData);
      return {
        created: true,
      };
    } catch ({ ...error }) {
      return {
        created: false,
      };
    }
  },

  // Creates a new user account on first login or else login
  // the existing account, route to user profile on succesful login.
  async authenticateWithGoogle({ dispatch }) {
    store.set('loaders/signInWithGoogle', true);

    try {
      const provider = new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: 'consent',
        display: 'popup',
      });

      const userCredential = await signInWithPopup(auth, provider);

      console.log(userCredential);

      const { user } = userCredential;

      // Don't re-create the user profile, if the the user
      // already has a profile doc already.
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const profile = await dispatch('addUserToUsersCollectionGgoogle', { user });
        if (!profile.created) {
          dispatch('snackbar/snackbarError', `Something went wrong while creating the account profile.`, { root: true });
          return;
        }
      }

      route('/profile');

      store.set('loaders/signInWithGoogle', false);
    } catch ({ ...error }) {
      store.set('loaders/signInWithGoogle', false);

      if (error.code === 'auth/account-exists-with-different-credential') {
        const currentProvider = error.customData._tokenResponse.verifiedProvider[0];
        dispatch('snackbar/snackbarError', `This account is being used to authenticate with ${currentProvider}`, { root: true });
        return;
      }

      dispatch('snackbar/snackbarError', `Something went wrong authenticating`, { root: true });
    }
  },

  // Creates a new user account on first login or else login
  // the existing account, route to user profile on succesful login.
  async authenticateWithGithub({ dispatch }) {
    store.set('loaders/signInWithGithub', true);

    try {
      const provider = new GithubAuthProvider();

      const userCredential = await signInWithPopup(auth, provider);
      const { user } = userCredential;

      // Don't re-create the user profile, if the the user
      // already has a profile doc already.
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        const profile = await dispatch('addUserToUsersCollectionGgoogle', { user });
        if (!profile.created) {
          dispatch('snackbar/snackbarError', `Something went wrong while creating the account profile.`, { root: true });
          return;
        }
      }

      route('/profile');

      store.set('loaders/signInWithGithub', false);
    } catch ({ ...error }) {
      store.set('loaders/signInWithGithub', false);

      if (error.code === 'auth/account-exists-with-different-credential') {
        const currentProvider = error.customData._tokenResponse.verifiedProvider[0];
        dispatch(
          'snackbar/snackbarError',
          `This account is being used to authenticate with ${currentProvider}
           - Sign-in with ${currentProvider} and link your account with GitHub in your account settings. `,
          { root: true },
        );
        return;
      }

      dispatch('snackbar/snackbarError', `Something went wrong authenticating`, { root: true });
    }
  },

  // Validates current user password, if validated
  // returns the user object.
  async reAuthenticate(_, password) {
    const credential = EmailAuthProvider.credential(auth.currentUser.email, password);
    const authenticated = await reauthenticateWithCredential(auth.currentUser, credential);

    return authenticated.user || {};
  },

  // Assigns a role to a seletred user.
  async assignRolesToUser(_, payload) {
    try {
      const { uid, roles } = payload;

      const profile = doc(db, 'users', uid);
      await updateDoc(profile, {
        roles,
      });

      return {
        assigned: true,
      };
    } catch ({ ...error }) {
      return {
        assigned: false,
      };
    }
  },

  // Creates a new role.
  async addRole(_, { role }) {
    try {
      const { name, description, capabilities } = role;
      const colRef = collection(db, 'roles');

      // Add a new document with a generated id.
      await addDoc(colRef, {
        name: name.trim(),
        // alias: name.trim(),
        description,
        capabilities: (capabilities || []).filter((c) => c !== ''), // No empty values
      });

      return {
        added: true,
      };
    } catch ({ ...error }) {
      return {
        added: false,
      };
    }
  },

  //  Removes a selected role.
  async removeRole(_, role) {
    const collRef = collection(db, 'roles');
    const q = query(collRef, where('name', '==', role));

    const querySnap = await getDocs(q);
    const docSnap = querySnap.docs[0];
    const docRef = docSnap.ref;

    try {
      await deleteDoc(docRef);
      return {
        removed: true,
      };
    } catch ({ ...error }) {
      return {
        removed: false,
      };
    }
  },

  //  Edits a selected role.
  async editRole(_, role) {
    const { capabilities } = role;
    const collRef = collection(db, 'roles');
    const q = query(collRef, where('name', '==', role.name));

    const querySnap = await getDocs(q);
    const docSnap = querySnap.docs[0];
    const docRef = docSnap.ref;

    try {
      await updateDoc(docRef, {
        capabilities,
      });

      return {
        edited: true,
      };
    } catch ({ ...error }) {
      return {
        edited: false,
      };
    }
  },

  //  Add a new  capability to be used in a role.
  async addCapability(_, { capability }) {
    const { name, description } = capability;
    const colRef = collection(db, 'capabilities');

    // Add a new document with a generated id.
    await addDoc(colRef, {
      name: name.trim(),
      // alias: name.trim(),
      description,
    });
  },

  //  Removes a selected capability.
  async removeCapability(_, capability) {
    const collRef = collection(db, 'capabilities');
    const q = query(collRef, where('name', '==', capability));

    const querySnap = await getDocs(q);
    const docSnap = querySnap.docs[0];
    const docRef = docSnap.ref;

    try {
      await deleteDoc(docRef);

      return {
        removed: true,
      };
    } catch (error) {}
  },

  async getUsersSnapshot({ getters }) {
    try {
      const getAllUsers = httpsCallable(functions, 'listAllUsers');
      const accounts = await getAllUsers({
        allowed: getters.isRoot,
      });
      const allUsers = Object.values(accounts.data) || [];

      const colRefUsers = collection(db, 'users');

      const users = [];
      const u = onSnapshot(colRefUsers, { includeMetadataChanges: true }, (snap) => {
        const userMap = new Map(allUsers.map((u) => [u.uid, u]));

        snap.docChanges().forEach(({ doc, type }) => {
          const profile = doc.data();

          // Merge authUser with User profile and add hover key, used for table row hover buttons.
          const profileCombined = { ...profile, authUser: userMap.get(profile.uid) || {}, hover: false };

          if (type === 'modified') {
            const index = users.findIndex((user) => user.uid === doc.id);
            store.set(`authentication/users@${index}`, profileCombined);
            return;
          }

          if (type === 'added') {
            users.push(profileCombined);
          }
        });
      });

      store.set('authentication/users', users);
      return u;
    } catch ({ ...error }) {
      // console.log(error.code);
    }
  },
};

const getters = {
  // Checks if the user is authenticated.

  isLoggedIn: (_state) => !isEmpty(_state.user),

  isAccountDisabled: (_, _getters) => {
    if (!_getters.isLoggedIn && !_getters.profile) return;
    return _getters.profile?.disabled;
  },

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

  userId: (_state, _getters) => {
    if (!_getters.isLoggedIn) return;
    return _state.user?.uid;
  },

  isProfileLoaded: (_, _getters) => {
    if (!_getters.isLoggedIn) return;
    return !isEmpty(_getters.profile);
  },

  isAuthLoaded: (_state) => !isEmpty(_state.user),

  userEmail: (_, _getters) => {
    if (!_getters.isLoggedIn) return;
    return _getters.profile?.email;
  },

  verified: (_state, _getters) => {
    if (!_getters.isLoggedIn) return;
    // return _state.profile?.verified || _getters.isAuthExternalProvider;
    return _state.profile?.verified;
  },

  authProviders: (_state, _getters) => {
    if (!_getters.isLoggedIn) return;
    return _state.user.providerData.flatMap((profile) => profile.providerId);
  },

  isAuthExternalProvider: (_state, _getters) => {
    if (_getters.isLoggedIn) return _state.user.providerData[0].providerId !== 'password';
  },

  profile: (_state) => {
    if (isEmpty(_state.profile)) return;
    return { metadata: _state.user?.metadata, ..._state.profile };
  },

  profileRoles: (_, _getters) => {
    if (!_getters.isLoggedIn && !_getters.profile) return;
    return [..._getters.profile?.roles];
  },

  isRoot: (_, _getters) => {
    if (!_getters.isLoggedIn) return;
    return _getters.profileRoles.includes('root');
  },

  // Shows first name and first letter of last name.
  firstAndShortLast: (_, _getters) => {
    if (!_getters.profile?.name && !_getters.profile?.lastName) return;

    const name = startCase(capitalize(_getters.profile.name));
    const lastName = startCase(capitalize(_getters.profile.lastName));
    return name && lastName ? `${name} ${lastName[0]}.` : `${name}`;
  },

  // Capitalize the first letter of every word.
  fullName: (_, _getters) => {
    if (!_getters.profile?.name && !_getters.profile?.lastName) return;

    const name = startCase(capitalize(_getters.profile.name));
    const lastName = startCase(capitalize(_getters.profile.lastName));
    return `${name} ${lastName}`;
  },

  // returns current user last login date/time.
  allRoles: (_state) => _state.roles.flatMap((role) => role.name),
  lastLogin: (_state) => _state.user?.metadata?.lastSignInTime,
  allCapabilities: (_state) => _state.capabilities.flatMap((c) => c.name),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
