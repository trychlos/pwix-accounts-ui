Package.describe({
    name: 'pwix:accounts',
    version: '1.2.2-rc',
    summary: 'A Bootstrap-based user interface for Meteor:accounts-password (or Meteor:accounts-ui reinvented)',
    git: 'https://github.com/trychlos/pwix-accounts',
    documentation: 'README.md'
});

Package.onUse( function( api ){
    configure( api );
    api.export([
        'pwixAccounts',
        'AC_LOGGED',
        'AC_UNLOGGED',
        'AC_ACT_HIDDEN',
        'AC_ACT_NONE',
        'AC_ACT_DROPDOWN',
        'AC_ACT_BUBBLE',
        'AC_FIELD_NONE',
        'AC_FIELD_OPTIONAL',
        'AC_FIELD_MANDATORY',
        'AC_PANEL_NONE',
        'AC_PANEL_CHANGEPWD',
        'AC_PANEL_RESETASK',
        'AC_PANEL_RESETPWD',
        'AC_PANEL_SIGNIN',
        'AC_PANEL_SIGNOUT',
        'AC_PANEL_SIGNUP',
        'AC_PANEL_VERIFYASK',
        'AC_PWD_VERYWEAK',
        'AC_PWD_WEAK',
        'AC_PWD_MEDIUM',
        'AC_PWD_STRONG',
        'AC_PWD_VERYSTRONG',
        'AC_RENDER_MODAL',
        'AC_RENDER_DIV',
        'AC_RESET_EMAILSENT',
        'AC_RESET_EMAILUNSENT',
        'AC_RESET_EMAILERROR',
        'AC_VERBOSE_NONE',
        'AC_VERBOSE_CONFIGURE',
        'AC_VERBOSE_DISP_MANAGER',
        'AC_VERBOSE_INSTANCIATIONS',
        'AC_VERBOSE_PANEL',
        'AC_VERBOSE_READY',
        'AC_VERBOSE_STARTUP',
        'AC_VERBOSE_SUBMIT_HANDLE',
        'AC_VERBOSE_SUBMIT_TRIGGER',
        'AC_VERBOSE_USER'
    ]);
    api.mainModule( 'src/client/js/index.js', 'client' );
    api.mainModule( 'src/server/js/index.js', 'server' );
});

Package.onTest( function( api ){
    configure( api );
    api.use( 'tinytest' );
    api.use( 'pwix:accounts' );
    api.mainModule( 'test/js/index.js' );
});

function configure( api ){
    api.versionsFrom( '2.9.0' );
    api.use( 'accounts-password@2.3.3' );
    api.use( 'blaze-html-templates@2.0.0', 'client' );
    api.use( 'deanius:promise@3.1.3', 'client' );
    api.use( 'ecmascript' );
    api.use( 'less@4.0.0', 'client' );
    api.use( 'pwix:bootbox@1.3.0', 'client' );
    api.use( 'pwix:i18n@1.3.0' );
    api.use( 'pwix:layout@1.2.0', 'client' );
    api.use( 'pwix:modal@1.5.0' );
    api.use( 'pwix:options@1.4.0' );
    api.use( 'pwix:tolert@1.2.0', 'client' );
    api.use( 'random', 'client' );
    api.use( 'tmeasday:check-npm-versions@1.0.2', 'server' );
    api.addFiles( 'src/client/components/acMenuItems/acMenuItems.js', 'client' );
    api.addFiles( 'src/client/components/acUserLogin/acUserLogin.js', 'client' );
}

// NPM dependencies are checked in /src/server/js/check_npms.js
// See also https://guide.meteor.com/writing-atmosphere-packages.html#npm-dependencies
