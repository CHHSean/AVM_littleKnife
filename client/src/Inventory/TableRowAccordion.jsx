import React from 'react';
import styled from 'styled-components';

const StyledRowAccordion = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  width: 95%;
  height: 50px;
  border-radius: 0px
`;

export default function TableRowAccordion({ value = '' }) {
  return (
    <StyledRowAccordion>
      <p>{value}</p>
    </StyledRowAccordion>
  );
}
