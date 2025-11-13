import React from 'react';
import { Canvas } from '@react-three/fiber';
import {OrbitControls, PerspectiveCamera} from '@react-three/drei';
import Model from './Model';
import Lights from './Lights'

const Viewer3D = ({children, onReady}) => {
    return (
        <Canvas
            style = {{width: '100%', height: '100vh'}}
            gl = {{ preserveDrawingBuffer: true}}
            onCreated = {onReady}
        >
            <PerspectiveCamera
                makeDefault
                position = {[5, 5, 5]}
                fov={50}
            />
            <Lights/>
            {children}
            <OrbitControls makeDefault/>
            <axesHelper args={[5]}/>
            <gridHelper args={[10, 10]}/>
        </Canvas>
    );
};
export default Viewer3D;