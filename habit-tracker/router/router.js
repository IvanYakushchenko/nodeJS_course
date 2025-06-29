const habitController = require('../controllers/habitController');

module.exports = (args) => {
  const [command, ...rest] = args;

  const parseArgs = () => {
    const result = {};
    rest.forEach((arg, index) => {
      if (arg.startsWith('--')) {
        result[arg.replace('--', '')] = rest[index + 1];
      }
    });
    return result;
  };

  const options = parseArgs();

  switch (command) {
    case 'add':
      habitController.add(options);
      break;
    case 'list':
      habitController.list();
      break;
    case 'done':
      habitController.done(options);
      break;
    case 'stats':
      habitController.stats();
      break;
    case 'delete':
      habitController.deleteHabit(options);
      break;
    case 'update':
      habitController.update(options);
      break;
    default:
      console.log('Unknown command');
  }
};