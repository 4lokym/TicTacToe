const myBoardConsole = function (){

    let is_X = false;
    let hand_played = 0;

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

    function displayWin_p(){
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

    function playHand_p(x, y){
        is_X = !is_X;
        setSimbolOnBoard_p(x, y, is_X);
        hand_played++;
        displayBoard();
        console.log("");
        const win = check_p.all();
        return {is_X, win};
    }

    function playHand(x, y){
        if(x === undefined || y === undefined || is_X === undefined){
            throw new Error("Position or simbol aren't defined");
        }

        if(!isNaN(x) || !isNaN(y)){
            if(board[x%3][y%3] === "~"){
                return playHand_p(x,y);
            }else{
                throw new Error("Position alredy signed, try another one");
            }
        }else{
            throw new TypeError("X and Y aren't numbers");
        }
    }

    function playRoundConsole(){
        is_X = false;
        let status;
        resetHandsPlayed();
        clearBoard();
        for(; hand_played<9;){
            
            let position = choosePositionConsole();
            try{    
                status = playHand(position[0], position[1]);
            }catch (e){
                console.log("Something went wrong, try again");
                console.log(e.message);
                hand_played--;
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

    function resetHandsPlayed(){
        hand_played = 0;
    }

    function getHandsPlayed(){
        return hand_played;
    }

    function choosePositionConsole(){

        let x = -(-(prompt("Set x")));
        let y = -(-(prompt("Set y")));
    
        return [x, y];
    }

    function setIs_X(){
        is_X = false;
    }


    return {getBoard, clearBoard, displayBoard, playRoundConsole, playHand, choosePositionConsole, getIs_X, getXorO_String, resetHandsPlayed, getHandsPlayed, displayTie_p, displayWin_p, setIs_X};

}();

const myBoard = function(){
    const screen_board = document.querySelector("body");
    const buttons = document.querySelectorAll(".xo");

    const buttons_on_board = function(){
        let matrix = [];

        for(let i =0; i<9;){
            let temp = [];
            for(let j=0; j<3; i++,j++){
                temp.push(buttons[i]);
            }
            matrix.push(temp);
        }
        
        return matrix;
    }();


    //---------
    screen_board.addEventListener("click", function (e){
        
        const button = e.target;
        if(button.className === "xo" && !(button.className === "x" || button.className === "o")){
            setXorOStyle(button);
            setBackGround();
            winTieHandler(myBoardConsole.playHand(button.id[0], button.id[1]));
        }
    });

    const body = document.querySelector("body");

    function setBackGround(){
        if(!myBoardConsole.getIs_X()){
            resetBackground();
            body.classList.add("red");
        }else{
            resetBackground();
            body.classList.add("blue");
        }
    }

    function resetBackground(){
        body.classList.remove("red");
        body.classList.remove("blue");
    }

    function setXorOStyle(button){
        button.classList.add(myBoardConsole.getXorO_String().toLowerCase());
        button.textContent = `${myBoardConsole.getXorO_String()}`;
    }

    function resetStyle_onBoard(){
        buttons.forEach(button => {
            button.classList.remove("x");
            button.classList.remove("o");
            button.textContent = ``;
        });  
    }

    function getButtonbyPosition_onBoard(x, y){
        return buttons_on_board[y%3][x%3];
    }

    function winTieHandler(result){
        if(result.win){
            displayWin(result.is_X);
            toggleBlockAction();
        }else if(!result.win && myBoardConsole.getHandsPlayed === 9){
            displayTie();
        }
    }

    function displayWin(is_X){
        myBoardConsole.displayWin_p()
        alert(`Player ${!is_X ? "red": "blue"} wins`)
        
    }

    function displayTie(){
        myBoardConsole.displayTie_p();
        alert("It's a tie")
    }

    function toggleBlockAction(){
        buttons.forEach((e) =>{
            e.disabled = !e.disabled;
        });
    }

    function activateButtonsAction(){
        buttons.forEach((e) =>{
            e.disabled = false;
        });
    }

    function playNewRound(){
        //fusione del gioco su console con il gioco su schermo
    
        //reset to initial state
        myBoardConsole.clearBoard();
        resetStyle_onBoard();
        myBoardConsole.resetHandsPlayed();
        activateButtonsAction();
        myBoardConsole.setIs_X();
        resetBackground();
        
    }
    
    
    const newRoundButton = document.querySelector(".another-round");
    newRoundButton.addEventListener("click", () =>{playNewRound();
    });

    return {setXorOStyle, resetStyle_onBoard, buttons_on_board, getButtonbyPosition_onBoard, toggleBlockAction};
}();


