/*
 * pwix:accounts/src/client/components/acSelect/acSelect.js
 *
 * Let some users to be selected
 * 
 * Parms:
 * 
 *  - selection     an input/output ReactiveVar which contains an array of objects { id: <id> }
 * 
 *  - text          (opt)
 *                  a ReactiveVar which may contain some (HTML compliant) text to be displayed
 *                  before the list of users
 *                  defaults to none
 * 
 *  - preferred     AC_USERNAME|AC_EMAIL_ADDRESS
 *                  defaulting to AC_EMAIL_ADDRESS (or the one which is configured)
 */

import { pwixI18n as i18n } from 'meteor/pwix:i18n';

import { v4 as uuidv4 } from 'uuid';

import '../../stylesheets/ac_accounts.less';

import './acSelect.html';

Template.acSelect.onCreated( function(){
    const self = this;

    self.AC = {
        // have a single identifier for this instance
        uuid: uuidv4(),

        // a hash parallely maintained to ease the updates
        //  contains the selected id's
        hash: new ReactiveVar( {} ),

        // users are stored here (hash by _id)
        users: {},

        // subscribe to our publication
        handle: self.subscribe( 'pwiAccounts.byEmail' ),

        // get a translated label
        i18n( label ){
            return i18n.label( AC_I18N, 'select.'+label );
        },

        // update the input selection reactive var on each change
        hash2selection(){
            let array = [];
            Object.keys( self.AC.hash.get()).every(( id ) => {
                array.push({ id: id });
                return true;
            });
            const rv = Template.currentData().selection;
            if( rv ){
                rv.set( array );
            }
        },

        selectAdd( id ){
            let hash = self.AC.hash.get();
            hash[id] = { id: id };
            self.AC.hash.set( hash );
            self.AC.hash2selection();
        },

        selectRemove( id ){
            let hash = self.AC.hash.get();
            delete hash[id];
            self.AC.hash.set( hash );
            self.AC.hash2selection();
        },

        // convert an array of id's objects { id:id } to an internal hash
        selection2hash( ids ){
            let hash = {};
            if( ids ){
                ids.every(( o ) => {
                    hash[o.id] = o;
                    return true;
                });
            }
            self.AC.hash.set( hash );
        }
    };

    // get the passed-in selection and copy it as a hash
    self.autorun(() => {
        const rv = Template.currentData().selection;
        self.AC.selection2hash( rv ? rv.get() : [] );
    });

    // when subscription is ready, get the users
    self.autorun(() => {
        if( self.AC.handle.ready()){
            Meteor.users.find({}).fetch().every(( u ) => {
                u.preferredLabel = pwiAccounts.preferredLabel( u );
                self.AC.users[u._id] = u;
                return true;
            });
        }
    });
});

Template.acSelect.onRendered( function(){
    const self = this;
});

Template.acSelect.helpers({
    // whether the user is to be selected
    selected( id ){
        const hash = Template.instance().AC.hash.get();
        return Object.keys( hash ).includes( id ) ? 'checked' : '';
    },

    // a description
    text(){
        const rv = this.text;
        return rv ? rv.get() : '';
    },

    // returns the username or the email address of the user
    //  depending of the global configuration
    username( id ){
        const user = Template.instance().AC.users[id];
        return user.preferredLabel.get();
    },

    // returns the list of known users
    users(){
        return Object.keys( Template.instance().AC.users );
    },

    // returns this instance identifier
    uuid(){
        return Template.instance().AC.uuid;
    }
});

Template.acSelect.events({

    // handle changes on checkboxes, simultaneously maintaining our selection
    'change input.ac-checkbox'( event, instance ){
        const checked = $( event.currentTarget ).prop( 'checked' );
        const id = $( event.currentTarget ).data( 'ac-id' );
        if( checked ){
            instance.AC.selectAdd( id );
        } else {
            instance.AC.selectRemove( id );
        }
    }
});
