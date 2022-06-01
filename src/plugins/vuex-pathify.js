/**
 * plugins/vuex-pathify.js
 * vuex-pathify documentation: https://davestewart.github.io/vuex-pathify/#/setup/config
 */

// Imports
import pathify from 'vuex-pathify';

pathify.options.mapping = 'simple';
pathify.options.strict = true;
pathify.options.deep = 2;

export default pathify;
