import React, {Ref, useEffect, useState} from "react";
import Webcam from "react-webcam";
import {Camera} from '@mediapipe/camera_utils'
import { createWorker } from 'tesseract.js';

const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
};

function OCR() {
    const [detectedText, setDetectedText] = useState<string>('');

    const webcamRef = React.useRef<Webcam>(null);
    const canvasReference = React.useRef<HTMLCanvasElement>(null);
    let canvasCtx: any;
    let camera: Camera;

    // const onResults = (results: { multiHandLandmarks?: NormalizedLandmarkList[] | undefined; multiHandedness?: Handedness[] | undefined; }) => {
    //     // console.log(results)
    //
    //     canvasReference.current && (canvasCtx = canvasReference.current.getContext('2d'));
    //     if(canvasCtx) {
    //         webcamRef.current && webcamRef.current.video && (canvasCtx.width = webcamRef.current.video.videoWidth);
    //         webcamRef.current && webcamRef.current.video && (canvasCtx.height = webcamRef.current.video.videoHeight);
    //         canvasCtx.save();
    //         canvasReference.current && canvasCtx.clearRect(0, 0, canvasReference.current.width, canvasReference.current.height);
    //         // Webcam feed again
    //         // canvasCtx.drawImage(results.image, 0, 0, canvasReference.current.width, canvasReference.current.height);
    //
    //         canvasCtx.fillStyle = "black";
    //         canvasCtx.fillRect(0, 0, canvasCtx.width, canvasCtx.height);
    //
    //         }
    //         canvasCtx.restore();
    //     }
    // }

    useEffect(() => {

        if (webcamRef.current && webcamRef.current.video) {
            camera = new Camera(webcamRef.current.video, {
                onFrame: async () => {
                    // @ts-ignore
                    // await hands.send({image: webcamRef.current.video});
                    // canvasReference.current && (canvasCtx = canvasReference.current.getContext('2d'));
                    const webcamCanvas = webcamRef.current.getCanvas();
                    canvasReference.current && (canvasCtx = canvasReference.current.getContext('2d'));
                    if(webcamRef.current && webcamRef.current.video && webcamCanvas && canvasCtx) {
                        const worker = createWorker({
                            logger: (m) => console.log(m),
                        });
                        webcamRef.current && webcamRef.current.video && (canvasCtx.width = webcamRef.current.video.videoWidth);
                        webcamRef.current && webcamRef.current.video && (canvasCtx.height = webcamRef.current.video.videoHeight);
                        canvasCtx.save();
                        // canvasReference.current && canvasCtx.clearRect(0, 0, canvasReference.current.width, canvasReference.current.height);

                        // canvasReference.current && canvasCtx.drawImage(canvasCtx.getImageData(50,50,100,100)., 50, 50, canvasReference.current.width, canvasReference.current.height);
                        // canvasCtx.drawImage(
                        //     canvasReference,
                        //     5,
                        //     5,
                        //     10,
                        //     10,
                        //     20,
                        //     20,
                        //     10,
                        //     10
                        // );
                        // canvasCtx.drawImage(results.image, 0, 0, canvasReference.current.width, canvasReference.current.height);
                        await worker.load();
                        await worker.loadLanguage('eng');
                        await worker.initialize('eng');
                        const { data: { text } } = await worker.recognize(webcamCanvas);
                        console.log(text);
                        setDetectedText(text);
                        await worker.terminate();
                    }
                    else {return;}
                },
                width: 1280,
                height: 720,
            });

            camera.start().then();
        }
    }, [webcamRef]);

    return (
        <div className="App">
            <h1>Detected text: {detectedText}</h1>
            <Webcam
                audio={false}
                height={720}
                ref={webcamRef}
                mirrored={false}
                screenshotFormat="image/jpeg"
                width={1280}
                videoConstraints={videoConstraints}
                onUserMedia={() => {
                    // console.log('webcamRef.current', webcamRef.current);
                    // navigator.mediaDevices
                    //   .getUserMedia({ video: true })
                    //   .then(stream => webcamRef.current.srcObject = stream)
                    //   .catch(console.log);

                    // setCameraReady(true)
                }}
            />
            <canvas
                ref={canvasReference}
                style={{
                    position: "absolute",
                    marginLeft: "auto",
                    marginRight: "auto",
                    top: 0,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    zIndex: 9,
                    // width: window.innerWidth,
                    width: 1280,
                    // height: window.innerHeight,
                    height: 780,
                }}
            />
        </div>
    );
}

export default OCR;
