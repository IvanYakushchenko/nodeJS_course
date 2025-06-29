const service = require('../services/habitService');

exports.add = ({ name, freq }) => {
  if (!name || !freq) return console.log('Missing parameters');
  service.addHabit(name, freq);
};

exports.list = () => {
  service.listHabits();
};

exports.done = ({ id }) => {
  if (!id) return console.log('Missing id');
  service.markDone(id);
};

exports.stats = () => {
  service.showStats();
};

exports.deleteHabit = ({ id }) => {
  service.deleteHabit(id);
};

exports.update = ({ id, name, freq }) => {
  service.updateHabit(id, name, freq);
};