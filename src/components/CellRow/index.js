import { Cell } from 'components/Cell';
import { CellRowWrapper } from './styled-components';

export const CellRow = ({
  cells,
  rowPosition,
  boardState,
  updateCellByUser,
}) => {
  return (
    <CellRowWrapper>
      {cells.map((cell, cellIndex) => {
        return (
          <Cell
            key={cell.id}
            rowPosition={rowPosition}
            cellPosition={cellIndex}
            cellValue={boardState[cell.id]}
            updateCellByUser={() => updateCellByUser(cell.id)}
          />
        );
      })}
    </CellRowWrapper>
  );
};
