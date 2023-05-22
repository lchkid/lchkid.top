var board = new Array();
var hasAdded = new Array();
var score = 0;

$(function(){
    // 页面载入后和点击new game按钮重新加载游戏
    newGame();
    // 新游戏按钮
    $("#new-game").click(newGame);
    $(document).keydown(function(ev){
        switch(ev.keyCode){
            case 37: // 左方向键
                if(moveLeft()){
                    setTimeout("generateNumber()", 200);
                    setTimeout("isGameOver()", 400);
                }
                break;
            case 38: // 上方向键
                if(moveTop()){
                    setTimeout("generateNumber()", 200);
                    setTimeout("isGameOver()", 400);
                }
                break;
            case 39: // 右方向键
                if(moveRight()){
                    setTimeout("generateNumber()", 200);
                    setTimeout("isGameOver()", 400);
                }
                break;
            case 40: // 下方向键
                if(moveDown()){
                    setTimeout("generateNumber()", 200);
                    setTimeout("isGameOver()", 400);
                }
                break;
            default:
                break;
        }
    })
})

function newGame(){
    // 初始化网格
    init();
    // 随机找2个格子生成1个数字
    generateNumber();
    generateNumber();
    score = 0;
    showScore(score); 
}

function init(){
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){           
            let cellNode = "#grid-cell-" + i + "-" + j;
            let gridCell = $(cellNode);
            gridCell.css({"top": getCellPosition(i), "left": getCellPosition(j)});
        }
    }
    for(let i = 0; i < 4; i++){
        board[i] = new Array();
        hasAdded[i] = new Array();
        for(let j = 0; j < 4; j++){
            board[i][j] = 0;
            hasAdded[i][j] = false;
        }
    }
    upNumberToGrid();
}

// 生成随机数字
function generateNumber(){
    if(noSpace(board)){
        return false;
    }
    // 随机位置
    let randomX = parseInt(Math.random() * 4);
    let randomY = parseInt(Math.random() * 4);
    while(true){
        if(board[randomX][randomY] == 0){
            break;   
        }
        randomX = parseInt(Math.random() * 4);
        randomY = parseInt(Math.random() * 4);
    }
    // 随机数字
    let randomNumber = Math.random() < 0.5 ? 2 : 4;
    board[randomX][randomY] = randomNumber;
    // 展现数字
    showNumberToGrid(randomX, randomY, randomNumber);
    return true;
}

// 判断是否还有空位
function noSpace(board){
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            if(board[i][j] == 0){
                return false;
            }
        }
    }
    return true;
}

// 将数字展现在网格中
function showNumberToGrid(r, c, n){
    let numberCell = $("#number-cell-" + r + "-" + c);
    numberCell.css({
        "color": getColor(n),
        "background-color": getBackgroundColor(n),
    }).text(n);
    numberCell.animate({
        "width": 100,
        "height": 100,
        "top": getCellPosition(r),
        "left": getCellPosition(c)
    }, 200);
}

// 将board传至前端显示
function upNumberToGrid(){
    $(".number-cell").remove();
    for(let i = 0; i < 4; i++){
        for(let j = 0; j < 4; j++){
            $("#grid").append(`<div class="number-cell" id="number-cell-${i}-${j}"></div>`);
            let numberCell = $("#number-cell-" + i + "-" + j);
            if(board[i][j] == 0){
                numberCell.css({
                    "width": 0,
                    "height": 0,
                    "top": getCellPosition(i) + 50,
                    "left": getCellPosition(j) + 50,
                });
            }else{
                numberCell.css({
                    "width": 100,
                    "height": 100,
                    "top": getCellPosition(i),
                    "left": getCellPosition(j),
                    "color": getColor(board[i][j]),
                    "background-color": getBackgroundColor(board[i][j])
                }).text(board[i][j]);
            }
            hasAdded[i][j] = false;
        }
    }
}

function moveLeft(){
    if(canMoveLeft(board)){
        for(let i = 0; i < 4; i++){
            for(let j = 1; j < 4; j++){
                if(board[i][j] != 0){
                    for(let k = 0; k < j; k++){
                        if(noBlockRow(i, k, j, board)){
                            if(board[i][k] == 0){
                                // 移动到i,k位置
                                moveNumberCell(i, j, i, k);
                                board[i][k] = board[i][j];
                                board[i][j] = 0;
                                continue;
                            }else if(board[i][k] == board[i][j] && !hasAdded[i][k]){
                                // 移动到i,k位置，且数值翻倍
                                moveNumberCell(i, j, i, k);
                                board[i][k] = board[i][j] * 2;
                                board[i][j] = 0;
                                hasAdded[i][k] = true;
                                score += board[i][k];
                                showScore(score);
                                continue;
                            }
                        }
                    }
                }
            }
        }
        setTimeout("upNumberToGrid()", 200);
        return true;
    }else{
        return false;
    }
}

function canMoveLeft(board){
    for(let i = 0; i < 4; i++){
        for(let j = 1; j < 4; j++){
            if(board[i][j] != 0){
                if(board[i][j-1] == 0 || board[i][j] == board[i][j-1]){
                    return true;
                }
            }
        }
    }
    return false;
}

