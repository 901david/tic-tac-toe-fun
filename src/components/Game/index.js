import { useCallback, useEffect, useRef, useState } from 'react';

import { getUUID } from 'utils/getUUID';
import { CellRow } from 'components/CellRow';
import { GameWrapper } from './styled-components';
import { gameSymbols } from '../../utils/gameSymbols';

const buildInitialGameState = () => {
  return Array.from({ length: 3 }, () => {
    return {
      id: getUUID(),
      cells: Array.from({ length: 3 }, () => ({ id: getUUID() })),
    };
  });
};

const buildInitialBoardState = board => {
  return board.reduce((map, boardRow) => {
    boardRow.cells.forEach(cell => {
      map[cell.id] = '';
    });
    return map;
  }, {});
};

export const Game = () => {
  const [winnerExists, setWinnerExists] = useState(false);
  const [winner, setWinner] = useState('');
  const [board, setBoard] = useState(buildInitialGameState);
  const [boardState, setBoardState] = useState(buildInitialBoardState(board));
  const userMark = useRef('ai');

  const handleUpdateCellByUser = cellId => {
    setBoardState(prev => {
      const newState = { ...prev };
      newState[cellId] = gameSymbols[userMark.current];
      if (userMark.current === 'ai') {
        userMark.current = 'human';
      } else {
        userMark.current = 'ai';
      }
      return newState;
    });
  };
  const handleReset = () => {
    const newBoard = buildInitialGameState();
    setBoard(newBoard);
    setBoardState(buildInitialBoardState(newBoard));
  };

  const checkForHorizontal = useCallback(() => {
    let hasWin = false;
    let winner = '';
    board.forEach(boardRow => {
      const hasAiWinner = boardRow.cells.every(
        cell => boardState[cell.id] === gameSymbols.ai
      );
      const hasHumanWinner = boardRow.cells.every(
        cell => boardState[cell.id] === gameSymbols.human
      );

      if (hasHumanWinner || hasAiWinner) {
        hasWin = true;
      }
      if (hasHumanWinner) {
        winner = 'human';
      }
      if (hasAiWinner) {
        winner = 'ai';
      }
    });
    return { hasHorizontalWin: hasWin, horizontalWinner: winner };
  }, [boardState, board]);
  const checkForVertical = useCallback(() => {
    let hasWin = false;
    let winner = '';

    for (let i = 0; i < board.length; i++) {
      const column = [board[0].cells[i], board[1].cells[i], board[2].cells[i]];
      const hasAiWinner = column.every(
        cell => boardState[cell.id] === gameSymbols.ai
      );
      const hasHumanWinner = column.every(
        cell => boardState[cell.id] === gameSymbols.human
      );

      if (hasHumanWinner || hasAiWinner) {
        hasWin = true;
      }
      if (hasHumanWinner) {
        winner = 'human';
      }
      if (hasAiWinner) {
        winner = 'ai';
      }
    }
    return { hasVerticalWin: hasWin, verticalWinner: winner };
  }, [board, boardState]);
  const checkForDiagonal = useCallback(() => {
    let hasWin = false;
    let winner = '';

    const diag1 = [board[0].cells[0], board[1].cells[1], board[2].cells[2]];
    const diag2 = [board[0].cells[2], board[1].cells[1], board[2].cells[0]];
    console.log(
      'diag1',
      diag1.map(cell => boardState[cell.id])
    );
    console.log(
      'diag2',
      diag2.map(cell => boardState[cell.id])
    );
    const hasAiWinner =
      diag1.every(cell => boardState[cell.id] === gameSymbols.ai) ||
      diag2.every(cell => boardState[cell.id] === gameSymbols.ai);
    const hasHumanWinner =
      diag1.every(cell => boardState[cell.id] === gameSymbols.human) ||
      diag2.every(cell => boardState[cell.id] === gameSymbols.human);

    if (hasHumanWinner || hasAiWinner) {
      hasWin = true;
    }
    if (hasHumanWinner) {
      winner = 'human';
    }
    if (hasAiWinner) {
      winner = 'ai';
    }
    return { hasDiagonalWin: hasWin, diagonalWinner: winner };
  }, [board, boardState]);

  const checkForWinner = useCallback(() => {
    const { hasHorizontalWin, horizontalWinner } = checkForHorizontal();
    const { hasVerticalWin, verticalWinner } = checkForVertical();
    const { hasDiagonalWin, diagonalWinner } = checkForDiagonal();

    setWinnerExists(hasHorizontalWin || hasVerticalWin || hasDiagonalWin);
    setWinner(horizontalWinner || verticalWinner || diagonalWinner);
  }, [checkForHorizontal, checkForVertical, checkForDiagonal]);

  useEffect(() => {
    checkForWinner();
  }, [checkForWinner]);

  return (
    <>
      {winnerExists ? (
        <>
          <h3>Winner!</h3>
          <h4>{winner} has won.</h4>
        </>
      ) : null}
      <button type='button' onClick={handleReset}>
        Reset
      </button>
      <GameWrapper>
        {board.map((row, rowIndex) => {
          return (
            <CellRow
              key={row.id}
              cells={row.cells}
              rowPosition={rowIndex}
              boardState={boardState}
              updateCellByUser={handleUpdateCellByUser}
            />
          );
        })}
      </GameWrapper>
    </>
  );
};
