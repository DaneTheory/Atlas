import './assets/css/global/style.css'
import './assets/css/main/style.css'

import {
  THREE,
  TrackballControls,
  CSS3DRenderer,
  CSS3DObject
} from '@atlas/vendors-threejs'

import {
  TWEEN
} from '@atlas/vendors-tweenjs'

import {
  PeriodicTableData
} from '@atlas/periodic-table-data'




const CONSTANTS = {
  _WEB_: {
    _PERIODIC_TABLE_: {
      _RootNodeID_: `container`
    }
  }
}


const INITIAL_STATE = {
  $WEB: {
    $PERIODIC_TABLE: {
      $Stage: {
        $Camera:   null,
        $Scene:    null,
        $Renderer: null,
        $Controls: null
      },
      $Comp: {
        $Nodes: []
      },
      $View: {
        $Flat: [],
        $Orb:  [],
        $Grid: []
      },
      $Config: {
        $CameraConf: {
          $dov:     40,
          $aspect:  window.innerWidth/window.innerHeight,
          $near:    1,
          $far:     10000,
          $position: {
            $zed: 3000
          }
        },
        $RendererConf: {
          $width:   window.innerWidth,
          $height:  window.innerHeight
        },
        $ControlsConf: {
          $distance: {
            $min: 500,
            $max: 6000
          }
        }
      }
    }
  }
}




const SceneInstantiation = async () => {
  let _scne

  try {
    _scne = await new THREE.Scene()
    return await _scne
  }
  catch(error) {
    console.error(error)
    throw error
  }
}

const CameraInstantiation = async ({ dov, aspect, near, far, pos }) => {
  let _cam

  try {
    _cam = await new THREE.PerspectiveCamera(dov, aspect, near, far)
    _cam.position.z = await pos.zed
    return await _cam
  }
  catch(error) {
    console.error(error)
    throw error
  }
}

const RendererInstantiation = async ({ width, height }) => {
  let _rndr

  try {
    _rndr = await new CSS3DRenderer()
    await _rndr.setSize(width, height)
    return await _rndr
  }
  catch(error) {
    console.error(error)
    throw error
  }
}

const ControlsInstantiation = async (cam, rndr, { minDist, maxDist }) => {
  let _cntrls

  try {
    _cntrls = await new TrackballControls(cam, rndr.domElement)
    _cntrls.minDistance = await minDist
    _cntrls.maxDistance = await maxDist
    return await _cntrls
  }
  catch(error) {
    console.error(error)
    throw error
  }
}

const StageInstantiationHandler = async (rootNode, {
  $_CameraConf,
  $_RendererConf,
  $_ControlsConf
}) => {
  let _camera
  let _scene
  let _renderer
  let _controls
  let stageProps

  try {
    _camera = await CameraInstantiation({...$_CameraConf})
    _scene = await SceneInstantiation()
    _renderer = await RendererInstantiation({...$_RendererConf})

    await rootNode.appendChild(_renderer.domElement)

    _controls = await ControlsInstantiation(_camera, _renderer, {...$_ControlsConf})

    stageProps = await {
      _cameraProps: _camera,
      _sceneProps: _scene,
      _rendererProps: _renderer,
      _controlsProps: _controls
    }

    return await {...stageProps}
  }
  catch(error) {
    throw error
  }
}

const CreateDocFragFromStr = async (
  nodeType = `div`,
  className = null,
  attrs = {
      bgColor: null,
      textContent: null,
      innerHTML: null
    }
  ) => {
  let _template

  try {
    _template = await `
    <${nodeType}
      ${className ? `class=${className}` : ''}
      ${attrs.bgColor ? `style=background-color:${attrs.bgColor}` : ''}
      >${attrs.textContent ? attrs.textContent : ''}${attrs.innerHTML ? attrs.innerHTML : ''}</${nodeType}>
    `
    await _template.trim()
    return await document.createRange().createContextualFragment(_template)
  }
  catch(error) {
    console.error(error)
    throw error
  }
}





const RenderScene = async () => {
  try {
    let { renderer, scene, camera } = await _state
    let runRender = await renderer.render(scene, camera)
    return await runRender
  }
  catch(error) {
    console.error(error)
    throw error
  }
}

const OnWindowResize = async () => {
  try {
    let { camera, renderer } = await _state
    camera.aspect = await window.innerWidth/window.innerHeight
    await camera.updateProjectionMatrix()
    await renderer.setSize(window.innerWidth, window.innerHeight)
    await RenderScene()
  }
  catch(error) {
    console.error(error)
    throw error
  }
}

