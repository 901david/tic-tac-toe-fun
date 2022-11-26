import { object } from 'prop-types';

export const GameMessages = ({ gameState }) => {
  return (
    <div>
      {gameState.winnerExists ? (
        <>
          <h3>Winner!</h3>
          <h4>{gameState.winner} has won.</h4>
        </>
      ) : null}
      {gameState.hasTie ? (
        <>
          <h3>Draw!</h3>
          <h4>Nobody has won.</h4>
        </>
      ) : null}
      {gameState.userMark === 'ai' && !gameState.winnerExists && !gameState.hasTie ? (
        <>
          <h4>Ai is thinking.....</h4>
        </>
      ) : null}
      {gameState.userMark === 'human' && !gameState.winnerExists && !gameState.hasTie ? (
        <>
          <h4>Please take your turn</h4>
        </>
      ) : null}
    </div>
  );
};

GameMessages.propTypes = {
  gameState: object
};
