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

const minMaxMap = {
  ai: 10,
  tie: 0,
  human: -10,
};

export const Game = () => {
  const [winnerExists, setWinnerExists] = useState(false);
  const [winner, setWinner] = useState('');
  const [hasTie, setHasTie] = useState(false);
  const [board, setBoard] = useState(buildInitialGameState);
  const [boardState, setBoardState] = useState(buildInitialBoardState(board));
  const [userMark, setUserMark] = useState('ai');
  console.log(
    'YOUR BOARD',
    board.map(boardRow => boardRow.cells.map(cell => boardState[cell.id]))
  );
  const handleUpdateCellByUser = cellId => {
    if (winnerExists) return;
    if (userMark === 'ai') return;
    setBoardState(prev => {
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

    setTimeout(() => setUserMark('ai'), 0);
  };

  const checkForHorizontal = useCallback(
    currentBoardState => {
      let hasWin = false;
      let winner = '';
      board.forEach(boardRow => {
        const hasAiWinner = boardRow.cells.every(
          cell => currentBoardState[cell.id] === gameSymbols.ai
        );
        const hasHumanWinner = boardRow.cells.every(
          cell => currentBoardState[cell.id] === gameSymbols.human
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
    },
    [board]
  );
  const checkForVertical = useCallback(
    currentBoardState => {
      let hasWin = false;
      let winner = '';

      for (let i = 0; i < board.length; i++) {
        const column = [
          board[0].cells[i],
          board[1].cells[i],
          board[2].cells[i],
        ];
        const hasAiWinner = column.every(
          cell => currentBoardState[cell.id] === gameSymbols.ai
        );
        const hasHumanWinner = column.every(
          cell => currentBoardState[cell.id] === gameSymbols.human
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
    },
    [board]
  );
  const checkForDiagonal = useCallback(
    currentBoardState => {
      let hasWin = false;
      let winner = '';

      const diag1 = [board[0].cells[0], board[1].cells[1], board[2].cells[2]];
      const diag2 = [board[0].cells[2], board[1].cells[1], board[2].cells[0]];
      const hasAiWinner =
        diag1.every(cell => currentBoardState[cell.id] === gameSymbols.ai) ||
        diag2.every(cell => currentBoardState[cell.id] === gameSymbols.ai);
      const hasHumanWinner =
        diag1.every(cell => currentBoardState[cell.id] === gameSymbols.human) ||
        diag2.every(cell => currentBoardState[cell.id] === gameSymbols.human);

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
    },
    [board]
  );

  const checkForWinner = useCallback(
    currentBoardState => {
      const { hasHorizontalWin, horizontalWinner } =
        checkForHorizontal(currentBoardState);
      const { hasVerticalWin, verticalWinner } =
        checkForVertical(currentBoardState);
      const { hasDiagonalWin, diagonalWinner } =
        checkForDiagonal(currentBoardState);
      const isFullTable = board.every(boardRow =>
        boardRow.cells.every(cell => currentBoardState[cell.id] !== '')
      );
      const hasTie =
        !hasHorizontalWin && !hasVerticalWin && !hasDiagonalWin && isFullTable;
      return {
        hasWinnerExists: hasHorizontalWin || hasVerticalWin || hasDiagonalWin,
        winner: horizontalWinner || verticalWinner || diagonalWinner,
        hasTie,
      };
    },
    [checkForHorizontal, checkForVertical, checkForDiagonal, board]
  );

  const setWinnerState = useCallback(() => {
    const { hasWinnerExists, winner, hasTie } = checkForWinner(boardState);
    setWinnerExists(hasWinnerExists);
    setWinner(winner);
    setHasTie(hasTie);
  }, [checkForWinner, boardState]);

  useEffect(() => {
    setWinnerState();
  }, [setWinnerState]);

  const minMax = useCallback(
    (localBoardState, isMaximizing, depth = 0) => {
      const { hasWinnerExists, winner, hasTie } =
        checkForWinner(localBoardState);
      if (hasWinnerExists) {
        return minMaxMap[winner] - depth;
      }
      if (hasTie) {
        return minMaxMap.tie;
      }
      if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
          for (let j = 0; j < board[i].cells.length; j++) {
            if (localBoardState[board[i].cells[j].id] === '') {
              localBoardState[board[i].cells[j].id] = gameSymbols.ai;
              const score = minMax(localBoardState, false, depth + 1);
              localBoardState[board[i].cells[j].id] = '';
              bestScore = Math.max(bestScore, score);
            }
          }
        }
        return bestScore;
      } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
          for (let j = 0; j < board[i].cells.length; j++) {
            if (localBoardState[board[i].cells[j].id] === '') {
              localBoardState[board[i].cells[j].id] = gameSymbols.human;
              const score = minMax(localBoardState, true, depth + 1);
              localBoardState[board[i].cells[j].id] = '';
              bestScore = Math.min(bestScore, score);
            }
          }
        }
        return bestScore;
      }
    },
    [checkForWinner, board]
  );

  const nextBestMove = useCallback(
    currentBoardState => {
      let bestScore = -Infinity;
      let bestMove = {};
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].cells.length; j++) {
          if (currentBoardState[board[i].cells[j].id] === '') {
            currentBoardState[board[i].cells[j].id] = gameSymbols.ai;
            const score = minMax(currentBoardState, false);
            currentBoardState[board[i].cells[j].id] = '';
            if (score > bestScore) {
              bestScore = score;
              bestMove = { i, j };
            }
          }
        }
      }
      return bestMove;
    },
    [board, minMax]
  );

  const executeAiTurn = useCallback(() => {
    const { i: rowIndex, j: colIndex } = nextBestMove({ ...boardState });
    setBoardState(prev => {
      const nextState = { ...prev };
      nextState[board[rowIndex].cells[colIndex].id] = gameSymbols.ai;
      return nextState;
    });
    setUserMark('human');
  }, [board, boardState, minMax, nextBestMove]);

  useEffect(() => {
    if (userMark === 'ai') {
      setTimeout(() => executeAiTurn(), 750);
    }
  }, [userMark, executeAiTurn]);

  return (
    <>
      {winnerExists ? (
        <>
          <h3>Winner!</h3>
          <h4>{winner} has won.</h4>
        </>
      ) : null}
      {hasTie ? (
        <>
          <h3>Draw!</h3>
          <h4>Nobody has won.</h4>
        </>
      ) : null}
      {userMark === 'ai' && !winnerExists && !hasTie ? (
        <>
          <h4>Ai is thinking.....</h4>
        </>
      ) : null}
      {userMark === 'human' && !winnerExists && !hasTie ? (
        <>
          <h4>Please take your turn</h4>
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
