const fs = require('fs')
const file = require('../../data.json');
const ErrorResponse = require("../../utils/errorResponse");

const validateGame = (player, x, y) => {

    //check col
    for(let i = 0; i < 3; i++){
        if(file[x][i] !== player)
            break;
        if(i === 2){
            return 'win'
        }
    }

    //check row
    for(let i = 0; i < 3; i++){
        if(file[i][y] !== player)
            break;
        if(i === 2){
            return 'win'
        }
    }

    //check diag
    if(x === y){
        for(let i = 0; i < 3; i++){
            if(file[i][i] !== player)
                break;
            if(i === 2){
                return 'win'
            }
        }
    }

    //check anti diag
    if((x + y) === 2){
        for(let i = 0; i < 2; i++){
            if(file[i][2-i] !== player)
                break;
            if(i === 2){
                return 'win'
            }
        }
    }

    //check draw


    return false
}

exports.resetBoard = async (req, res, next) => {
    try {
        const data = [[null,null,null],[null,null,null],[null,null,null]]
        fs.writeFileSync('data.json', JSON.stringify(data), function writeJSON(err) {
            if (err) return next(new ErrorResponse(err, 500));
        });
        res.status(200).json(data);
    }catch (e) {
        next(new ErrorResponse())
    }

}

exports.getBoard = async (req, res, next) => {
    try {
        const data = fs.readFileSync('data.json')
        const board = JSON.parse(data)

        res.status(200).json({board});
    } catch (e) {
        next(new ErrorResponse());
    }
};

exports.updateBoard = async (req, res, next) => {
    try {
        const { player, x, y } = req.body;

        if(!player || !x || !y){
            return next(new ErrorResponse('Player and square are required!', 404));
        }

        file[x][y] = player
        fs.writeFileSync('data.json', JSON.stringify(file), function writeJSON(err) {
            if (err) return next(new ErrorResponse(err, 500));
        });

        const result = validateGame(player, x, y)
        let winner;
        if(result){
            if(result === 'win'){
                winner = player;
            }
        }

        const data = fs.readFileSync('data.json')
        const board = JSON.parse(data)
        console.log({
            board,
            winner,
            result
        })
        res.status(200).json({
            board,
            winner,
            result
        });
    } catch (e) {
        next(new ErrorResponse());
    }
};
