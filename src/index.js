import { createRoot } from 'react-dom/client';
import { Game } from './components/Game';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Game />);
