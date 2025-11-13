import React from 'react';

const MeasurementDisplay = ({
    circumference,
    pointCount = 0,
    onClear,
    onExport,
    enabled = false
}) => {

    const handleExport = () => {
        const data = {
            circumference: circumference,
            points: pointCount,
            timestamp: new Date().toISOString(),
            unit: 'units'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `measurement_${new Date().toISOString()}.json`;
        a.click();
        URL.revokeObjectURL(url);

        if (onExport) onExport(data);
    };

    if (!enabled) return null;

    return (
        <div style={styles.container}>
            <h3 style={styles.title}>Measurements</h3>

            { circumference > 0 ? (
                <>
                    <div style={styles.measurements}>
                        <div style={styles.measurementRow}>
                            <span style={styles.label}>Circumference:</span>
                            <span style={styles.value}>
                                {circumference.toFixed(3)} units
                            </span>
                        </div>
                        <div style={styles.measurementRow}>
                            <span style={styles.label}>Points:</span>
                            <span style={styles.value}>{pointCount}</span>
                        </div>
                        <div style={styles.measurementRow}>
                            <span style={styles.label}>Diameter (approx):</span>
                            <span style={styles.value}>
                            {(circumference / Math.PI).toFixed(3)} units
                        </span>
                        </div>
                    </div>

                    <div style={styles.buttons}>
                        <button onClick={onClear} style={styles.button}>
                            Clear
                        </button>
                        <button onClick={handleExport} style={styles.button}>
                            Export
                        </button>
                    </div>
                </>
            ) : (
                <div style={styles.hint}>
                    <p>Click on the model to add measurement points</p>
                    <p style={styles.subhint}> Add at least 3 points to calculate circumference</p>
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        position: 'absolute',
        bottom:'20px',
        right: '20px',
        background: 'rgba(255, 255, 255, 0.9)',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        minWidth: '250px',
        maxWidth: '300px',
        zIndex: 1000
    },
    title: {
        fontSize: '18px',
        fontWeight: '600',
        margin: '0 0 16px 0',
        color: '#333',
        borderBottom: '1px solid #ddd',
        paddingBottom: '8px'
    },
    measurements: {
        marginBlock: '16px'
    },
    measurementRow: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '8px 0',
        borderBottom: '1px solid #eee'
    },
    label: {
        fontSize: '14px',
        color: '#666',
        fontWeight: '500'
    },
    value: {
        fontsize: '18px',
        fontWeight: 'bold',
        margin: '10px 0'
    },
    subhint: {
        fontSize: '12px',
        color: '#999',
        marginTop: '8px'
    },
    hint: {
        fontSize: '14px',
        color: '#666'
    },
    buttons: {
        display: 'flex',
        gap: '8px',
        marginTop: '12px'
    },
    button: {
        flex: 1,
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        background: 'white',
        cursor: 'pointer'
    }
};

export default MeasurementDisplay;