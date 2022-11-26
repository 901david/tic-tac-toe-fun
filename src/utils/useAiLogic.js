import { useCallback } from 'react';

import { gameSymbols } from 'utils/gameSymbols';
import { BoardValidator } from './BoardValidator';

const boardValidator = new BoardValidator();

const minMaxMap = {
  ai: 10,
  tie: 0,
  human: -10
};

export const useAiLogic = (board) => {
  const minMax = useCallback(
    (localBoardState, isMaximizing, depth = 0) => {
      const { hasWinnerExists, winner, hasTie } = boardValidator.checkForWinner(
        localBoardState,
        board
      );
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
    [board]
  );

  const nextBestMove = useCallback(
    (currentBoardState) => {
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

  const executeAiTurn = useCallback(
    (boardState, setBoardState, setUserMark) => {
      const { i: rowIndex, j: colIndex } = nextBestMove({ ...boardState });
      setBoardState((prev) => {
        const nextState = { ...prev };
        nextState[board[rowIndex].cells[colIndex].id] = gameSymbols.ai;
        return nextState;
      });
      setUserMark('human');
    },
    [board, minMax, nextBestMove]
  );

  return { executeAiTurn };
};
