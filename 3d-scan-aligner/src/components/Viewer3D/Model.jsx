import React, {useRef, useEffect, use} from 'react';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import * as THREE from 'three';

const Model = ({file, onLoad, transform}) => {
    const meshRef = useRef();

    useEffect(() => {
        if (!file) return;

        const reader = new FileReader();
        const ext = file.name.split('.').pop().toLowerCase();

        reader.onload = (e) => {
            const contents = e.target.result;
            let loader;


            if (ext === 'glb' || ext === 'gltf') {
                loader = new GLTFLoader();
            } else if (ext === 'obj') {
                loader = new OBJLoader();
            }
            if (loader) {
                loader.parse(
                    contents,
                    '',
                    (result) => {
                        const model = result.scene || result;

                        const box = new THREE.Box3().setFromObject(model);
                        const center = box.getCenter(new THREE.Vector3());
                        const size = box.getSize(new THREE.Vector3());
                        const maxDim = Math.max(size.x, size.y, size.z);
                        const scale = 5 / maxDim;

                        model.position.sub(center);
                        model.scale.setScalar(scale);

                        if (meshRef.current) {
                            meshRef.current.add(model);
                            if (onLoad) onLoad(meshRef.current);
                        }
                    },
                    (error) => {
                        console.error('Error loading model:', error);
                    }
                );
            }
        };
        if (ext === 'stl' || ext === 'glb') {
            reader.readAsArrayBuffer(file);
        } else {
            reader.readAsText(file);
        }
    }, [file, onLoad]);

// Apply the transformation to the model
    useEffect (() => {
        if (meshRef.current && transform){
            if (transform.position) {
                meshRef.current.position.set(...transform.position);
            }
            if (transform.rotation) {
                meshRef.current.rotation.set(...transform.rotation);
            }
            if (transform.scale) {
                meshRef.current.scale.set(...transform.scale);
            }
        }
    }, [transform]);

    return <group ref={meshRef} />;
};

export default Model;
