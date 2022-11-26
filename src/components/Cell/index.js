import { CellWrapper } from './styled-components';

export const Cell = ({
  cellValue,
  cellPosition,
  rowPosition,
  updateCellByUser,
}) => {
  return (
    <CellWrapper
      cellPosition={cellPosition}
      rowPosition={rowPosition}
      onClick={updateCellByUser}
    >
      <h1>{cellValue}</h1>
    </CellWrapper>
  );
};
