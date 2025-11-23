import { useEffect, useRef, useState, useCallback } from "react";

// useTimer: simple countdown timer hook
// params: seconds (initial seconds), autoStart (bool)
// returns: { secondsLeft, isRunning, start, pause, reset }

export default function useTimer(initialSeconds = 60, { autoStart = false } = {}) {
	const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
	const [isRunning, setIsRunning] = useState(autoStart);
	const intervalRef = useRef(null);

	const tick = useCallback(() => {
		setSecondsLeft((s) => {
			if (s <= 1) {
				// stop
				clearInterval(intervalRef.current);
				intervalRef.current = null;
				setIsRunning(false);
				return 0;
			}
			return s - 1;
		});
	}, []);

	useEffect(() => {
		if (isRunning && !intervalRef.current) {
			intervalRef.current = setInterval(tick, 1000);
		}
		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
				intervalRef.current = null;
			}
		};
	}, [isRunning, tick]);

	const start = useCallback(() => {
		if (!isRunning) setIsRunning(true);
	}, [isRunning]);

	const pause = useCallback(() => {
		setIsRunning(false);
		if (intervalRef.current) {
			clearInterval(intervalRef.current);
			intervalRef.current = null;
		}
	}, []);

	const reset = useCallback((newSeconds = initialSeconds) => {
		pause();
		setSecondsLeft(newSeconds);
	}, [initialSeconds, pause]);

	// sync initialSeconds when it changes
	useEffect(() => {
		setSecondsLeft(initialSeconds);
	}, [initialSeconds]);

	return { secondsLeft, isRunning, start, pause, reset };
}

