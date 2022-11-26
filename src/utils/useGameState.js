import { useState } from 'react';

import { getUUID } from 'utils/getUUID';
import { gameSymbols } from 'utils/gameSymbols';

const buildInitialGameState = () =>
  Array.from({ length: 3 }, () => ({
    id: getUUID(),
    cells: Array.from({ length: 3 }, () => ({ id: getUUID() }))
  }));

const buildInitialBoardState = (board) =>
  board.reduce((map, boardRow) => {
    boardRow.cells.forEach((cell) => {
      map[cell.id] = '';
    });
    return map;
  }, {});

export const useGameState = () => {
  const [winnerExists, setWinnerExists] = useState(false);
  const [winner, setWinner] = useState('');
  const [hasTie, setHasTie] = useState(false);
  const [board, setBoard] = useState(buildInitialGameState);
  const [boardState, setBoardState] = useState(buildInitialBoardState(board));
  const [userMark, setUserMark] = useState('ai');

  const handleUpdateCellByUser = (cellId) => {
    if (winnerExists) return;
    if (userMark === 'ai') return;
    setBoardState((prev) => {
      const newState = { ...prev };
      newState[cellId] = gameSymbols[userMark];
      if (userMark === 'ai') {
        setUserMark('human');
      } else {
        setUserMark('ai');
      }
      return newState;
    });
  };

  const handleReset = () => {
    const newBoard = buildInitialGameState();
    setBoard(newBoard);
    setBoardState(buildInitialBoardState(newBoard));
    setUserMark('ai');
  };

  return {
    handleUpdateCellByUser,
    handleReset,
    hasTie,
    winner,
    boardState,
    board,
    setBoardState,
    setUserMark,
    setWinnerExists,
    setWinner,
    setHasTie,
    userMark,
    winnerExists
  };
};
