$(document).ready(function() {

  // keeps track of all player positions on the board
  let board = {0: '', 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: ''};

  // keeps a running tab for each possible combo; 'X' = +1, 'O' = -1
  let connectThree = {
      'rowTop': 0,
      'rowMid': 0,
      'rowBottom': 0,
      'colLeft': 0,
      'colMid': 0,
      'colRight': 0,
      'diagLeft': 0,
      'diagRight': 0
    };

  // a reference of all possible winning combinations
  let winningCombos = {
      'rowTop': [0, 1, 2],
      'rowMid': [3, 4, 5],
      'rowBottom': [6, 7, 8],
      'colLeft': [0, 3, 6],
      'colMid': [1, 4, 7],
      'colRight': [2, 5, 8],
      'diagLeft': [0, 4, 8],
      'diagRight': [2, 4 ,6]
    };

  let human = '', // human opponent's chosen symbol
      comp = ''; // computer's symbol

  let moveCount = 0, // counts the numer of moves made by opponent
      turn = 0; // determine's whose turn it is; 0 === human, 1 === computer

  // player selection
  $('.selector').click(function() {
    human = this.id;
    comp = (human === 'X') ? 'O' : 'X';
    if (this.id === 'X') {
      $('#O').css('width', '0px');
      $('#O').html('');
      $('.selector').removeClass('symbol');
    } else if (this.id === 'O') {
      $('#X').css('width', '0px');
      $('#X').html('');
      $('.selector').removeClass('symbol');
    }
  });

  // listens for valid player move
  $('.square').click(function() {
    moveCount++;
    turn = 1;
    if (moveCount === 1 && human !== '') {
      firstMove(eval(this.id));
    } else if (board[eval(this.id)] === '' && human !== '') {
      $('#' + this.id).html(human);
      scan(eval(this.id), human);
    }
  });

  // determines computer's first move
  function firstMove(firstPosition) {
    let id = '#' + eval(firstPosition);
    turn = 0;
    $(id).html(human);
    scan(firstPosition, human);

    if (firstPosition === 0 || firstPosition === 2 || firstPosition === 6 || firstPosition === 8) {
      $('#4').html(comp);
      scan(4, comp);
    } else {
      $('#0').html(comp);
      scan(0, comp);
    }
  }

  // keeps track of player positions
  function scan (lastPosition, player) {
    let id = eval(lastPosition);
    board[id] = player;

    let winningComboKeys = Object.keys(winningCombos);
    winningComboKeys.forEach(function(el) {
      if (winningCombos[el].includes(id) && player === human) {
        connectThree[el]++;
      } else if (winningCombos[el].includes(id) && player === comp) {
        connectThree[el]--;
      }
    });
    winOrNot();
  }

  // determines if a player has won
  function winOrNot() {
    let winKeys = Object.keys(winningCombos);
    for (let i  = 0; i < winKeys.length; i++) {
      if (connectThree[winKeys[i]] === -3) {
        winner(winKeys[i], comp);
        break;
      } else if (connectThree[winKeys[i]] === 3) {
        winner(winKeys[i], human);
        break;
      } else if (i === 7 && connectThree[winKeys[i]] !== -3 && connectThree[winKeys[i]] !== 3) {
        checkForThree();
      }
    }
  }

  // Checks for positions that are one move away from a win
  function checkForThree() {
    let keys = Object.keys(connectThree);
    let values = Object.values(connectThree);

    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        break;
      } else if (i === 8 && board[i] !== '') {
        setTimeout(nextGame, 500);
      }
    }

    if (turn === 1 && values.includes(-2)) {
      fillGap(keys[values.indexOf(-2)]);
    } else if (turn === 1 && values.includes(2)) {
      fillGap(keys[values.indexOf(2)]);
    } else if (moveCount === 2 && turn === 1 && (board[0] === human && board[8] === human || board[2] === human && board[6] === human || board[5] === human && board[7] === human)) {
      if (board[5] === human && board[7] === human && board[8] === '') {
        $('#8').html(comp);
        turn = 0;
        scan(8, comp);
      } else if (board[3] === '') {
        $('#3').html(comp);
        turn = 0;
        scan(3, comp);
      } else {
        $('#5').html(comp);
        turn = 0;
        scan(5, comp);
      }
    } else if (turn === 1) {
      noThreat();
    }

  }

  // generates move if no combinations are in threat
  function noThreat() {
    turn = 0;
    let positions = [4, 0, 6, 2, 8, 3, 5, 1, 7];
    for (let i = 0; i < positions.length; i++) {
      if (board[positions[i]] === '') {
        $('#' + positions[i]).html(comp);
        scan(positions[i], comp);
        break;
      }
    }
  }

  // if a win or loss is within 1 move
  function fillGap(row) {
    let targetRow = winningCombos[row];
    turn = 0;
    for (var i = 0; i < targetRow.length; i++) {
      let id = '#' + targetRow[i];
      if (board[targetRow[i]] === '') {
        $(id).html(comp);
        scan(targetRow[i], comp);
        break;
      }
    }
  }

  // declares the winner by highlighting the winning positions
  function winner(key, player) {
    for (let i = 0; i < winningCombos[key].length; i++) {
      if (player === comp) {
        $('#' + winningCombos[key][i]).css('background-color', '#e74c3c');
      } else if (player === human) {
        $('#' + winningCombos[key][i]).css('background-color', '#26eb00');
      }
    }
    setTimeout(nextGame, 1000);
  }

  // continuation of same session
  function nextGame() {
    moveCount = 0;
    turn = 0;
    $('.square').text('');
    $('.square').css('background-color', '#1fbe8c');
    let keys = Object.keys(board);
    keys.forEach(function(el) {board[el] = '';});
    keys = Object.keys(connectThree);
    keys.forEach(function(el) {connectThree[el] = 0;});
  }

  // clears the board for a new game
  $('#new-game').click(function() {
    human = '';
    comp = '';
    nextGame();
    playerReset();
  });

  // resets player selection buttons
  function playerReset() {
    setTimeout(reset, 250);
    $('#X').css('width', '165px');
    $('#O').css('width', '165px');
    $('.selector').addClass('symbol');
    $('.selector').addClass('symbol');
    function reset() {
      $('#O').html('');
      $('#X').html('');
      $('#O').html('O');
      $('#X').html('X');
    }
  }

});
