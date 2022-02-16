const express = require("express");
const { getBoard, updateBoard, resetBoard } = require("../controllers/TicTacToe");

const router = express.Router();

router.route("/tictactoe")
    .get(getBoard)
    .post(updateBoard);

router.route("/tictactoe/reset")
    .post(resetBoard)

module.exports = router;
