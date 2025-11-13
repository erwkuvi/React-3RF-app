import React, { useState, useRef, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

const CircumferenceTool = ({
                               model,
                               enabled = true,
                               onMeasurementChange
}) => {
    const { scene, camera, raycaster, gl } = useThree();
    const [points, setPoints] = useState([]);
    const [circumference, setCircumference] = useState(0);
    const [slicePlaneY, setSlicePlaneY] = useState(0);
    const lineRef = useRef();
    const pointsGroupRef = useRef();

    // Calculaition of the ellipse circumference with Ramanujan's approximation
    const calculateEllipseCircumference = (points) => {
        if (points.length < 3) return 0;

        const center = new THREE.Vector3();
        points.forEach(p => center.add(p));
        center.divideScalar(points.length);

        const distances = points.map(p => p.distanceTo(center));
        const maxRadius = Math.max(...distances);
        const minRadius = Math.min(...distances);

        const a = maxRadius;
        const b = minRadius;
        const h = Math.pow(a - b, 2) / Math.pow((a + b), 2);

        return Math.PI * (a + b) * (1 + (3 * h) / (10 + Math.sqrt(4 - 3 * h)));
    };

    const calculateCircleCircumference = (points) => {
        if (points.length < 3) return 0;

        const center = new THREE.Vector3();
        points.forEach(p => center.add(p));
        center.divideScalar(points.length);

        const avgRadius = points.reduce((sum, p) =>
            sum + p.distanceTo(center), 0
        ) / points.length;

        return 2 * Math.PI * avgRadius;
    }

    const handleClick = (event) => {
        if (!enabled || !model) return;

        const rect = gl.domElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
        const intersects = raycaster.intersectObject(model, true);

        if (intersects.length > 0) {
            const point = intersects[0].point.clone();
            setPoints(prev => [...prev, point]);
        }
    };

    useEffect(() => {
        if (points.length >= 3) {
            const circ = calculateEllipseCircumference(points);
            setCircumference(circ);

            if (onMeasurementChange) {
                onMeasurementChange({
                    circumference: circ,
                    points: points.length,
                    method: 'ellipse'
                });
            }
        }
        }, [points, onMeasurementChange]
    );

    useEffect(() => {
        if (!enabled) return;

        const canvas = gl.domElement;
        canvas.addEventListener('click', handleClick);

        return () => {
            canvas.removeEventListener('click', handleClick);
        };
    }, [enabled, model, gl.domElement]);

    useFrame(() => {
        if (lineRef.current && points.length > 1){
            const positions = [];
            points.forEach(p => {
                positions.push(p.x, p.y, p.z);
            });

            if (points.length > 2) {
                positions.push(points[0].x, points[0].y, points[0].z);
            }

            lineRef.current.geometry.setFromPoints(
                positions.reduce((acc, _, i, arr) => {
                    if (i % 3 === 0) {
                        acc.push(new THREE.Vector3(arr[i], arr[i + 1], arr[i + 2]));
                    }
                    return acc;
                }, [])
            );
        }
    });

    // Clear points function
    const clearPoints = () => {
        setPoints([]);
        setCircumference(0);
        if (onMeasurementChange) {
            onMeasurementChange({ circumference: 0, points: 0, method: 'none' });
        }
    };

    //export clear function
    useEffect(() => {
        window.clearMeasurement = clearPoints;
        return () => {
            delete window.clearMeasurement;
        };
    }, []);

    if (!enabled) return null;

    return (
        <group>
            {/* Render measurement points*/}
            <group ref={pointsGroupRef}>
                {points.map((point, index) => (
                    <mesh key={index} position={[point.x, point.y, point.z]}>
                        <sphereGeometry args={[0.05, 16, 16]} />
                        <meshBasicMaterial color="#ff0000" />
                        <Html distanceFactor={10}>
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.9)',
                                padding: '2px 6px',
                                borderRadius: '4px',
                                fontSize: '10px',
                                whiteSpace: 'nowrap'
                            }}>
                                P{index + 1}
                            </div>
                            </Html>
                        </mesh>
                ))}
            </group>

            {/* Render connecting line*/}
            {points.length > 1 && (
                <line ref={lineRef}>
                    <bufferGeometry />
                    <lineBasicMaterial color="#00ff00" linewidth={2} />
                </line>
            )}
            {/* Render slice plane indicator */}
            <mesh
                position={[0, slicePlaneY, 0]}
                rotation={[-Math.PI / 2, 0, 0]}
                >
                <planeGeometry args={[10, 10]} />
                <meshBasicMaterial
                    color="#ffff00"
                    transparent
                    opacity={0.2}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
};

export default CircumferenceTool;