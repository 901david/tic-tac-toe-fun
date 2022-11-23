import { CellWrapper } from './styled-components';

export const Cell = ({ cellValue, cellPosition, rowPosition }) => {
  return (
    <CellWrapper cellPosition={cellPosition} rowPosition={rowPosition}>
      {cellValue}
    </CellWrapper>
  );
};
