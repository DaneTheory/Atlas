import Devo from '../index.js'


export default (async () => {
  let _devo

  try {
      _devo = await Devo()
      console.log(_devo);
      return await _devo
  }
  catch(error) {
    console.error(error)
    throw error
  }
})()
