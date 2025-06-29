const model = require('../models/habitModel');

const getToday = () => {
  const offset = parseInt(process.env.DATE_OFFSET || '0', 10);
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toISOString().slice(0, 10);
};

exports.addHabit = (name, freq) => {
  const data = model.read();
  const id = Date.now().toString();
  data.push({ id, name, freq, history: [] });
  model.write(data);
  console.log('Habit added.');
};

exports.listHabits = () => {
  const data = model.read();
  console.table(data.map(({ id, name, freq }) => ({ id, name, freq })));
};

exports.markDone = (id) => {
  const data = model.read();
  const today = getToday();
  const habit = data.find((h) => h.id === id);
  if (habit) {
    if (!habit.history.includes(today)) habit.history.push(today);
    model.write(data);
    console.log('Marked as done.');
  } else {
    console.log('Habit not found');
  }
};

exports.showStats = () => {
  const data = model.read();
  const today = new Date(getToday());
  data.forEach(({ name, history }) => {
    const last30 = history.filter((d) => {
      const day = new Date(d);
      return (today - day) / (1000 * 3600 * 24) <= 30;
    });
    console.log(`${name}: ${(last30.length / 30 * 100).toFixed(2)}% last 30 days`);
  });
};

exports.deleteHabit = (id) => {
  let data = model.read();
  data = data.filter((h) => h.id !== id);
  model.write(data);
  console.log('Habit deleted.');
};

exports.updateHabit = (id, name, freq) => {
  const data = model.read();
  const habit = data.find((h) => h.id === id);
  if (habit) {
    if (name) habit.name = name;
    if (freq) habit.freq = freq;
    model.write(data);
    console.log('Habit updated.');
  } else {
    console.log('Habit not found.');
  }
};