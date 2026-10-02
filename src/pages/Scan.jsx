import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import { Html5Qrcode } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import '../css/Scan.css';

const Scan = () => {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const cameraStartedRef = useRef(false);
  const fileInputRef = useRef(null);
  const [scanMessage, setScanMessage] = useState('Starting camera...');

  const scannerConfig = {
    fps: 10,
    qrbox: { width: 250, height: 250 },
    aspectRatio: 1.0,
  };

  // Fungsi Paksa Henti Kamera & Matikan Stream
  const forceStopCamera = async () => {
    // 1. Hentikan scanner html5-qrcode
    if (scannerRef.current && cameraStartedRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      } catch (err) {
        // Ignore scanner shutdown errors and continue cleanup.
      } finally {
        cameraStartedRef.current = false;
      }
    }

    // 2. Turn off the camera stream physically to ensure the camera light is disabled.
    try {
      const videoElement = document.querySelector('#sc-reader video');
      if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
        videoElement.srcObject = null;
      }
    } catch (e) {
      // Ignore stream cleanup errors.
    }
  };

  const startCamera = async () => {
    if (!scannerRef.current || cameraStartedRef.current) return;

    try {
      await scannerRef.current.start(
        { facingMode: 'environment' },
        scannerConfig,
        (decodedText) => {
          navigate(`/chat/new?uid=${encodeURIComponent(decodedText)}`);
        },
        () => {}
      );
      cameraStartedRef.current = true;
      setScanMessage('Point the camera at the QR code');
    } catch {
      cameraStartedRef.current = false;
      setScanMessage('The camera could not be opened. Check camera permissions or select an image.');
    }
  };

  useEffect(() => {
    scannerRef.current = new Html5Qrcode('sc-reader');
    startCamera();

    // Cleanup apabila komponen unmount / berpindah page
    return () => {
      forceStopCamera();
      scannerRef.current = null;
    };
  }, []);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !scannerRef.current) return;

    try {
      await forceStopCamera();
      setScanMessage('Reading image...');
      const decodedText = await scannerRef.current.scanFile(file, true);
      if(decodedText) {
        navigate(`/chat/new?uid=${encodeURIComponent(decodedText)}`);
      }
    } catch {
      setScanMessage('No QR code found in the image.');
    } finally {
      event.target.value = '';
      await startCamera();
    }
  };

  const handleBack = async () => {
    await forceStopCamera();
    setTimeout(() => {
      navigate(-1)
    }, 100);
  };

  return (
    <div className="sc-container">
      <motion.div 
        className="sc-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <button onClick={handleBack} className="sc-back-btn" type="button">
          <Icon icon="mdi:chevron-left" />
        </button>
        <h1 className="sc-header-title">Scan</h1>
      </motion.div>

      <div className="sc-scanner-wrapper">
        <div id="sc-reader"></div>
        <div className="sc-overlay">
          <div className="sc-corner sc-corner-tl"></div>
          <div className="sc-corner sc-corner-tr"></div>
          <div className="sc-corner sc-corner-bl"></div>
          <div className="sc-corner sc-corner-br"></div>
        </div>
      </div>

      <p className="sc-scan-message" role="status">{scanMessage}</p>
      
      <input
        ref={fileInputRef}
        className="sc-file-input"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
      />
      <button
        className="sc-file-btn"
        type="button"
        onClick={() => fileInputRef.current?.click()}
      >
        <Icon icon="mdi:image-search-outline" />
        Scan from Image
      </button>
    </div>
  );
};

export default Scan;