const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {

  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/passwordChange', mid.requiresLogin, controllers.Account.passwordChange);
  app.post('/maker', mid.requiresLogin, controllers.Opp.make);
  app.post('/rsvp', mid.requiresLogin, controllers.Account.addRSVP);
  app.post('/bookmark', mid.requiresLogin, controllers.Account.addBookmark);

  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getOpps', mid.requiresLogin, controllers.Opp.getOpps);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout, controllers.Account.logout);
  app.get('/account', mid.requiresLogin, controllers.Account.settings);
  app.get('/maker', mid.requiresLogin, controllers.Opp.makerPage);
  app.get('/getRSVPs', mid.requiresLogin, controllers.Account.getRSVPs);
  app.get('/getBookmarks', mid.requiresLogin, controllers.Account.getBookmarks);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
