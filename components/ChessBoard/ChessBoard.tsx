import {
  Table,
  Tbody,
  TableContainer,
} from '@chakra-ui/react'
import ChessBoardRow from './ChessBoardRow'
import { css } from '@emotion/react'

interface Props {
  width: number;
  cellWidth: number;
}

function ChessBoard({ width, cellWidth }: Props) {
  const halfCellWidth = `${cellWidth / 2}px`;

  return (
    <TableContainer
      style={{
      padding: `${halfCellWidth}`,
      }}
      css={ table_container }
    >
      <Table variant='simple' css={ table_body }>
        <Tbody>
          {
            Array(9).fill(0).map((_, i) => {
              return (
                <ChessBoardRow key={i} y={i} width={ width } cellWidth={ cellWidth } />
              )
            })
          }
        </Tbody>
      </Table>
    </TableContainer>
  )
}


export default ChessBoard;


/* style start */
const table_container = css`
  width: fit-content;
  box-shadow: 0 0 1px 2px rgba(58, 58, 58, 0.6);
  background: url("/img/chess_bg.webp");
`

const table_body = css`
  width: 100%;
  outline: 4px solid #484848;
  outline-offset: 4px;
  border: 1px solid #484848;
  border-spacing: 0px;
`
/* style end */
