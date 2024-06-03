/*
 * pwix:accounts-ui/src/client/js/user.js
 *
 * Manages here the user document.
 */

AccountsUI.User = {

    /**
     * @returns {Integer} the count of unverified email addresses for the currently logged-in user
     */
    countUnverifiedEmails(){
        const user = Meteor.user({ fields: { 'username': 1, 'emails': 1 }});
        let count = 0;
        if( user && user.emails && user.emails.length ){
            user.emails.every(( o ) => {
                if( !o.verified ){
                    count += 1;
                }
                return true;
            });
        }
        return count;
    },

    /**
     * @returns {String} the (first) mail address of the currently logged-in user
     */
    firstEmailAddress(){
        const user = Meteor.user({ fields: { 'username': 1, 'emails': 1 }});
        const email = user && user.emails && user.emails.length ? user.emails[0].address : '';
        return email;
    },

    /**
     * @returns {String} the username of the currently logged-in user
     */
    username(){
        const user = Meteor.user({ fields: { 'username': 1, 'emails': 1 }});
        return user ? user.username : '';
    }
};
