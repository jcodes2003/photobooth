'use client';
import React, { useRef, useCallback, useState } from "react";
import { FaHeart } from "react-icons/fa6";
import Webcam from "react-webcam";
import "./globals.css";
import Background from "./component/Background";
import CameraControls from "./component/CameraControls";
import LayoutSelector from "./component/LayoutSelector";
import LayoutWithImages from "./component/LayoutWithImages";
import html2canvas from "html2canvas";

const layouts = [
	{ label: "2x2 Grid", value: "grid" },
	{ label: "Horizontal Row", value: "row" },
	{ label: "Vertical Column", value: "column" },
	{ label: "Single Large Image", value: "single" },
];

const cameraFrameClass =
	"relative flex items-center justify-center bg-white rounded-xl shadow-lg border-4 border-pink-300 overflow-hidden";
const heartClass =
	"absolute text-pink-400 drop-shadow-lg z-10";

const Page = () => {
	const webcamRef = useRef(null);
	const layoutRef = useRef(null);
	const [selectedLayout, setSelectedLayout] = useState(layouts[0].value);
	const [capturedImages, setCapturedImages] = useState([
		null, null, null, null
	]); // for up to 4 images
	const [isCounting, setIsCounting] = useState(false);
	const [count, setCount] = useState(0);

	const handleUserMediaError = useCallback((err) => {
		alert("Camera access denied or not available.");
		console.error(err);
	}, []);

	const handleTakePhoto = () => {
		if (isCounting) return; // Prevent double click
		setIsCounting(true);
		setCount(5);
		let timer = 5;
		const interval = setInterval(() => {
			timer--;
			setCount(timer);
			if (timer === 0) {
				clearInterval(interval);
				setIsCounting(false);
				if (webcamRef.current) {
					const imageSrc = webcamRef.current.getScreenshot();
					// Find first empty slot, or replace the last one if all are filled
					const idx = capturedImages.findIndex((img) => img === null);
					if (idx !== -1) {
						const newImages = [...capturedImages];
						newImages[idx] = imageSrc;
						setCapturedImages(newImages);
					} else {
						// Replace the last image if all slots are filled
						const newImages = [...capturedImages.slice(1), imageSrc];
						setCapturedImages(newImages);
					}
				}
			}
		}, 1000);
	};

	const handleClearAll = () => setCapturedImages([null, null, null, null]);

	const handleSaveLayout = async () => {
		if (layoutRef.current) {
			const prevWidth = layoutRef.current.style.width;
			const prevDisplay = layoutRef.current.style.display;
			const prevJustify = layoutRef.current.style.justifyContent;
			const prevAlign = layoutRef.current.style.alignItems;
			const prevPadding = layoutRef.current.style.padding;

			if (selectedLayout === 'row') {
				// Always reserve space for 4 images (even if some are null)
				const imgSize = 220; // px, adjust to match your image/card size
				const gap = 24; // px, adjust to match your gap-6
				const count = 4;
				const totalWidth = count * imgSize + (count - 1) * gap;
				layoutRef.current.style.width = totalWidth + 'px';
				layoutRef.current.style.display = 'flex';
				layoutRef.current.style.justifyContent = 'flex-start';
				layoutRef.current.style.alignItems = 'center';
				layoutRef.current.style.padding = '0';
			} else {
				layoutRef.current.style.width = '900px';
			}

			const canvas = await html2canvas(layoutRef.current, { useCORS: true });

			// Restore previous styles
			layoutRef.current.style.width = prevWidth;
			layoutRef.current.style.display = prevDisplay;
			layoutRef.current.style.justifyContent = prevJustify;
			layoutRef.current.style.alignItems = prevAlign;
			layoutRef.current.style.padding = prevPadding;

			const dataUrl = canvas.toDataURL("image/png");
			const link = document.createElement("a");
			link.href = dataUrl;
			link.download = "photobooth-layout.png";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	};

	const handleSaveAllPhotos = () => {
		capturedImages.forEach((img, idx) => {
			if (img) {
				const link = document.createElement('a');
				link.href = img;
				link.download = `photobooth-photo-${idx + 1}.jpg`;
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		});
	};

	const currentLayout = layouts.find((l) => l.value === selectedLayout);

	return (
		<Background>
			<div className="flex flex-col min-h-screen px-2">
				<h1 className="text-3xl md:text-5xl flex items-center gap-2 font-pacifico mb-10 text-center w-full justify-center text-black sticky top-0 z-30 bg-transparent">
					Photo Booth <FaHeart color="red" />
				</h1>
				<div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-12 w-full max-w-7xl mx-auto flex-1">
					{/* Camera and controls */}
					<div className="flex flex-col items-center w-full md:w-auto">
						{/* Camera box with only the live camera view */}
						<div className={cameraFrameClass + " w-full max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-2xl aspect-video lg:mb-8"}>
							<Webcam
								audio={false}
								ref={webcamRef}
								height={480} // bigger for web
								width={720}  // bigger for web
								onUserMediaError={handleUserMediaError}
								screenshotFormat="image/jpeg"
								videoConstraints={{
									width: 720,
									height: 480,
									facingMode: "user",
								}}
								className="rounded-lg w-full h-full object-cover sm:max-w-sm md:max-w-xl lg:max-w-2xl"
							/>
							{isCounting && (
								<div className="absolute inset-0 flex items-center justify-center z-20">
									<span className="text-white text-6xl font-bold">{count}</span>
								</div>
							)}
						</div>
						<CameraControls
							handleTakePhoto={handleTakePhoto}
							handleClearAll={handleClearAll}
							isCounting={isCounting}
						/>
						{/* Save Image Button */}
						{capturedImages.some(img => img) && (
							<button
								className="bg-green-500 text-white py-2 px-4 rounded mt-2 w-full max-w-xs sm:max-w-sm"
								onClick={() => {
									// Find the last non-null image
									const lastImg = [...capturedImages].reverse().find(img => img);
									if (lastImg) {
										const link = document.createElement('a');
										link.href = lastImg;
										link.download = 'photobooth.jpg';
										document.body.appendChild(link);
										link.click();
										document.body.removeChild(link);
									}
								}}
							>
								Save Last Photo
							</button>
						)}
						<button
							className="bg-purple-500 text-white py-2 px-4 rounded mt-2 w-full max-w-xs sm:max-w-sm"
							onClick={handleSaveLayout}
						>
							Save Layout as Image
						</button>
						<LayoutSelector
							layouts={layouts}
							selectedLayout={selectedLayout}
							setSelectedLayout={setSelectedLayout}
						/>
						{/* Save All Photos Button */}
						{capturedImages.some(img => img) && (
							<button
								className="bg-blue-500 text-white py-2 px-4 rounded mt-2 w-full max-w-xs sm:max-w-sm"
								onClick={handleSaveAllPhotos}
							>
								Save All Photos
							</button>
						)}
					</div>
					{/* Layout beside or below camera */}
					<div
						ref={layoutRef}
						className="flex flex-col items-center overflow-x-auto"
						style={{ minWidth: '320px', width: '100%', maxWidth: '900px' }}
					>
						<h2 className="text-lg md:text-2xl font-semibold mb-4 text-center w-full">
						</h2>
						<div className="w-full flex justify-center">
							<div className="w-full">
								<LayoutWithImages
									selectedLayout={selectedLayout}
									capturedImages={capturedImages}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Background>
	);
};

export default Page;
