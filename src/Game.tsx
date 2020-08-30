import * as React from 'react'

/**
TODO:
在游戏历史记录列表显示每一步棋的坐标，格式为 (列号, 行号)。 done
在历史记录列表中加粗显示当前选择的项目。 done
使用两个循环来渲染出棋盘的格子，而不是在代码里写死（hardcode）。 done
添加一个可以升序或降序显示历史记录的按钮。
每当有人获胜时，高亮显示连成一线的 3 颗棋子。
当无人获胜时，显示一个平局的消息。
 */

function Square(props: any) {
  let calssName: string = 'square' + props.className
  return (
    <button className={calssName} onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component<any, any> {
  private renderSquare(i: number) {
    let isActive: boolean = i === this.props.nowStepNumber
    let className = isActive ? ' active' : ''
    return (
      <Square
        key={'item' + i}
        className={className}
        isActive={isActive}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  render() {
    let rowIndex = 0
    return (
      <div>
        {this.props.btnArray.map((ele: any, i: number) => {
          return (
            <div key={'row' + i} className="board-row">
              {ele.map((item: any, index: number) => {
                rowIndex++
                return this.renderSquare(rowIndex - 1)
              })}
            </div>
          )
        })}
      </div>
    )
  }
}

export default class Game extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      btnArray: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
      ],
      xIsNext: true,
      stepNumber: 0,
      activeSquareIndex: 0,
      activeHistory: [],
    }
  }

  private handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const activeHistory = this.state.activeHistory.slice(
      0,
      this.state.stepNumber + 1
    )
    const current = history[history.length - 1]
    const squares: Array<any> = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([
        // concat 不会改变原有的history
        {
          squares: squares,
        },
      ]),
      activeHistory: activeHistory.concat([i]),
      stepNumber: history.length,
      activeSquareIndex: i,
      xIsNext: !this.state.xIsNext,
    })
  }

  private jumpTo(step: number) {
    const activeSquareIndex = this.state.activeHistory[step - 1]

    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
      activeSquareIndex: activeSquareIndex,
    })
  }
  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)
    const activeSquareIndex: number = this.state.activeSquareIndex
    let indexIsNum = activeSquareIndex || activeSquareIndex === 0
    let num: any = indexIsNum ? activeSquareIndex / 3 + 1 : ' '
    let status
    if (winner) {
      status = `winner Is：` + winner
    } else {
      status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}
      第${Number.parseInt(num)}行，
      第${indexIsNum ? (activeSquareIndex % 3) + 1 : ' '}列`
    }

    const moves: Array<any> = history.map((step: object, move: number) => {
      const desc: string = move ? 'Go to move #' + move : 'Go to game start'
      return (
        <li key={move}>
          {/*key很重要,同级遍历必须保证key的唯一性*/}
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            nowStepNumber={activeSquareIndex}
            btnArray={this.state.btnArray}
            onClick={(i: number) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

/**
 * 传入长度为 9 的数组，此函数将判断出获胜者，并根据情况返回 “X”，“O” 或 “null”。
 * @param squares Array<any>
 */
function calculateWinner(squares: Array<any>): string | null {
  const lines: Array<any> = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
  for (let i: number = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}
