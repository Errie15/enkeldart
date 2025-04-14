import { GameProvider } from '../contexts/GameContext';
import DartGame from '../components/DartGame';

export default function Home() {
  return (
    <GameProvider>
      <DartGame />
    </GameProvider>
  );
}
