function generateWinningNumber() {
  return Math.floor(Math.random() * 100 + 1);
}

function shuffle(array) {
  var m = array.length, t, i;
  // While there remain elements to shuffle…
  while (m) {
    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);
    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
}

function Game() {
  this.playersGuess = null;
  this.pastGuesses = [];
  this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function() {
  return this.playersGuess > this.winningNumber ? this.playersGuess - this.winningNumber : this.winningNumber - this.playersGuess;
}

Game.prototype.isLower = function() {
  return this.playersGuess < this.winningNumber ? true : false;
}

Game.prototype.playersGuessSubmission = function(num) {
  if (num > 100 || num < 1 || typeof num !== 'number') {
    $('#ahoy').text('Oops!');
    $('#intro').text('That\'s not a valid guess! Try again.')
    throw 'That is an invalid guess.';
  } else {
    this.playersGuess = num;
    return this.checkGuess();
  }
}

Game.prototype.checkGuess = function() {
  if (this.playersGuess === this.winningNumber) {
    $('#ahoy').text('You win!');
    $('#intro').text('There were ' + this.winningNumber + ' dubloons in the chest!  Click \"Reset\" to play again!');
    $('#submit').prop('disabled', true);
    $('#hint').prop('disabled', true);
    return 'You Win!';
  } else if (this.pastGuesses.includes(this.playersGuess)) {
    $('#ahoy').text('You already guessed that!');
    $('#intro').text('Guess a NEW number!');
    return 'You have already guessed that number.';
  } else if (this.pastGuesses.length < 4) {
    this.pastGuesses.push(this.playersGuess);
    $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
    if (this.isLower()) {
      $('#intro').text('Guess higher.');
    } else {
      $('#intro').text('Guess lower.');
    }
    if (this.difference() < 10) {
      $('#ahoy').text('You\'re burning up!');
      return 'You\'re burning up!';
    } else if (this.difference() < 25) {
      $('#ahoy').text('You\'re lukewarm.');
      return 'You\'re lukewarm.';
    } else if (this.difference() < 50) {
      $('#ahoy').text('You\'re a bit chilly.');
      return 'You\'re a bit chilly.';
    } else {
      $('#ahoy').text('You\'re ice cold!');
      return 'You\'re ice cold!';
    }
  } else {
    this.pastGuesses.push(this.playersGuess);
    $('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);
    $('#ahoy').text('You lose!');
    $('#intro').text('There were ' + this.winningNumber + ' dubloons in the chest!  Click \"Reset\" to play again!');
    $('#submit').prop('disabled', true);
    $('#hint').prop('disabled', true);
    return 'You Lose.';
  }
}

function newGame() {
  return new Game();
}

Game.prototype.provideHint = function() {
  var result = [this.winningNumber]
  result.push(generateWinningNumber());
  result.push(generateWinningNumber());
  return shuffle(result).join(', ');
}

function makeGuess(game) {
  var input = +$('#player-input').val();
  $('#player-input').val('');
  console.log(game.playersGuessSubmission(input));
}

$(document).ready(function() {
  var currentGame = new Game();
  console.log(currentGame.winningNumber);

  $('#submit').on('click', function() {
    makeGuess(currentGame);
  });

  $('#player-input').on('keypress', function(e) {
    if (e.which === 13) {
      makeGuess(currentGame);
    }
  });

  $('#hint').on('click', function() {
    var hint = currentGame.provideHint();
    $('#ahoy').text('One of these is the answer:');
    $('#intro').text(hint);
  });

  $('#reset').on('click', function() {
    location.reload();
  });
});
