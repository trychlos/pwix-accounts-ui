# pwix:accounts-ui

## ChangeLog

### 1.2.3-rc

    Release date: 

    - Fix mispelled 'loadash' as 'lodash'
    - Make sure a modal is rendered when the requester is its companion (todo #52)
    - Now accepts signin and signup fieldset legends
    - Dropdown items are now reactive to the language changes (todo #54)
    - Make the dropdown items aligned independently of the application stylesheet (todo #53)

### 1.2.2

    Release date: 2023- 6-21

    - Provide new pwixAccounts.i18n.namespace() method to let anyone improve the i18n translations (todo #49)
    - Add screenshots to the documentation
    - Remove unused AC_VERBOSE_PANEL_HANDLE constant
    - Consolidate AC_VERBOSE_SUBMIT_HANDLE and AC_VERBOSE_SUBMIT_TRIGGER constants into AC_VERBOSE_SUBMIT
    - Consolidate AC_VERBOSE_USER_HANDLE and AC_VERBOSE_USER_TRIGGER constants into AC_VERBOSE_USER
    - Add lodash dependency
    - configure() now acts both as a getter and a setter

### 1.2.1

    Release date: 2023- 6-12

    - Update release date

### 1.2.0

    Release date: 2023- 6-12

    - pwixAccounts: add new 'onVerifiedEmailBox' configuration parameter
    - pwixAccounts: add new 'onVerifiedEmailTitle' configuration parameter
    - pwixAccounts: add new 'onVerifiedEmailMessage' configuration parameter
    - pwixAccounts: add new 'sendVerificationEmail' configuration parameter
    - acUserLogin: add new 'haveCancelButton' configuration parameter

    - Fix 'DIV' render mode
    - Fix mandatory indicator on email address

    - Remove NPM dependencies on @popperjs/Core and bootstrap
    - Bump pwix:i18n dependency to v 1.3.0
    - Bump pwix:layout dependency to v 1.2.0
    - Bump pwix:modal dependency to v 1.5.0
    - Bump pwix:options dependency to v 1.3.0

### 1.1.0

    Release date: 2023- 2-20

    - Get rid of the Interfaces strategy, back to the good old classes (see maintainer/Interfaces.md for the rationale)
    - Remove jQuery-UI dependency, getting tied to Bootstrap at the moment
    - Add a dependency on pwix:modal 1.1.0 (get stackable, draggable and resizable modals)

### 1.0.0

    Release date: 2023- 1-27

    - Initial release

---
P. Wieser
- Last updated on 2023, June 21th
