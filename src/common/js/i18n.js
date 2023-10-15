/*
 * pwix:accounts-ui/src/common/js/i18n.js
 */

import { pwixI18n } from 'meteor/pwix:i18n';

import '../i18n/en.js';
pwixI18n.namespace( I18N, 'en', AccountsUI.i18n.en );

import '../i18n/fr.js';
pwixI18n.namespace( I18N, 'fr', AccountsUI.i18n.fr );

AccountsUI.i18n.namespace = function(){
    return I18N;
};
