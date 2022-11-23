import { useState } from 'react';

import { getUUID } from 'utils/getUUID';
import { CellRow } from 'components/CellRow';
import { GameWrapper } from './styled-components';

export const Game = () => {
  const [board, setBoard] = useState(
    Array.from({ length: 3 }, () => {
      return {
        id: getUUID(),
        cells: Array.from({ length: 3 }, () => ({ id: getUUID(), value: '' })),
      };
    })
  );

  console.log('board', board);

  return (
    <GameWrapper>
      {board.map((row, rowIndex) => {
        return (
          <CellRow key={row.id} cells={row.cells} rowPosition={rowIndex} />
        );
      })}
    </GameWrapper>
  );
};
