Package.describe({
    name: 'pwix:accounts',
    version: '0.90.1',
    summary: 'A Bootstrap-based user interface for Meteor:accounts-password (or Meteor:accounts-ui reinvented)',
    git: 'https://github.com/trychlos/pwix-accounts',
    documentation: 'README.md'
});

Package.onUse( function( api ){
    configure( api );
    api.export([
        'pwiAccounts',
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
        'AC_UI_BOOTSTRAP',
        'AC_UI_JQUERY'
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
    api.use( 'blaze-html-templates', 'client' );
    api.use( 'deanius:promise', 'client' );
    api.use( 'ecmascript' );
    api.use( 'less', 'client' );
    api.use( 'pwi:bootbox', 'client' );
    api.use( 'pwi:i18n' );
    api.use( 'pwi:layout', 'client' );
    api.use( 'pwi:tolert', 'client' );
    api.addFiles( 'src/client/components/acMenuItems/acMenuItems.js', 'client' );
    api.addFiles( 'src/client/components/acSelect/acSelect.js', 'client' );
    api.addFiles( 'src/client/components/acUserLogin/acUserLogin.js', 'client' );
}

Npm.depends({
    'bootstrap': '5.2.1',
    'email-validator': '2.0.4',
    'printf': '0.6.1',
    'uuid': '9.0.0',
    'zxcvbn': '4.4.2'
});
