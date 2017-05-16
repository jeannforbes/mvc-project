const models = require('../models');
const Opp = models.Opp;

const makerPage = (req, res) => {
  Opp.OppModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), opps: docs });
  });
};

const makeOpp = (req, res) => {
  if (!req.body.name) return res.status(400).json({ error: 'A name is required.' });

  const oppData = {
    name: req.body.name,
    date: req.body.date,
    info: req.body.info,
    phone: req.body.phone,
    email: req.body.email,
    other: req.body.other,
    responses: [mongoose.Types.ObjectId(req.session.account._id)],
    bookmarks: [mongoose.Types.ObjectId(req.session.account._id)],
    owner: req.session.account._id,
    // This will MOST LIKELY generate an unique id -- it's not guaranteed.  But what is?
    uniqueId: new Date().valueOf(),
  };

  const newOpp = new Opp.OppModel(oppData);
  const oppPromise = newOpp.save();

  oppPromise.then(() => res.json({ redirect: '/maker' }));

  oppPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Event already exists' });
    }

    return res.status(400).json({ error: 'An error occured' });
  });

  return oppPromise;
};

const getOpps = (request, response) => {
  const res = response;

  return Opp.OppModel.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ opps: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.make = makeOpp;
module.exports.getOpps = getOpps;
