const models = require('../models');
const Account = models.Account;
const Opp = models.Opp;

const loginPage = (req, res) => {
  const token = req.csrfToken();
  res.render('login', { csrfToken: token });
};

const settingsPage = (req, res) => {
  const token = req.csrfToken();
  res.render('account', { csrfToken: token });
};

const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.AccountModel.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

const signup = (request, response) => {
  const req = request;
  const res = response;

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
      bookmarks: [],
      rsvps: [],
    };

    const newAccount = new Account.AccountModel(accountData);
    const savePromise = newAccount.save();

    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      return res.json({ redirect: '/maker' });
    });

    savePromise.catch((err) => {
      console.log(err);

      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use.' });
      }

      return res.status(400).json({ error: 'An error occurred' });
    });
  });
};

const passwordChange = (req, res) => {
  const pass = `${req.body.pass}`;

  Account.AccountModel.changePassword(
    req.session.account._id,
    pass, (err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }

      return res.json({ redirect: '/account' });
    });
};

const addBookmark = (req, res) => {
  Opp.OppModel.addBookmark(
    req.body.uniqueId,
    req.session.account._id, (err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }
      return res.status(200).json({ message: 'Bookmarked successfully' });
    });
};

const getBookmarks = (req, res) => {
  const id = req.session.account._id;
  return Opp.OppModel.find({ bookmarks: id }, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.status(200).json({ opps: docs });
  });
};

const addRSVP = (req, res) => {
  Opp.OppModel.addRSVP(
    req.body.uniqueId,
    req.session.account._id, (err) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ error: 'An error occurred' });
      }

      return res.status(200).json({ message: 'RSVPed successfully' });
    });
};

const getRSVPs = (req, res) => {
  const id = req.session.account._id;
  return Opp.OppModel.find({ rsvps: id }, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    console.log(docs);
    return res.json({ opps: docs });
  });
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.settings = settingsPage;
module.exports.passwordChange = passwordChange;
module.exports.getToken = getToken;
module.exports.addRSVP = addRSVP;
module.exports.getRSVPs = getRSVPs;
module.exports.addBookmark = addBookmark;
module.exports.getBookmarks = getBookmarks;
