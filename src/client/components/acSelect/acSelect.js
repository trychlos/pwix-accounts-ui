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
 *                  defaults to none
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
        hash: new ReactiveVar( {} ),

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
});

Template.acSelect.onRendered( function(){
    const self = this;

    self.autorun(() => {
        const rv = Template.currentData().selection;
        self.AC.selection2hash( rv ? rv.get() : [] );
    })
});

Template.acSelect.helpers({
    // whether the user is to be selected
    selected( it ){
        const hash = Template.instance().AC.hash.get();
        return Object.keys( hash ).includes( it._id ) ? 'checked' : '';
    },

    // a description
    text(){
        const rv = this.text;
        return rv ? rv.get() : '';
    },

    // returns the username of the user
    username( it ){
        return pwiAccounts.emailAddress( it._id ).then(( email ) => { return Promise.resolve( email ); } );
    },

    // returns the list of known users
    users(){
        if( Template.instance().AC.handle.ready()){
            return Meteor.users.find({}, { sort: { email: 1 }});
        }
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
