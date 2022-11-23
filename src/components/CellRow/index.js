import { Cell } from 'components/Cell';
import { CellRowWrapper } from './styled-components';

export const CellRow = ({ cells, rowPosition }) => {
  return (
    <CellRowWrapper>
      {cells.map((cell, cellIndex) => {
        return (
          <Cell
            key={cell.id}
            rowPosition={rowPosition}
            cellPosition={cellIndex}
            cellValue={cell.value}
          />
        );
      })}
    </CellRowWrapper>
  );
};
