/*
 * pwix:accounts/src/server/js/publish.js
 */

// autopublish users so that every application which use this package can also use its features....
/* todo #9
Meteor.publish( null, function(){
    return Meteor.users.find();
});
*/

// a special publication which let a selection per email
//  just provide objects { id, email, verified }
Meteor.publish( 'pwiAccounts.byEmail', function(){
    const self = this;
    const collectionName = 'users';
    const query = { selector:{}, options:{}};
    //console.log( query );

    function f_setFields( doc ){
        let newDoc = {
            _id: doc._id,
            email: doc.emails[0].address,
            verified: doc.emails[0].verified
        }
        return newDoc;
    }

    const observer = Meteor.users.find( query.selector, query.options ).observe({
        added: function( doc){
            self.added( collectionName, doc._id, f_setFields( doc ));
        },
        changed: function( newDoc, oldDoc ){
            self.changed( collectionName, newDoc._id, f_setFields( newDoc ));
        },
        removed: function( oldDoc ){
            self.removed( collectionName, oldDoc._id );
        }
    });

    self.onStop( function(){
        observer.stop();
    });

    self.ready();
});
