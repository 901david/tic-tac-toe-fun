import { gameSymbols } from 'utils/gameSymbols';

export class BoardValidator {
  checkForHorizontal(currentBoardState, board) {
    let hasWin = false;
    let winner = '';
    board.forEach((boardRow) => {
      const hasAiWinner = boardRow.cells.every(
        (cell) => currentBoardState[cell.id] === gameSymbols.ai
      );
      const hasHumanWinner = boardRow.cells.every(
        (cell) => currentBoardState[cell.id] === gameSymbols.human
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
  }

  checkForVertical(currentBoardState, board) {
    let hasWin = false;
    let winner = '';

    for (let i = 0; i < board.length; i++) {
      const column = [board[0].cells[i], board[1].cells[i], board[2].cells[i]];
      const hasAiWinner = column.every((cell) => currentBoardState[cell.id] === gameSymbols.ai);
      const hasHumanWinner = column.every(
        (cell) => currentBoardState[cell.id] === gameSymbols.human
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
  }

  checkForDiagonal(currentBoardState, board) {
    let hasWin = false;
    let winner = '';

    const diag1 = [board[0].cells[0], board[1].cells[1], board[2].cells[2]];
    const diag2 = [board[0].cells[2], board[1].cells[1], board[2].cells[0]];
    const hasAiWinner =
      diag1.every((cell) => currentBoardState[cell.id] === gameSymbols.ai) ||
      diag2.every((cell) => currentBoardState[cell.id] === gameSymbols.ai);
    const hasHumanWinner =
      diag1.every((cell) => currentBoardState[cell.id] === gameSymbols.human) ||
      diag2.every((cell) => currentBoardState[cell.id] === gameSymbols.human);

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
  }

  checkForWinner(currentBoardState, board) {
    const { hasHorizontalWin, horizontalWinner } = this.checkForHorizontal(
      currentBoardState,
      board
    );
    const { hasVerticalWin, verticalWinner } = this.checkForVertical(currentBoardState, board);
    const { hasDiagonalWin, diagonalWinner } = this.checkForDiagonal(currentBoardState, board);
    const isFullTable = board.every((boardRow) =>
      boardRow.cells.every((cell) => currentBoardState[cell.id] !== '')
    );
    const hasTie = !hasHorizontalWin && !hasVerticalWin && !hasDiagonalWin && isFullTable;
    return {
      hasWinnerExists: hasHorizontalWin || hasVerticalWin || hasDiagonalWin,
      winner: horizontalWinner || verticalWinner || diagonalWinner,
      hasTie
    };
  }
}
