Package.describe({
    name: 'pwix:accounts-ui',
    version: '1.5.0-rc',
    summary: 'A Bootstrap-based user interface for Meteor:accounts-password (or Meteor:accounts-ui reinvented)',
    git: 'https://github.com/trychlos/pwix-accounts-ui',
    documentation: 'README.md'
});

Package.onUse( function( api ){
    configure( api );
    api.export([
        'AccountsUI'
    ]);
    api.mainModule( 'src/client/js/index.js', 'client' );
    api.mainModule( 'src/server/js/index.js', 'server' );
});

Package.onTest( function( api ){
    configure( api );
    api.use( 'tinytest' );
    api.use( 'pwix:accounts-ui' );
    api.mainModule( 'test/js/index.js' );
});

function configure( api ){
    api.versionsFrom( '2.9.0' );
    api.use( 'accounts-password@2.3.3' );
    api.use( 'blaze-html-templates@2.0.0', 'client' );
    api.use( 'deanius:promise@3.1.3', 'client' );
    api.use( 'ecmascript' );
    api.use( 'less@4.0.0', 'client' );
    api.use( 'pwix:bootbox@1.5.0' );
    api.use( 'pwix:i18n@1.5.0' );
    api.use( 'pwix:layout@1.3.0' );
    api.use( 'pwix:modal@1.7.0' );
    api.use( 'pwix:options@2.1.0' );
    api.use( 'pwix:tolert@1.4.0' );
    api.use( 'random', 'client' );
    api.use( 'tmeasday:check-npm-versions@1.0.2', 'server' );
    api.addFiles( 'src/client/components/acMandatoryField/acMandatoryField.js', 'client' );
    api.addFiles( 'src/client/components/acMandatoryFooter/acMandatoryFooter.js', 'client' );
    api.addFiles( 'src/client/components/acMenuItems/acMenuItems.js', 'client' );
    api.addFiles( 'src/client/components/acUserLogin/acUserLogin.js', 'client' );
    api.addAssets( 'src/client/svg/asterisk.svg', 'client' );
}

// NPM dependencies are checked in /src/server/js/check_npms.js
// See also https://guide.meteor.com/writing-atmosphere-packages.html#peer-npm-dependencies
