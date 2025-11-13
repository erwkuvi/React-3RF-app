import React, { useRef, useEffect, useState } from 'react';
import { TransformControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

const ManualAlignment = ({
                             targetObject,
                             mode = 'translate',
                             onTransformChange,
                             enabled = true
}) => {
    const transformRef = useRef();
    const { gl, camera } = useThree();

    useEffect(() => {
        if (!transformRef.current) return;
        const controls = transformRef.current;

        const onChange = () => {
            if (onTransformChange && targetObject){
                onTransformChange({
                    position: targetObject.position.toArray(),
                    rotation: targetObject.rotation.toArray(),
                    quaternion: targetObject.quaternion.toArray()
                });
            }
        };

        controls.addEventListener('change', onChange);

        return () => {
          controls.removeEventListener('change', onChange);
        };
    }, [targetObject, onTransformChange]);

    if (!targetObject || !enabled) return null;

    return (
        <TransformControls
            ref={transformRef}
            object={targetObject}
            mode={mode}
            translationSnap={0.1}
            rotationSnap={Math.PI / 16}
            scaleSnap={0.1}
            showX
            showY
            showZ
        />
    );
};

export default ManualAlignment;