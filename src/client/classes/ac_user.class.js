/*
 * /src/client/classes/ac_user.class.js
 *
 * This class manages the interface with the currently logged-in user.
 * A singleton is attached to the global 'pwiAccounts' object.
 */
import { Accounts } from 'meteor/accounts-base';
import { Tracker } from 'meteor/tracker';

import printf from 'printf';

import { pwixI18n as i18n } from 'meteor/pwix:i18n';
import { tlTolert } from 'meteor/pwix:tolert';

export class acUser {

    // static data
    //

    static Singleton = null;

    // static methods
    //

    // private data
    //

    // maintains a LOGGED/UNLOGGED status
    //  is expected to be exactly consistant with Meteor.user() but adds a (very) thin conceptualization level
    _state = {
        dep: null,
        value: null
    }

    // private methods
    //

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

    // public data
    //

    // public methods
    //

    /**
     * Constructor
     * @returns {acUser}
     */
    constructor(){
        if( acUser.Singleton ){
            console.log( 'pwix:accounts returning already instanciated acUser' );
            return acUser.Singleton;
        }

        //console.log( 'pwix:accounts instanciating new acUser' );

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
                target.trigger( 'ac-display-error', i18n.label( AC_I18N, 'user.changepwd_error' ));
            } else {
                tlTolert.success( i18n.label( AC_I18N, 'user.changepwd_success' ));
                target.trigger( 'ac-user-changedpwd-event', { email: self.emailAddress()});
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
                    target.trigger( 'ac-display-error', i18n.label( AC_I18N, 'user.signup_error' ));
                } else {
                    //self.state( AC_LOGGED );
                    delete options.password;
                    target.trigger( 'ac-user-created-event', options );
                }
            });
        } else {
            Meteor.call( 'pwiAccounts.createUser', options, ( err, res ) => {
                if( err ){
                    console.error( err );
                    target.trigger( 'ac-display-error', i18n.label( AC_I18N, 'user.signup_error' ));
                } else {
                    tlTolert.success( i18n.label( AC_I18N, 'user.signup_success', options.email || options.username ));
                    delete options.password;
                    target.trigger( 'ac-user-created-event', options );
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
                target.trigger( 'ac-display-error', i18n.label( AC_I18N, 'user.signin_error' ));
            } else {
                target.trigger( 'ac-user-signedin-event', { userid: userid });
            }
        });
    }

    /**
     * Logout
     * @param {Object} target the target of the sent events
     */
    logout( target ){
        const email = this.emailAddress();
        Meteor.logout();
        target.trigger( 'ac-user-signedout-event', { email: email });
    }

    /**
     * @returns {Boolean} whether the (first) mail address is verified
     */
    mailVerified(){
        return Meteor.user() ? Meteor.user().emails[0].verified : false;
    }

    /**
     * Send a mail to let the user reset his/her password
     * @param {String} email the entered mail address
     * @param {Object} target the target of the sent events
     */
    resetPwd( email, target ){
        const self = this;
        Accounts.forgotPassword({ email: email }, ( err ) => {
            if( err ){
                console.error( err );
                target.trigger( 'ac-display-error', i18n.label( AC_I18N, 'user.resetask_error' ));
            } else {
                tlTolert.success( i18n.label( AC_I18N, 'user.resetask_success' ));
                target.trigger( 'ac-user-resetasked-event', { email: email });
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
     * @param {Object} target the target of the sent events
     */
    verifyMail( target ){
        const self = this;
        Meteor.callPromise( 'pwiAccounts.sendVerificationEmail', Meteor.userId())
            .then(( result ) => {
                if( result ){
                    tlTolert.success( i18n.label( AC_I18N, 'user.verifyask_success' ));
                    target.trigger( 'ac-user-verifyasked-event', { email: self.emailAddress()});
                } else {
                    tlTolert.error( i18n.label( AC_I18N, 'user.verifyask_error' ));
                }
            });
    }
}
