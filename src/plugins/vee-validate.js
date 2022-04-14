import Vue from 'vue';
import { ValidationObserver, ValidationProvider, extend, localize } from 'vee-validate';
import en from 'vee-validate/dist/locale/en.json';
import * as rules from 'vee-validate/dist/rules';

for (const rule in rules) {
  if (Object.prototype.hasOwnProperty.call(rules, rule)) {
    extend(rule, rules[rule]);
  }
}

// Locale
localize('en', en);

// Install Modules globally
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);
