import styled from 'styled-components';

export const CellRowWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(100px, 1fr));
  min-height: 150px;
`;
