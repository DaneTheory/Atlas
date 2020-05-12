const signale = require('signale')

const Devo = async () => {
  try {
    await signale.success('Operation successful');
    await signale.debug('Hello', 'from', 'L59');
    await signale.pending('Write release notes for %s', '1.2.0');
    await signale.fatal(new Error('Unable to acquire lock'));
    await signale.watch('Recursively watching build directory...');
    await signale.complete({prefix: '[task]', message: 'Fix issue #59', suffix: '(@klauscfhq)'})
  }
  catch(error) {
    throw error
  }
}



export default Devo
