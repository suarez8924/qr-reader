import QrScanner from 'qr-scanner';
import { useEffect, useRef, useState } from 'react';
import './QrReader.styles.scss';

const QrReader = () => {
  const scanner = useRef<QrScanner>();
  const videoElement = useRef<HTMLVideoElement>(null);
  const qrBoxElement = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(false);

  const [scannedResult, setScannedResult] = useState<string | undefined>('');

  const onScanSuccess = (result: QrScanner.ScanResult) => {
    console.log(result);

    setScannedResult(result?.data);
  };

  const onScanFail = (error: string | Error) => {
    console.log(error);
  };
  useEffect(() => {
    if (videoElement?.current && !scanner.current) {
      scanner.current = new QrScanner(videoElement.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: 'environment',
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxElement.current || undefined,
      });

      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((error) => {
          if (error) setQrOn(false);
        });

      return () => {
        if (!videoElement?.current) {
          scanner?.current?.stop();
        }
      };
    }
  }, []);

  useEffect(() => {
    if (!qrOn) {
      alert(
        'Camera is blocked or not accessible. Please allow access to the camera and refresh the page.'
      );
    }
  }, [qrOn]);

  return (
    <div className="qr-reader">
      <video ref={videoElement} />
      <div ref={qrBoxElement} className="qr-box">
        <span className="qr-frame" />
      </div>
      {scannedResult && (
        <p className="scanned-result">Scanned Result: {scannedResult}</p>
      )}
    </div>
  );
};

export default QrReader;
