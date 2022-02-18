const fs = require("fs");
const file = require("../../data.json");
const ErrorResponse = require("../../utils/errorResponse");

const validateGame = (player, x, y) => {
  //check col
  for (let i = 0; i < 3; i++) {
    if (file.board[x][i] !== player) break;
    if (i === 2) {
      return "win";
    }
  }

  //check row
  for (let i = 0; i < 3; i++) {
    if (file.board[i][y] !== player) break;
    if (i === 2) {
      return "win";
    }
  }

  //check diag
  if (x === y) {
    for (let i = 0; i < 3; i++) {
      if (file.board[i][i] !== player) break;
      if (i === 2) {
        return "win";
      }
    }
  }

  //check anti diag
  if (x + y === 2) {
    for (let i = 0; i < 2; i++) {
      if (file.board[i][2 - i] !== player) break;
      if (i === 2) {
        return "win";
      }
    }
  }

  //check draw

  if (file.round == 9) {
    return "draw";
  }
  return undefined;
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
    next(new ErrorResponse());
  }
};

exports.getBoard = async (req, res, next) => {
  try {
    const data = fs.readFileSync("data.json");
    const board = JSON.parse(data);

    res.status(200).json(board);
  } catch (e) {
    next(new ErrorResponse());
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

    const result = validateGame(player, x, y);
    console.log(result);
    let winner;
    if (result) {
      if (result === "win") {
        winner = player;
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
    next(new ErrorResponse());
  }
};
