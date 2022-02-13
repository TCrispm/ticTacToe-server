const express = require("express");
const { getBoard, updateBoard } = require("../controllers/TicTacToe");

const router = express.Router();

router.route("/tictactoe")
    .get(getBoard)
    .put(updateBoard);

module.exports = router;
