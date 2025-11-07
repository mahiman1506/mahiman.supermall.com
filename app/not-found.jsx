"use client";

import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function NotFoundGame2D() {
    const canvasRef = useRef(null);

    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0); // High score state
    const [showRestartPopup, setShowRestartPopup] = useState(false);

    const playerY = useRef(0);
    const velocity = useRef(0);
    const obstacles = useRef([{ x: 500, width: 50, height: 120 }]);
    const frameCount = useRef(0);
    const alertShown = useRef(false);

    const gravity = 0.6;
    const jumpStrength = 20;

    const baseObstacleSpeed = 3;
    const maxObstacleSpeed = 12;
    const speedThreshold = 200;
    const accelerationRate = 0.01;
    const obstacleSpeedRef = useRef(baseObstacleSpeed);

    const personImg = useRef(null);
    const buildingImg = useRef(null);

    // Load images on mount
    useEffect(() => {
        if (typeof window !== "undefined") {
            personImg.current = new window.Image();
            buildingImg.current = new window.Image();

            const personSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path d="M376 88C376 57.1 350.9 32 320 32C289.1 32 264 57.1 264 88C264 118.9 289.1 144 320 144C350.9 144 376 118.9 376 88zM400 300.7L446.3 363.1C456.8 377.3 476.9 380.3 491.1 369.7C505.3 359.1 508.3 339.1 497.7 324.9L427.2 229.9C402 196 362.3 176 320 176C277.7 176 238 196 212.8 229.9L142.3 324.9C131.8 339.1 134.7 359.1 148.9 369.7C163.1 380.3 183.1 377.3 193.7 363.1L240 300.7L240 576C240 593.7 254.3 608 272 608C289.7 608 304 593.7 304 576L304 416C304 407.2 311.2 400 320 400C328.8 400 336 407.2 336 416L336 576C336 593.7 350.3 608 368 608C385.7 608 400 593.7 400 576L400 300.7z"/>
            </svg>`;

            const buildingSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                <path d="M192 64C156.7 64 128 92.7 128 128L128 512C128 547.3 156.7 576 192 576L448 576C483.3 576 512 547.3 512 512L512 128C512 92.7 483.3 64 448 64L192 64zM304 416L336 416C353.7 416 368 430.3 368 448L368 528L272 528L272 448C272 430.3 286.3 416 304 416zM224 176C224 167.2 231.2 160 240 160L272 160C280.8 160 288 167.2 288 176L288 208C288 216.8 280.8 224 272 224L240 224C231.2 224 224 216.8 224 208L224 176zM368 160L400 160C408.8 160 416 167.2 416 176L416 208C416 216.8 408.8 224 400 224L368 224C359.2 224 352 216.8 352 208L352 176C352 167.2 359.2 160 368 160zM224 304C224 295.2 231.2 288 240 288L272 288C280.8 288 288 295.2 288 304L288 336C288 344.8 280.8 352 272 352L240 352C231.2 352 224 344.8 224 336L224 304zM368 288L400 288C408.8 288 416 295.2 416 304L416 336C416 344.8 408.8 352 400 352L368 352C359.2 352 352 344.8 352 336L352 304C352 295.2 359.2 288 368 288z"/>
            </svg>`;

            personImg.current.src = `data:image/svg+xml;base64,${btoa(personSVG)}`;
            buildingImg.current.src = `data:image/svg+xml;base64,${btoa(buildingSVG)}`;
        }

        // Load high score from localStorage
        const storedHighScore = parseInt(localStorage.getItem("highScore") || "0");
        setHighScore(storedHighScore);
    }, []);

    const gameRestart = () => {
        // Update high score if needed
        setHighScore((prev) => {
            const newHigh = Math.max(prev, Math.floor(score));
            localStorage.setItem("highScore", newHigh); // Persist in localStorage
            return newHigh;
        });

        playerY.current = 0;
        velocity.current = 0;
        obstacles.current = [{ x: 500, width: 50, height: 120 }];
        frameCount.current = 0;
        alertShown.current = false;
        obstacleSpeedRef.current = baseObstacleSpeed;

        setScore(0);
        setGameOver(false);
        setShowRestartPopup(false);
        setGameStarted(true);
    };

    const handleKeyDown = (e) => {
        if (e.code === "Space") {
            if (!gameStarted) setGameStarted(true);
            else if (!gameOver && playerY.current === 0) velocity.current = jumpStrength;
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        let animationFrame;

        const loop = () => {
            const canvasWidth = Math.min(window.innerWidth * 0.8, 800);
            const canvasHeight = Math.min(window.innerHeight * 0.6, 400);
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            const playerX = canvasWidth * 0.1;
            const playerSize = canvasWidth * 0.07;

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Background gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, "#a1c4fd");
            gradient.addColorStop(1, "#c2e9fb");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (gameStarted && !gameOver) {
                if (score > speedThreshold) {
                    const extraSpeed = (score - speedThreshold) * accelerationRate * 0.01;
                    obstacleSpeedRef.current = Math.min(baseObstacleSpeed + extraSpeed, maxObstacleSpeed);
                }

                // Player physics
                let newY = playerY.current + velocity.current;
                let newVelocity = velocity.current - gravity;
                if (newY <= 0) {
                    newY = 0;
                    newVelocity = 0;
                }
                playerY.current = newY;
                velocity.current = newVelocity;

                // Draw player
                ctx.drawImage(
                    personImg.current,
                    playerX,
                    canvas.height - playerSize - 50 - newY,
                    playerSize,
                    playerSize
                );

                // Obstacles
                obstacles.current = obstacles.current.map((obs) => {
                    let newX = obs.x - obstacleSpeedRef.current;
                    if (newX < -obs.width) newX = canvas.width + Math.random() * 300;

                    if (
                        playerX + playerSize > newX &&
                        playerX < newX + obs.width &&
                        newY < obs.height
                    ) {
                        if (!alertShown.current) {
                            alertShown.current = true;
                            alert("Game Over! Your Score: " + Math.floor(score));
                            setGameOver(true);
                            setGameStarted(false);
                            setShowRestartPopup(true);
                        }
                    }

                    ctx.drawImage(
                        buildingImg.current,
                        newX,
                        canvas.height - obs.height,
                        obs.width,
                        obs.height
                    );

                    return { ...obs, x: newX };
                });

                // Score increment
                frameCount.current++;
                if (frameCount.current % 5 === 0) setScore((s) => s + 1);

                // Display current score
                ctx.fillStyle = "#fff";
                ctx.strokeStyle = "#000";
                ctx.lineWidth = 2;
                ctx.font = `${Math.floor(canvas.width * 0.03)}px 'Arial Black'`;
                ctx.strokeText("Score: " + score, 20, 50);
                ctx.fillText("Score: " + score, 20, 50);

                // Display high score
                ctx.strokeText("High Score: " + highScore, 20, 90);
                ctx.fillText("High Score: " + highScore, 20, 90);
            }

            animationFrame = requestAnimationFrame(loop);
        };

        window.addEventListener("keydown", handleKeyDown);
        animationFrame = requestAnimationFrame(loop);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            cancelAnimationFrame(animationFrame);
        };
    }, [score, gameStarted, gameOver, highScore]);

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
                fontFamily: "'Arial', sans-serif",
                backgroundColor: "#f0f0f0",
            }}
        >
            <h1
                style={{
                    color: "#333",
                    textShadow: "2px 2px #fff",
                    textAlign: "center",
                    marginBottom: 10,
                    fontSize: "2rem",
                }}
            >
                404 - Press SPACE to {!gameStarted ? "start" : "jump"}!
            </h1>
            <Link href={"/"}>
                <button className="flex gap-2">
                    <HomeIcon className="h-5 w-5" />
                    Go To Home
                </button>
            </Link>
            <canvas
                ref={canvasRef}
                style={{
                    borderRadius: "16px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                    backgroundColor: "#fff",
                }}
            />
            {showRestartPopup && (
                <button
                    onClick={gameRestart}
                    style={{
                        marginTop: 20,
                        padding: "12px 28px",
                        fontSize: "1.5rem",
                        cursor: "pointer",
                        borderRadius: "12px",
                        backgroundColor: "#ff4d4d",
                        color: "#fff",
                        boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                        transition: "0.2s all ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#ff1a1a")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#ff4d4d")}
                >
                    Restart
                </button>
            )}
        </div>
    );
}
