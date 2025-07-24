// environment.prod.ts (PRODUCCIÓN)
export const environment = {
    production: true,
    baseurlocal: "http://localhost:4200/",
    baseurl: "http://localhost:8000",
    claveUnica: {
        clientId:  'cd40ad229df147389504190c71de61f5',
        clientSecret: '78ce7c028c9b4b629b7bc2b1b86fa199',
        redirectUri: 'https://tusistema.gob.cl/claveunica/callback', // <= NO localhost
        authUrl: 'https://accounts.claveunica.gob.cl/openid/authorize',
        tokenUrl: 'https://accounts.claveunica.gob.cl/openid/token',
        userInfoUrl: 'https://accounts.claveunica.gob.cl/openid/userinfo',
        logoutUrl: 'https://accounts.claveunica.gob.cl/api/v1/accounts/app/logout'
    },
};