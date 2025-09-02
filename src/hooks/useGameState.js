import { useEffect, useState } from "react";
import { useGameStore } from "../store/gameStore";

export function useGameState() {
  const store = useGameStore();
  const [state, setState] = useState(store.getState ? store.getState() : store);
  useEffect(() => {
    const unsub = useGameStore.subscribe(setState);
    return unsub;
  }, []);
  return state;
}
