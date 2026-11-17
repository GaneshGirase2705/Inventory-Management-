import React, { useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

const ScannerComponent = () => {
    const [scanResult, setScanResult] = useState(null);

    React.useEffect(() => {
        const scanner = new Html5QrcodeScanner("reader", {
            fps: 10,
            qrbox: {width: 250, height: 250}
        });

        scanner.render((result) => {
            scanner.clear();
            setScanResult(result);
            // Logic to send 'result' to backend
        }, (error) => {
            console.warn(error);
        });
    }, []);

    return (
        <div className="p-4">
            <div id="reader"></div>
            {scanResult && <p>Scanned: {scanResult}</p>}
        </div>
    );
};

export default ScannerComponent;