const transform = async (targets, duration, nodes, { renderer, scene, camera }) => {
    try {
      await TWEEN.removeAll()

      for(let i=0;i<nodes.length;i++) {
        let object = await nodes[i]
        let target = await targets[i]

        await new TWEEN.Tween(object.position).to({
          x: await target.position.x,
          y: await target.position.y,
          z: await target.position.z
          }, await Math.random()*duration+duration)
          .easing(await TWEEN.Easing.Exponential.InOut)
          .start()

        await new TWEEN.Tween(object.rotation).to({
          x: await target.rotation.x,
          y: await target.rotation.y,
          z: await target.rotation.z
          }, await Math.random()*duration+duration)
          .easing(await TWEEN.Easing.Exponential.InOut)
          .start()
      }

      await new TWEEN.Tween()
        .to({}, await duration*2)
        .onUpdate(await RenderScene)
        .start()
    }
    catch(error) {
      throw error
    }
  }

  const Init = async (
    root,
    stage,
    pTableData,
    { $_CompNodes },
    { $_FlatView, $_OrbView, $_GridView },
    { $_Scene, $_Camera, $_Renderer, $_Controls }
  ) => {
    let _docFrag = document.createDocumentFragment()
    let _elFrag

    try {

      let { _cameraProps, _sceneProps, _rendererProps, _controlsProps } = await stage

      $_Camera = await _cameraProps
      $_Scene = await _sceneProps
      $_Renderer = await _rendererProps
      $_Controls = await _controlsProps

      _state = await {
        root: root,
        db: pTableData,
        camera: $_Camera,
        scene: $_Scene,
        renderer: $_Renderer,
        controls: $_Controls,
        compNodes: $_CompNodes,
        flatView: $_FlatView,
        orbView: $_OrbView,
        gridView: $_GridView
      }

      // Table
      for(let i=0; i<_state.db.length; i+=5) {

        let elem = await document.createElement('div')
        elem.className = await 'element'
        elem.style.backgroundColor = await `rgba(0,127,127,${Math.random()*0.5+0.25})`

        _elFrag = await _docFrag.appendChild(await elem)

        await _elFrag.appendChild(
          await CreateDocFragFromStr(`div`, `number`, {
            textContent: (i/5)+1
          })
        )

        await _elFrag.appendChild(
          await CreateDocFragFromStr(`div`, `symbol`, {
            textContent: _state.db[i]
          })
        )

        await _elFrag.appendChild(
          await CreateDocFragFromStr(`div`, `details`, {
            innerHTML: `${_state.db[i+1]}<br>${_state.db[i+2]}`
          })
        )

        var object = await new CSS3DObject(await _state.root.appendChild(await _elFrag))
        object.position.x = Math.random()*4000-2000
        object.position.y = Math.random()*4000-2000
        object.position.z = Math.random()*4000-2000

        _state.scene.add(object)
        _state.compNodes.push(object)

        var object = new THREE.Object3D()
        object.position.x = (_state.db[i+3] * 140)-1330
        object.position.y = -(_state.db[i+4] * 180)+990

        _state.flatView.push(object)
      }

      // Orb
      var vector = new THREE.Vector3()
      for (let i=0, l=_state.compNodes.length; i<l; i++) {

        var phi = Math.acos(-1+(2*i)/l)
        var theta = Math.sqrt(l*Math.PI)*phi

        var object = new THREE.Object3D()
        object.position.setFromSphericalCoords(800, phi, theta)
        vector.copy(object.position).multiplyScalar(2)
        object.lookAt(vector)

        _state.orbView.push(object)
      }

      // Grid
      for(let i=0;i<_state.compNodes.length;i++) {

        var object = new THREE.Object3D()
        object.position.x = ((i%5)*400)-800
        object.position.y = (-(Math.floor(i/5)%5)*400)+800
        object.position.z = (Math.floor(i/25))*1000-2000

        _state.gridView.push(object)
      }

      _state.controls.addEventListener('change', RenderScene)


      var button = document.getElementById('table')
      button.addEventListener('click', function () {
        transform(_state.flatView, 2000, _state.compNodes, {..._state})
      }, false)

      var button = document.getElementById('sphere')
      button.addEventListener('click', function () {
        transform(_state.orbView, 2000, _state.compNodes, {..._state})
      }, false)

      var button = document.getElementById('grid')
      button.addEventListener('click', function () {
        transform(_state.gridView, 2000, _state.compNodes, {..._state})
      }, false)

      transform(_state.flatView, 2000, _state.compNodes, {..._state})

      window.addEventListener('resize', OnWindowResize, false)
    }
    catch(error) {
      console.error(error)
      throw error
    }
  }


  const SyncAnimator = async (cb, win = window) => {
    let _win

    try {
      _win = await win

      if(_win) {
        let { requestAnimationFrame } = await _win
        let { controls } = await _state

        await requestAnimationFrame(cb)
        await TWEEN.update()

        await controls.update()
      }
    }
    catch(error) {
      console.error(error)
      throw error
    }
  }

  const AnimationLoop = async () => {
    let _loop

    try {
      _loop = await SyncAnimator(AnimationLoop)
      await _loop
    }
    catch(error) {
      console.error(error)
      throw error
    }
  }

  const SceneManager = async (rootNode, { _WEB_ }) => {
    let {
      $StageComposition,
      $StageViewTypes,
      $StageInterface,
      $StageInterfaceConfigs
    } = _WEB_.$InitialStageState

    let _stage
    let _root
    let _periodicTableData

    try {
      _root = await rootNode
      _stage = await StageInstantiationHandler(_root, {...$StageInterfaceConfigs})
      _periodicTableData = await PeriodicTableData

      await Init(
        _root,
        _stage,
        _periodicTableData,
        {...$StageComposition},
        {...$StageViewTypes},
        {...$StageInterface}
      )
      await AnimationLoop()
    }
    catch(error) {
      console.error(error)
      throw error
    }
  }




const {
  $Stage,
  $Comp,
  $View,
  $Config
} = INITIAL_STATE.$WEB.$PERIODIC_TABLE

const {
  _RootNodeID_
} = CONSTANTS._WEB_._PERIODIC_TABLE_

const ConvenientDOMMethods = async () => {
  let _dom

  try {
      _dom = await document
  }
  catch(error) {
    throw error
  }
}

const RootNode = document.getElementById(_RootNodeID_)
let _state


SceneManager(RootNode, {...CONSTANTS})
