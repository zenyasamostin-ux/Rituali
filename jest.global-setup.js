// Pin the time zone so date-based tests give the same result on every machine.
module.exports = () => {
  process.env.TZ = 'Europe/Riga';
};
