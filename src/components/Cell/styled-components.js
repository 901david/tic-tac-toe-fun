import styled from 'styled-components';

export const CellWrapper = styled.div`
  ${({ cellPosition }) => {
    const border = '2px solid black';
    if (cellPosition === 1) {
      return `
        border-left: ${border};
        border-right: ${border};
        `;
    }
  }};

  ${({ rowPosition }) => {
    const border = '2px solid black';
    if (rowPosition !== 0) {
      return `
        border-top: ${border};
        `;
    }
  }};
`;
