const myBoard = function (){

    let is_X = false;

    function getIs_X(){
        return is_X;
    }

    function getXorO_String(){
        return is_X ? "X":"O";
    }

    let board;
    clearBoard();


    function emptyBoard_p(){
        return [
            ["~","~","~"],
            ["~","~","~"],
            ["~","~","~"]
        ]
    }

    function clearBoard(){
        board = emptyBoard_p();
    }

    function getBoard(){
        return board;
    }

    function setSimbolOnBoard_p(x, y, is_X){
        board[x%3][y%3] = is_X ? "X":"O";
    }

    function displayBoard(){
        console.log(`${board[0][0]}|${board[0][1]}|${board[0][2]}`);
        console.log(`${board[1][0]}|${board[1][1]}|${board[1][2]}`);
        console.log(`${board[2][0]}|${board[2][1]}|${board[2][2]}`);
    }

    function displayWin_p(is_X = true){
        console.log(`${is_X? "Player X":"Player O"} wins`);
    }
    function displayTie_p(){
        console.log("It's a tie");
    }

    const check_p = function(){
        let isTris = false;
        for(let i = 0; i<board.length; i++){
            isTris = (board[i][0] === board[i][1] && board[i][0] === board[i][2]);
        }
        
        function columns(){
            let isColumnTris = false;
            for(let i = 0; i<board[0].length && !isColumnTris; i++){
                isColumnTris = (board[0][i] !== "~" && board[0][i] === board[1][i] && board[0][i] === board[2][i]);
            }
            return isColumnTris;
        }

        function rows(){
            let isRowTris = false;
            for(let i = 0; i<board.length && !isRowTris; i++){
                isRowTris = (board[i][0] !== "~" && board[i][0] === board[i][1] && board[i][0] === board[i][2]);
            }
            return isRowTris;
        }

        function obliques(){
            let isObliqueTris = false;
            return (((board[0][0] === board[1][1] && board[0][0] === board[2][2]) ||
            (board[0][2] === board[1][1] && board[1][1] === board[2][0])) && board[1][1] !== "~");
        }

        function all(){
            return (rows() || columns() || obliques());
        }

        return {
            columns, rows, obliques, all
        }
    }();

    function playHand_p(x, y, is_X){
        setSimbolOnBoard_p(x, y, is_X);
        displayBoard();
        console.log("");
        const win = check_p.all();
        return {is_X, win};
    }

    function playHand(x, y, is_X){
        if(x === undefined || y === undefined || is_X === undefined){
            throw new Error("Position or simbol aren't defined");
        }

        if(!isNaN(x) || !isNaN(y)){
            if(board[x%3][y%3] === "~"){
                return playHand_p(x,y,is_X);
            }else{
                throw new Error("Position alredy signed, try another one");
            }
        }else{
            throw new TypeError("X and Y aren't numbers");
        }
    }

    function playRound(){
        is_X = false;
        let status;
        for(let i = 0; i<9; i++){
            is_X = !is_X;
            let position = choosePosition();
            try{    
                status = playHand(position[0], position[1],is_X);
            }catch (e){
                console.log("Something went wrong, try again");
                console.log(e.message);
                i--;
                is_X = !is_X;
                continue;
            }

            if(status.win){
                displayWin_p(status.is_X);
                clearBoard();
                return;
            }
        }
        displayTie_p();
        clearBoard();

    }

    function choosePosition(){

        let x = -(-(prompt("Set x")));
        let y = -(-(prompt("Set y")));
    
        return [x, y];
    }

    return {getBoard, clearBoard, displayBoard, playRound, playHand, choosePosition, getIs_X, getXorO_String};

}();

const screen_board = document.querySelector("body");

screen_board.addEventListener("click", function (e){
    if(e.target.tagName === "BUTTON"){
        changeStyleOnClick(e.target);
    }
});

function changeStyleOnClick(button){
    button.classList.add(myBoard.getXorO_String().toLowerCase());
    button.textContent = `${myBoard.getXorO_String()}`;
}