function moveTop(){
    if(canMoveTop(board)){
        for(let i = 1; i < 4; i++){
            for(let j = 0; j < 4; j++){
                if(board[i][j] != 0){
                    for(let k = 0; k < i; k++){
                        if(noBlockCol(k, i, j, board)){
                            if(board[k][j] == 0){
                                // 移动到k,j位置
                                moveNumberCell(i, j, k, j);
                                board[k][j] = board[i][j];
                                board[i][j] = 0;
                                continue;
                            }else if(board[k][j] == board[i][j] && !hasAdded[k][j]){
                                // 移动到k,j位置且数值翻倍
                                moveNumberCell(i, j, k, j);
                                board[k][j] = board[i][j] * 2;
                                board[i][j] = 0;
                                hasAdded[k][j] = true;
                                score += board[k][j];
                                showScore(score);
                                continue;
                            }
                        }
                    }
                }
            }
        }
        setTimeout("upNumberToGrid()", 200);
        return true;
    }else{
        return false;
    }    
}

function canMoveTop(board){
    for(let i = 1; i < 4; i++){
        for(let j = 0; j < 4; j++){
            if(board[i][j] != 0){
                if(board[i-1][j] == 0 || board[i][j] == board[i-1][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

function moveRight(){
    if(canMoveRight(board)){
        for(let i = 0; i < 4; i++){
            for(let j = 2; j >= 0; j--){
                if(board[i][j] != 0){
                    for(let k = 3; k > j; k--){
                        if(noBlockRow(i, j, k, board)){
                            if(board[i][k] == 0){
                                // 移动到i,k位置
                                moveNumberCell(i, j, i, k);
                                board[i][k] = board[i][j];
                                board[i][j] = 0;
                                continue;
                            }else if(board[i][k] == board[i][j] && !hasAdded[i][k]){
                                // 移动到i,k位置且数值翻倍
                                moveNumberCell(i, j, i, k);
                                board[i][k] = board[i][j] * 2;
                                board[i][j] = 0;
                                hasAdded[i][k] = true;
                                score += board[i][k];
                                showScore(score);
                                continue;
                            }
                        }
                    }
                }
            }
        }
        setTimeout("upNumberToGrid()", 200);
        return true;
    }else{
        return false;
    }    
}

function canMoveRight(board){
    for(let i = 0; i < 4; i++){
        for(let j = 2; j >= 0; j--){
            if(board[i][j] != 0){
                if(board[i][j+1] == 0 || board[i][j] == board[i][j+1]){
                    return true;
                }
            }
        }
    }
    return false;
}

function moveDown(){
    if(canMoveDown(board)){
        for(let i = 2; i >= 0; i--){
            for(let j = 0; j < 4; j++){
                if(board[i][j] != 0){
                    for(let k = 3; k > i; k--){
                        if(noBlockCol(i, k, j, board)){
                            if(board[k][j] == 0){
                                // 移动到k,j位置
                                moveNumberCell(i, j, k, j);
                                board[k][j] = board[i][j];
                                board[i][j] = 0;
                                continue;
                            }else if(board[k][j] == board[i][j] && !hasAdded[k][j]){
                                // 移动到i,k位置且数值翻倍
                                moveNumberCell(i, j, k, j);
                                board[k][j] = board[i][j] * 2;
                                board[i][j] = 0;
                                hasAdded[k][j] = true;
                                score += board[k][j];
                                showScore(score);
                                continue;
                            }
                        }
                    }
                }
            }
        }
        setTimeout("upNumberToGrid()", 200);
        return true;
    }else{
        return false;
    }    
}

function canMoveDown(board){
    for(let i = 2; i >= 0; i--){
        for (let j = 0; j < 4; j++) {
            if(board[i][j] != 0){
                if(board[i+1][j] == 0 || board[i][j] == board[i+1][j]){
                    return true;
                }
            }
        }
    }
    return false;
}

function moveNumberCell(r1, c1, r2, c2){
    let numberCell = $("#number-cell-" + r1 + "-" + c1);
    numberCell.animate({
        "top": getCellPosition(r2),
        "left": getCellPosition(c2),
    }, 200);
}

function noBlockRow(row, col1, col2, board){
    for(let i = col1 + 1; i < col2; i++){
        if(board[row][i] != 0){
            return false;
        }
    }
    return true;
}

function noBlockCol(row1, row2, col, board){
    for(let i = row1 + 1; i < row2; i++){
        if(board[i][col] != 0){
            return false;
        }
    }
    return true;
}

function isGameOver(){
    if(noMove(board)){
        alert("Game Over!");
        newGame();
    }
}

function noMove(board){
    if(canMoveLeft(board) || canMoveTop(board) || canMoveRight(board) || canMoveDown(board)){
        return false;
    }
    return true;
}

function showScore(score){
    $("#score").html(score);
}

function getCellPosition(n){
    return n * 115 + 15;
}

function getColor(n){
    if(n <= 4){
        return "#776e65";
    }else{
        return "#f9f6f2";
    }
}

function getBackgroundColor(n){
    switch(n){
        case 2:
            return "#eee4da";
            break;
        case 4:
            return "#ede0c8";
            break;
        case 8:
            return "#f2b179";
            break;
        case 16:
            return "#f59563";
            break;
        case 32:
            return "#f67c5f";
            break;
        case 64:
            return "#f65e3b";
            break;
        case 128:
            return "#edcf72";
            break;    
        case 256:
            return "#edcc61";
            break;
        case 512:
            return "#edc850";
            break;
        case 1024:
            return "#edc53f";
            break;
        case 2048:
            return "#edc22e";
            break;
        default:
            return "#3c3a32";
            break;
    }
}