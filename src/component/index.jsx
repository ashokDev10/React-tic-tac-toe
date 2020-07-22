import React, { Component } from "react";
import Board from "./Board";
import { connect } from "react-redux";
import Form from "./InputForm";
import { CHANGEPLAYERS } from "../Redux/types";
import Countdown from "./CountDown";

class Game extends Component {
  state = {
    xIsNext: true,
    squares: Array(9).fill(null),
    count: 0,
    reset: false,
    start: false,
  };

  handleClick(i) {
    const squares = this.state.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
      count: this.state.count + 1,
    });
  }
  handleReset() {
    this.setState({
      squares: Array(9).fill(null),
      count: 0,
      xIsNext: true,
    });
  }

  changePlayers() {
    this.props.dispatch({
      type: CHANGEPLAYERS,
      player1: "",
      player2: "",
    });
  }

  render() {
    const { pName1, pName2 } = this.props;

    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      if (winner === "X") {
        status = `${pName1} Wins!`;
      } else {
        status = `${pName2} Wins!`;
      }
    } else {
      if (this.state.count === 9) {
        status = "Match draw";
      } else if (this.state.count < 1) {
        status = "";
      } else {
        // status = "Next player is " + (this.state.xIsNext ? "X" : "O");
        status = "";
      }
    }

    return (
      <div className="container">
        {pName1 && pName2 ? (
          <div className="button-block">
            <button
              type="button"
              id="changeBtn"
              onClick={() => this.changePlayers()}
            >
              Change Players
            </button>

            <div className="start-block">
              {this.state.reset && this.state.count !== 0 ? (
                <button type="button" onClick={() => this.handleReset()}>
                  RESET
                </button>
              ) : (
                <button
                  type="button"
                  id="startBtn"
                  onClick={() =>
                    this.setState({
                      reset: true,
                      start: true,
                    })
                  }
                >
                  START
                </button>
              )}
            </div>
            <div className="name-block">
              <button
                type="button"
                style={{
                  background: this.state.xIsNext ? "Green" : "",
                  color: this.state.xIsNext ? "white" : "black",
                }}
              >
                {pName1}
              </button>

              <button
                type="button"
                id="playerBtn2"
                style={{
                  background: !this.state.xIsNext ? "Green" : "",
                  color: !this.state.xIsNext ? "white" : "black",
                  float: "right",
                }}
              >
                {pName2}
              </button>
            </div>
          </div>
        ) : (
          <Form />
        )}

        <div className="game-board">
          {this.state.start && (
            <Board
              squares={this.state.squares}
              boxClick={(i) => this.handleClick(i)}
            />
          )}
        </div>

        {status && (
          <button type="button" id="winnerBtn">
            {status}
          </button>
        )}
        <Countdown timeChange={this.state.xIsNext} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    pName1: state.player1,
    pName2: state.player2,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);