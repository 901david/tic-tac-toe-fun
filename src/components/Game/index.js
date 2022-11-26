import { useCallback, useEffect } from 'react';

import { CellRow } from 'components/CellRow';
import { useAiLogic } from 'utils/useAiLogic';
import { useGameState } from 'utils/useGameState';
import { BoardValidator } from 'utils/BoardValidator';
import { GameWrapper } from './styled-components';
import { GameMessages } from '../GameMessages';

const boardValidator = new BoardValidator();

export const Game = () => {
  const gameState = useGameState();
  const aiPlayer = useAiLogic(gameState.board);

  const setWinnerState = useCallback(() => {
    const { hasWinnerExists, winner, hasTie } = boardValidator.checkForWinner(
      gameState.boardState,
      gameState.board
    );
    gameState.setWinnerExists(hasWinnerExists);
    gameState.setWinner(winner);
    gameState.setHasTie(hasTie);
  }, [gameState]);

  useEffect(() => {
    setWinnerState();
  }, [setWinnerState]);

  useEffect(() => {
    if (gameState.userMark === 'ai') {
      setTimeout(
        () =>
          aiPlayer.executeAiTurn(
            gameState.boardState,
            gameState.setBoardState,
            gameState.setUserMark
          ),
        750
      );
    }
  }, [gameState.userMark, aiPlayer.executeAiTurn]);

  return (
    <>
      <GameMessages gameState={gameState} />
      <button type="button" onClick={gameState.handleReset}>
        Reset
      </button>
      <GameWrapper>
        {gameState.board.map((row, rowIndex) => {
          return (
            <CellRow
              key={row.id}
              cells={row.cells}
              rowPosition={rowIndex}
              boardState={gameState.boardState}
              updateCellByUser={gameState.handleUpdateCellByUser}
            />
          );
        })}
      </GameWrapper>
    </>
  );
};
