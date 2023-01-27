/*
 * /src/client/classes/ac_user.class.js
 *
 * This class manages the interface with the currently logged-in user.
 * A singleton is attached to the global 'pwiAccounts' object.
 */
import { Accounts } from 'meteor/accounts-base';
import { Tracker } from 'meteor/tracker';

import printf from 'printf';

import { pwiI18n } from 'meteor/pwi:i18n';
import { pwiTolert } from 'meteor/pwi:tolert';

export class acUser {

    // private data
    static Singleton = null;

    // maintains a LOGGED/UNLOGGED status
    //  is expected to be exactly consistant with Meteor.user() but adds a (very) thin conceptualization level
    _state = {
        dep: null,
        value: null
    }

    // private functions
    /*
     * Setter only
     * @param {String} state the new logged-in status
     * @returns {String} the logged-in status as AC_LOGGED or AC_UNLOGGED
     * A reactive data source
     */
    _stateSet( state ){
        if( !this._state.dep ){
            this._state.dep = new Tracker.Dependency();
        }
        if( state && ( state === AC_LOGGED || state === AC_UNLOGGED ) && state !== this._state.value ){
            this._state.value = state;
            this._state.dep.changed();
        }
        return this._state.value;
    }

    //public data

    /**
     * Constructor
     * @returns {acUser}
     */
    constructor(){
        if( acUser.Singleton ){
            console.log( 'pwix:accounts returning already instanciated acUser' );
            return acUser.Singleton;
        }

        console.log( 'pwix:accounts instanciating new acUser' );

        Tracker.autorun(() => {
            this._stateSet( Meteor.userId() ? AC_LOGGED : AC_UNLOGGED );
        });

        acUser.Singleton = this;
        return this;
    }

    /**
     * Change the user's password
     * @param {String} oldpwd the current password
     * @param {String} newpwd the new password to be set
     * @param {Object} target the target of the sent events
     */
    changePwd( oldpwd, newpwd, target ){
        const self = this;
        Accounts.changePassword( oldpwd, newpwd, ( err ) => {
            if( err ){
                console.error( err );
                target.trigger( 'ac-display-error', pwiI18n.label( pwiAccounts.strings, 'user', 'changepwd_error' ));
            } else {
                pwiAccounts.Panel.asked( AC_PANEL_NONE );
                pwiTolert.success( pwiI18n.label( pwiAccounts.strings, 'user', 'changepwd_success' ));
                $( '.acUserLogin' ).trigger( 'ac-user-changepwd', self.emailAddress());
            }
        });
    }

    /**
     * Create a new user with a (mail,password) couple
     * Change the connection state to 'LOGGED' if OK, or send an 'ac-error' message to the target
     * We try to verify emails, so send simultaneouly (in the background) an email to check that.
     * Note that the 'Accounts.createUser()' method doesn't force any security rule on the password.
     * We have to rely on pwiAccounts.fn.validatePassword() for that.
     * @param {Object} options as expected by Accounts.createUser
     * @param {Object} target the target of the sent events
     * @param {Boolean} autoConnect whether to automatically login the newly created user
     */
    createUser( options, target, autoConnect=true ){
        const self = this;
        console.log( options, 'autoConnect='+autoConnect );
        if( autoConnect ){
            Accounts.createUser( options, ( err ) => {
                if( err ){
                    console.error( err );
                    target.trigger( 'ac-display-error', pwiI18n.label( pwiAccounts.strings, 'user', 'signup_error' ));
                } else {
                    //self.state( AC_LOGGED );
                    pwiAccounts.Panel.asked( AC_PANEL_NONE );
                    $( '.acUserLogin' ).trigger( 'ac-user-create', options.email );
                }
            });
        } else {
            Meteor.call( 'pwiAccounts.createUser', options, ( err, res ) => {
                if( err ){
                    console.error( err );
                    target.trigger( 'ac-display-error', pwiI18n.label( pwiAccounts.strings, 'user', 'signup_error' ));
                } else {
                    pwiTolert.success( printf( pwiI18n.label( pwiAccounts.strings, 'user', 'signup_success' ), options.email || options.username ));
                    $( '.acUserLogin' ).trigger( 'ac-user-create', options );
                }
            });
        }
    }

    /**
     * @returns {String} the (first) mail address of the currently logged-in user
     */
    emailAddress(){
        const user = Meteor.user({ fields: { 'username': 1, 'emails': 1 }});
        const email = user ? user.emails[0].address : '';
        return email;
    }

    /**
     * Login with a (mail,password) couple
     * Change the connection state to 'LOGGED' if OK, or send an 'ac-error' message to the target
     * @param {String} userid the entered username or mail address
     * @param {String} password the entered password
     * @param {Object} target the target of the sent events
     */
    loginWithPassword( userid, password, target ){
        const self = this;
        Meteor.loginWithPassword( userid, password, ( err ) => {
            if( err ){
                console.error( err );
                target.trigger( 'ac-display-error', pwiI18n.label( pwiAccounts.strings, 'user', 'signin_error' ));
            } else {
                //self.state( AC_LOGGED );
                pwiAccounts.Panel.asked( AC_PANEL_NONE );
                $( '.acUserLogin' ).trigger( 'ac-user-login', userid );
            }
        });
    }

    /**
     * Logout
     */
    logout(){
        const email = this.emailAddress();
        Meteor.logout();
        //this.state( AC_UNLOGGED );
        pwiAccounts.Panel.asked( AC_PANEL_NONE );
        $( '.acUserLogin' ).trigger( 'ac-user-logout', email );
    }

    /**
     * @returns {Boolean} whether the (first) mail address is verified
     */
    mailVerified(){
        return Meteor.user() ? Meteor.user().emails[0].verified : false;
    }

    /**
     * Send a mail to let the user reset his/her password
     * @param {String} mail the entered mail address
     * @param {Object} target the target of the sent events
     */
    resetPwd( mail, target ){
        const self = this;
        Accounts.forgotPassword({ email: mail }, ( err ) => {
            if( err ){
                console.error( err );
                target.trigger( 'ac-display-error', pwiI18n.label( pwiAccounts.strings, 'user', 'resetask_error' ));
            } else {
                pwiAccounts.Panel.asked( AC_PANEL_NONE );
                pwiTolert.success( pwiI18n.label( pwiAccounts.strings, 'user', 'resetask_success' ));
                $( '.acUserLogin' ).trigger( 'ac-user-resetasked', mail );
            }
        });
    }

    /**
     * Getter only
     * @param {String} state the new logged-in status
     * @returns {String} the logged-in status as AC_LOGGED or AC_UNLOGGED
     * A reactive data source
     */
    state(){
        this._state.dep.depend();
        return this._state.value;
    }

    /**
     * @returns {String} the username of the currently logged-in user
     */
    username(){
        const user = Meteor.user({ fields: { 'username': 1, 'emails': 1 }});
        return user ? user.username : '';
    }

    /**
     * Re-send a mail to let us verify the user's email
     */
    verifyMail(){
        const self = this;
        Meteor.callPromise( 'pwiAccounts.sendVerificationEmail', Meteor.userId())
            .then(( result ) => {
                if( result ){
                    pwiTolert.success( pwiI18n.label( pwiAccounts.strings, 'user', 'verifyask_success' ));
                    $( '.acUserLogin' ).trigger( 'ac-user-verifyasked', self.emailAddress());
                } else {
                    pwiTolert.error( pwiI18n.label( pwiAccounts.strings, 'user', 'verifyask_error' ));
                }
                pwiAccounts.Panel.asked( AC_PANEL_NONE );
            });
    }
}
