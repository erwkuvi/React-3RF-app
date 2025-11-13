import logo from './logo.svg';
import './App.css';
import React, {useState, useRef, useEffect} from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Toolbar from './components/UI/Toolbar';
import FileUploader from './components/UI/FileUploader';
import MeasurementDisplay from './components/Measurement/MeasurementDisplay';
import ManualAlignment from './components/TransformControls/ManualAlignment';
import CircumferenceTool from './components/Measurement/CircumferenceTool';
import Model from './components/Viewer3D/Model';
import useUndoRedo from './hooks/useUndoRedo';
import useResponsive from './hooks/useResponsive';
// import Viewer3D from './components/Viewer3D/Canvas';
// import { uploadModel } from './utils/fileUpload';

function App() {
    const [modelFile, setModelFile] = useState(null);
    const [transformMode, setTransformMode] = useState('translate');
    const [measurementEnabled, setMeasurementEnabled] = useState(false);
    const [measurementData, setMeasurementData] = useState({
        circumference: 0,
        points: 0,
    });
    const modelRef = useRef();
    const { isMobile } = useResponsive();


   const initialTransform = {
       position: [0, 0, 0],
       rotation: [0, 0, 0],
       scale: [1, 1, 1]
   };

   const {
       state: transform,
       saveState: saveTransform,
       undo,
       redo,
       reset,
       canUndo,
       canRedo
   } = useUndoRedo(initialTransform);

    // useEffect (() => {}, []);
    useEffect(() => { // keyboard shortcuts
        const handleKeyDown = (e) => {
            if (e.target.tagName === 'INPUT') return; // Ignore if focused on input

            if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            } else if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')){
                e.preventDefault();
                redo();
            } else if (e.key === 'Escape') {
                reset();
            } else if (e.key === 'w' || e.key === 'W') {
                e.preventDefault();
                setTransformMode('translate');
            } else if (e.key === 'e' || e.key === 'E') {
                e.preventDefault();
                setTransformMode('rotate');
            } else if (e.key === 'r' || e.key === 'R') {
                e.preventDefault();
                setTransformMode('scale');
            } else if (e.key === 'm' || e.key === 'M') {
                e.preventDefault();
                setMeasurementEnabled(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
        }, [undo, redo, reset]
    );

    const handleTransformChange = (newTransform) => {
        saveTransform(newTransform);
    };

    const handleFileSelect = (file) => {
        setModelFile(file);
        reset(); // Reset the view when a new model is loaded
    }

    const handleMeasurementChange = (data) => {
        setMeasurementData(data);
    };

    const handleClearMeasurement = () => {
        setMeasurementData({ circumference: 0, points: 0 });
        if (window.clearMeasurement){
            window.clearMeasurement();
        }
    };

   const handleExportData = () => {
       const exportData = {
           model: modelFile?.name || 'unknown',
           transform: transform,
           measurement: measurementData,
           timestamp: new Date().toISOString()
       };

       const blob = new Blob([JSON.stringify(exportData, null, 2)], {
           type: 'application/json'
       });
       const url = URL.createObjectURL(blob);
       const a = document.createElement('a');
       a.href = url;
       a.download = `3d_scan_alignment_${Date.now()}.json`;
       a.click();
       URL.revokeObjectURL(url);
   };

   const cameraPosition = isMobile ? [3, 3, 3] : [5, 5, 5];
   const cameraFov = isMobile ? 60 : 50;

  return (
      <div style={styles.container}>
          {/*File uploader*/}
          {!modelFile && (
              <FileUploader onFileSelect={handleFileSelect} />
          )}

          {/*Main Menu*/}
          {modelFile && (
              <Toolbar
                  mode={transformMode}
                  onModeChange={setTransformMode}
                  onUndo={undo}
                  onRedo={redo}
                  onReset={reset}
                  canUndo={canUndo}
                  canRedo={canRedo}
              />
          )}
          {/*Export button*/}
          {modelFile && (
              <button
                  onClick={handleExportData}
                  style={styles.button}
                  title="Export the current model and transformation state"
              >
                  Export Data
              </button>
          )}
          {/*Change Model Button*/}
          {modelFile && (
              <button
              onClick={() => setModelFile(null)}
              style={styles.button}
              title="Change the model"
              >
                  Change Model
              </button>
          )}
          {/*3D Canvas*/}
          <Canvas
              style={styles.canvas}
              gl={{
                  preserveDrawingBuffer: true,
                  antialias: true
              }}
              dpr={[1, 2]}
              >
              <PerspectiveCamera
                  makeDefault
                  position={cameraPosition}
                  fov={cameraFov}
              />
              {/* Lighting */}
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <directionalLight position={[-10, -10, -5]} intensity={0.5} />
              <pointLight position={[0, 10, 0]} intensity={0.5} />
              {/* Scene helpers */}
              <axesHelper args={[5]} />
              <gridHelper args={[10, 10]} />

              {/*3D Model*/}

              <OrbitControls enableZoom={false} />
          </Canvas>

      </div>
  );
}

export default App;
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }
//
// export default App;
