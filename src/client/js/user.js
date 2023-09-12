/*
 * pwix:accounts-ui/src/client/js/user.js
 *
 * Manages here the user document.
 */

AccountsUI.User = {

    /**
     * @returns {String} the (first) mail address of the currently logged-in user
     */
    emailAddress(){
        const user = Meteor.user({ fields: { 'username': 1, 'emails': 1 }});
        const email = user ? user.emails[0].address : '';
        return email;
    },

    /**
     * @returns {Boolean} whether the (first) mail address is verified
     */
    emailIsVerified(){
        return Meteor.user() ? Meteor.user().emails[0].verified : false;
    },

    /**
     * @returns {String} the username of the currently logged-in user
     */
    username(){
        const user = Meteor.user({ fields: { 'username': 1, 'emails': 1 }});
        return user ? user.username : '';
    }
};
