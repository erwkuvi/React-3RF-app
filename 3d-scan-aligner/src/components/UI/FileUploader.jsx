import React, { useRef } from 'react';

const FileUploader = ({ onFileSelect }) => {
    const inputRef = useRef();

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file)
            onFileSelect(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file)
            onFileSelect(file);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    return (
        <div style={styles.container}>
            <div
                style={styles.dropZone}
                onClick={() => inputRef.current.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                >
                <p style={styles.text}>3D model goes here</p>
                <p style={styles.subtext}> Supports: .obj, .gltf </p>
            </div>
            <input
                ref={inputRef}
                type="file"
                accept=".obj, .gltf"
                style={{display: 'none'}}
                onChange={handleFileChange}
                />
        </div>
    );
};

const styles = {
    container: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 999
    },
    dropZone: {
        width: '400px',
        height: '200px',
        border: '3px dashed #ccc',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
    },
    text: {
        fontSize: '18px',
        fontWeight: '500',
        color: '#333',
        margin: '10px 0'
    },
    subtext: {
        fontSize: '14px',
        color: '#666'
    }
};

export default FileUploader;