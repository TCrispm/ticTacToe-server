const fs = require("fs");
const file = require("../../data.json");
const ErrorResponse = require("../../utils/errorResponse");

const validateGame = (player, x, y) => {
  const n = 3;
  let winSquares = [];

  //check col
  for (let i = 0; i < n; i++) {
    if (file.board[x][i] !== player) {
      winSquares = [];
      break;
    }

    winSquares.push({ x, y: i });
    if (i === n - 1) {
      return { result: "win", winSquares };
    }
  }

  //check row
  for (let i = 0; i < n; i++) {
    if (file.board[i][y] !== player) {
      winSquares = [];
      break;
    }
    winSquares.push({ x: i, y });
    if (i === n - 1) {
      return { result: "win", winSquares };
    }
  }

  //check diag
  if (x === y) {
    for (let i = 0; i < n; i++) {
      if (file.board[i][i] !== player) {
        winSquares = [];
        break;
      }
      winSquares.push({ x: i, y: i });
      if (i === n - 1) {
        return { result: "win", winSquares };
      }
    }
  }

  //check anti diag
  if (x + y === 2) {
    for (let i = 0; i < n; i++) {
      if (file.board[i][n - 1 - i] !== player) {
        winSquares = [];
        break;
      }
      winSquares.push({ x: i, y: n - 1 - i });
      if (i === n - 1) {
        return { result: "win", winSquares };
      }
    }
  }

  //check draw

  if (file.round == 10) {
    return { result: "draw" };
  }
  return { result: undefined };
};

exports.resetBoard = async (req, res, next) => {
  try {
    const data = {
      board: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
      nextPlayer: "Player 1",
      round: 1,
    };
    fs.writeFileSync(
      "data.json",
      JSON.stringify(data),
      function writeJSON(err) {
        if (err) return next(new ErrorResponse(err, 500));
      }
    );
    res.status(200).json(data);
  } catch (e) {
    next(new ErrorResponse(e, 500));
  }
};

exports.getBoard = async (req, res, next) => {
  try {
    const data = fs.readFileSync("data.json");
    const board = JSON.parse(data);

    res.status(200).json(board);
  } catch (e) {
    next(new ErrorResponse(e, 500));
  }
};

exports.updateBoard = async (req, res, next) => {
  try {
    const { player, x, y } = req.body;
    console.log(player, x, y);
    let nextPlayer;
    if (!player || x === undefined || x === undefined) {
      return next(new ErrorResponse("Player and square are required!", 404));
    }
    if (player === "Player 1") {
      nextPlayer = "Player 2";
    } else {
      nextPlayer = "Player 1";
    }

    file.board[x][y] = player;
    file.nextPlayer = nextPlayer;
    file.round = file.round + 1;
    fs.writeFileSync(
      "data.json",
      JSON.stringify(file),
      function writeJSON(err) {
        if (err) return next(new ErrorResponse(err, 500));
      }
    );
    console.log("dfgdf");
    const { result, winSquares } = validateGame(player, x, y);
    let winner;

    if (result) {
      if (result === "win") {
        winner = player;
        file.winSquares = winSquares;
      }
    }

    file.winner = winner;
    file.result = result;

    fs.writeFileSync(
      "data.json",
      JSON.stringify(file),
      function writeJSON(err) {
        if (err) return next(new ErrorResponse(err, 500));
      }
    );

    const data = fs.readFileSync("data.json");
    const game = JSON.parse(data);

    res.status(200).json(game);
  } catch (e) {
    next(new ErrorResponse(e, 500));
  }
};
