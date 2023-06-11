/*
 * pwix:accounts/src/common/i18n/fr_FR.js
 */

pwixAccounts.i18n = {
    ...pwixAccounts.i18n,
    ...{
        fr_FR: {
            buttons: {
                reset_link: '[ Mot de passe oublié ]',
                signin_link: '[ M\'identifier ]',
                signup_link: '[ Nouveau compte ]',
                cancel_label: 'Annuler',
                send_label: 'Envoyer',
                signin_label: 'M\'identifier',
                signout_label: 'Me déconnecter',
                signup_label: 'Nouveau compte',
                ok_label: 'OK'
            },
            change_pwd: {
                modal_title: 'Changer votre mot de passe',
                old_label: 'Votre mot de passe actuel',
                new_label: 'Votre nouveau mot de passe',
                newone_placeholder: 'Saisissez un nouveau mot de passe',
                newtwo_placeholder: 'Ré-entrez votre nouveau mot de passe',
            },
            dropdown_btn: {
                unlogged: 'Compte'
            },
            features: {
                signout: 'Me déconnecter',
                changepwd: 'Changer mon mot de passe',
                verifyask: 'Verifier mon email',
                signin: 'M\'identifier avec mon compte',
                signup: 'Créer un nouveau compte',
                resetask: 'Réinitialiser mon mot de passe'
            },
            input_email: {
                label: 'Adresse de messagerie :',
                placeholder: 'Saisissez votre adresse de messagerie (ex.: nom@example.com)',
                already_exists: 'L\'adresse de messagerie existe déjà',
                invalid: 'L\'adresse de messagerie est invalide'
            },
            input_password: {
                label: 'Mot de passe :',
                placeholder: 'Saisissez votre mot de passe',
                strength: 'Sécurité',
                too_short: 'Le mot de passe est trop court',
                too_weak: 'Le mot de passe est trop faible'
            },
            input_userid: {
                label: 'Identifiant :',
                placeholder: 'Saisissez votre nom d\'utilisateur ou votre adresse de messagerie'
            },
            input_username: {
                label: 'Nom d\'utilisateur :',
                placeholder: 'Saisissez votre nom d\'utilisateur',
                already_exists: 'Le nom d\'utilisateur est déjà utilisé',
                too_short: 'Le nom d\'utilisateur est trop court'
            },
            logged: {
                signout: 'Me déconnecter',
                changepwd: 'Changer mon mot de passe',
                verifyask: 'Vérifier mon adresse de messagerie'
            },
            reset_ask: {
                modal_title: 'Mot de passe oublié ?',
                textOne: 'Lorsque vous aurez pressé le bouton "Envoyer" ci-dessous, nous enverrons un message vers votre adresse de messagerie.<br />'
                    +'Ce message contiendra un lien sur lequel vous devrez cliquer, et qui vous permettra de ré-initialiser votre mot de passe.<br />'
                    +'<br />'
                    +'<i>Notez s\'il vous plait que, pour des raisons de sécurité, ce lien a une durée de vie limitée (env. 30mn par défaut). '
                    +'N\'exécutez pas cette opération si vous n\'avez pas accès à votre boite de messagerie.</i>'
            },
            reset_pwd: {
                modal_title: 'Réinitialisez votre mot de passe',
                textOne: 'Bonjour <b>%s</b>,<br />'
                    +'Merci de cette nouvelle visite!<br />'
                    +'Réinitialisons votre mot de passe, et profitez de la suite &nbsp;!'
            },
            select: {
                close_btn: 'Annuler',
                save_btn: 'Enregistrer',
                title: 'Sélection des utilisateurs'
            },
            signin: {
                modal_title: 'M\'identifier avec mon compte'
            },
            signout: {
                modal_title: 'Se déconnecter',
                textOne: 'Vous êtes sur le point de vous déconnecter du site.<br />Etes-vous sûr ?',
            },
            signup: {
                modal_title: 'Créer un nouveau compte'
            },
            twice_passwords: {
                label: 'Mot de passe :',
                placeholder1: 'Saisissez votre mot de passe',
                placeholder2: 'Saisissez à nouveau votre mot de passe',
                password_different: 'Les mots de passe sont différents'
            },
            unlogged: {
                unlogged: 'Compte',
                signin: 'S\'identifier',
                signup: 'Créer un nouveau compte',
                resetask: 'Réinitialisation du mot de passe'
            },
            user: {
                changepwd_error: 'Impossible de changer le mot de passe.',
                changepwd_success: 'Mot de passe mis à jour avec succès',
                resetask_credentials: 'Impossible d\'envoyer un lien de réinitialisation. Merci de vérifier l`adresse saisie',
                resetask_error: 'Impossible d\'envoyer un lien de réinitialisation.',
                resetask_success: 'Message envoyé avec succès',
                resetpwd_error: 'Humm... Désolé, mais il semble que le jeton utilisé soit expiré.<br />Vous devez en redemander un nouveau.',
                resetpwd_text: 'Bonjour,<br />Votre mot de passe a été réinitialisé avec succès.<br />Vous êtes automatiquement connecté au site.',
                resetpwd_title: 'Réinitialisation du mot de passe',
                signin_error: 'L\'adresse de messagerie et/ou le mot de passe sont invalides. Merci de bien vouloir les vérifier.\nEn cas de doute, vous pouvez vous rapprocher de notre administrateur.',
                signup_error: 'Impossible de créer ce nouveau compte.',
                signup_success: 'Nouveau compte %s créé',
                signup_autoconnect: 'Le nouveau compte a été automatiquement connecté',
                signup_noconnect: 'Le compte n\'est pas connecté',
                verify_error: 'Humm... Désolé, mais il semble que le jeton utilisé soit expiré.<br />Vous devez en redemander un nouveau.',
                verify_text: 'Bonjour,<br />Votre adresse de messagerie est maintenant considérée comme vérifiée.',
                verify_title: 'Vérification de l\'adresse de messagerie',
                verifyask_error: 'Humm... Désolé, mais il semble que je ne sois pas dans la possibilité de vous envoyer un message. Merci de bien vouloir ré-essayer un peu plus tard.',
                verifyask_success: 'Message envoyé avec succès',
                mandatory_fields: 'Champs obligatoires'
            },
            verify_ask: {
                modal_title: 'Vérifier l\'adresse de messagerie',
                textOne: 'Tant que votre adresse de messagerie n\'est pas considérée comme vérifiée, il vous est impossible de participer aux forums de discussion.<br />'
                    +'Lorsque vous aurez pressé le bouton "Envoyer" ci-dessous, nous enverrons un message vers votre adresse de messagerie.<br />'
                    +'Ce message contiendra un lien sur lequel vous devrez cliquer, et qui vous permettra de nous confirmer votre addresse.'
            }
        }
    }
};

pwixAccounts.i18n.fr = pwixAccounts.i18n.fr_FR;
