import React from 'react';

const Toolbar = ({
    mode,
    onModeChange,
    onUndo,
    onRedo,
    onReset,
    canUndo,
    canRedo
                 }) => {
    return (
        <div style={styles.toolbar}>
            <div style={styles.buttonGroup}>
                <button
                    onClick={() => onModeChange('translate')}
                    style={{
                        ...styles.button,
                        ...(mode === 'translate' ? styles.activeButton : {})
                    }}
                    title={ "Move the model"}
                >
                    Translate (W)
                </button>
                <button
                    onClick={() => onModeChange('rotate')}
                    style={{
                        ...styles.button,
                        ...(mode === 'rotate' ? styles.activeButton : {})
                    }}
                    title={ "Rotate the model"}
                    >
                    Rotate (E)
                </button>
                <button
                    onClick={() => onModeChange('scale')}
                    style={{
                        ...styles.button,
                        ...(mode === 'scale' ? styles.activeButton : {})
                    }}
                    title={ "Scale the model"}
                    >
                    Scale (R)
                </button>
            </div>

            <div style={styles.buttonGroup}>
                <button
                    onClick={onUndo}
                    disabled={!canUndo}
                    style={{
                    ...styles.button,
                    ...(canUndo ? {} : styles.activeButton)
                    }}
                    title={ "Undo the last action"}
                    >
                    Undo (Ctrl + Z)
                </button>
                <button
                    onClick={onRedo}
                    disabled={!canRedo}
                    style={{
                    ...styles.button,
                    ...(canRedo ? {} : styles.activeButton)
                }}
                    title={ "Redo the last undone action"}
                    >
                    Redo (Ctrl + Y)
                </button>
                <button
                    onClick={onReset}
                    style={styles.button}
                    title={ "Reset the view to the initial position"}
                    >
                    Reset (Esc)
                    </button>
            </div>
        </div>
    );
};

const styles = {
    toolbar: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: 1000,
        gap: '10px',
        flexDirection: 'column',
        display: 'flex',
    },
    buttonGroup: {
        display: 'flex',
        gap: '8px',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    },
    button: {
        padding: '10px 20px',
        border: '1px solid #ddd',
        backgroundColor: 'white',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'all 0.2s'
    },
    activeButton: {
        backgroundColor: '#007bff',
        color: 'white',
        border: '1px solid #007bff',
    },
    disabledButton: {
        opacity: 0.5,
        cursor: 'not-allowed'
    }
};

export default Toolbar;

