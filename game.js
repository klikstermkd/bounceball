window.onload = function()
{
   var canvas;
   var ctx;
   var gameWidth;
   var gameHeight;
   var x, y;
   var dx, dy;
   var leftPaddleY;
   var rightPaddleY;
   var paddleH = 60;
   var paddleW = 12;
   var ballR = 10;
   var ballColor = "#08adff";
   var paddleColor = "#08adff";
   var leftPoints = 0;
   var rightPoints = 0;
   var scoreForWin = 10;
   var playInterval = 0;
   var gamePaused = false;
   var positionX = false;

   function init()
   {
      initParams();
      initLoader();
   }

   function initParams()
   {
      canvas = document.getElementById("canvas");
      ctx = canvas.getContext("2d");

      gameWidth = canvas.offsetWidth;
      gameHeight = canvas.offsetHeight; 

      x = gameWidth / 2;
      y = gameHeight / 2;  
   }

   var loaderInterval;
   var loaderCounterInterval;
   var loading = document.getElementById("loading");
   var i = 0;
   var loaderR = 40;

   function initLoader() 
   {
      loaderInterval = setInterval(drawLoader, 1);
      loaderCounterInterval = setInterval(drawLoaderCounter, 60);

      dx = 0.3;
      dy = 0.25;
   }

   function drawLoader() 
   {
      clearScreen();  

      if (x > gameWidth - loaderR || x < loaderR)
      {
         dx = -dx;
      }

      if (y > gameHeight - loaderR || y < loaderR)
      {
         dy = -dy;
      }

      ctx.fillStyle = "#08adff";
      ctx.beginPath();
      ctx.arc(x, y, loaderR, 0, (Math.PI / 180) * 360, false);
      ctx.fill();

      ctx.fillStyle = "#ffffff";
      ctx.font = "25px Frijole";
      ctx.textAlign = "center";
      ctx.fillText(i + "%", x, y + 10);

      x += dx;
      y += dy;
   }

   function drawLoaderCounter()
   {
      if (i < 100)
      {  
         i++;
      }
      else
      {
         clearInterval(loaderInterval);
         clearInterval(loaderCounterInterval);
         drawMenuScreen();
      }
   }

   function drawMenuScreen()
   {
      clearScreen();

      onePlayer.style.visibility  = "visible";  
      twoPlayers.style.visibility = "visible";
      title.style.visibility      = "visible";
   }

   function initGame()
   {
      x = gameWidth / 2;
      y = gameHeight / 2; 

      if (positionX)
      {
         dx = -1.3;
      }
      else
      {
         dx = 1.3;
      }

      dy = 1.1;

      leftPaddleY = gameHeight / 2  - paddleH / 2;
      rightPaddleY = gameHeight / 2  - paddleH / 2;

      playInterval = setInterval(drawPlayScreen, 1);
   }

   function drawPlayScreen()
   {
      gamePaused = true;

      clearScreen();

      rect(0, leftPaddleY, paddleW, paddleH);
      rect(gameWidth - paddleW, rightPaddleY, paddleW, paddleH);;

      if (isOnePlayer)
      {
         if (upKeyDown) 
         {
            if (rightPaddleY > 0) 
            {
               rightPaddleY -= 3;
            }
         } 
         else if (downKeyDown) 
         {
            if (rightPaddleY < gameHeight - paddleH) 
            {
               rightPaddleY += 3;
            }
         }

         if (x < gameWidth / 5 && leftPaddleY < gameHeight)
         {
            leftPaddleY = y - paddleH / 2;
         }
      }
      else if (areTwoPlayers)
      {
         if (upKeyDown) 
         {
            if (rightPaddleY > 0) 
            {
               rightPaddleY -= 3;
            }
         } 
         else if (downKeyDown) 
         {
            if (rightPaddleY < gameHeight - paddleH) 
            {
               rightPaddleY += 3;
            }
         }

         if (wKeyDown) 
         {
            if (leftPaddleY > 0) 
            {
               leftPaddleY -= 3;
            }
         } 
         else if (sKeyDown) 
         {
            if (leftPaddleY < gameHeight - paddleH) 
            {
               leftPaddleY += 3;
            }
         }
      }

      if (x > gameWidth - paddleW - ballR && y > rightPaddleY && y < rightPaddleY + paddleH)
      {
         dx = -dx;
      }
      else if (x > gameWidth - ballR)
      {     
         clearInterval(playInterval);
         positionX = false;
         
         if (leftPoints < scoreForWin)
         {
            leftPoints++;

            if (leftPoints == scoreForWin)
            {
               setTimeout(drawWinnerScreen, 500);
            }
            else
            {
               setTimeout(initGame, 500);
            }
         }
      }

      if (x < paddleW + ballR && y > leftPaddleY && y < leftPaddleY + paddleH)
      {
         dx = -dx;
      }
      else if (x < ballR)
      {     
         clearInterval(playInterval);
         positionX = true;

         if (rightPoints < scoreForWin)
         {
            rightPoints++;

            if (rightPoints == scoreForWin)
            {
               setTimeout(drawWinnerScreen, 500);
            }
            else
            {
               setTimeout(initGame, 500);
            }
         }
      }

      drawScoreScreen();

      circle(x, y);

      if (y < ballR || y > gameHeight - ballR)
      {
         dy = -dy;
      }

      x += dx;
      y += dy;
   }

   function drawScoreScreen()
   {
      var rectWidth = 120;
      var rectHeight = 50;

      ctx.strokeStyle = "#08adff";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(gameWidth / 2, 0);
      ctx.lineTo(gameWidth / 2, gameHeight);
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(gameWidth / 2 - rectWidth / 2, gameHeight / 2 - rectHeight / 2, rectWidth, rectHeight);
      ctx.stroke();

      ctx.font = "30px Frijole";
      ctx.textAlign = "center";
      ctx.fillText(leftPoints, gameWidth / 2 - rectWidth / 4, gameHeight / 2 + rectHeight / 4);
      ctx.fillText(rightPoints, gameWidth / 2 + rectWidth / 4, gameHeight / 2 + rectHeight / 4);
   }

   function drawWinnerScreen()
   {
      var onePlayerName = playerInput.value;
      var firstPlayerName = playerOneInput.value;
      var secondPlayerName = playerTwoInput.value;
      var winner;

      gamePaused = false;

      clearScreen();

      if (isOnePlayer)
      {
         if (leftPoints < rightPoints)
         {
            winner = true;
         }
         else
         {
            winner = false;
         }
      } 
      else if (areTwoPlayers)
      {
         if (leftPoints < rightPoints)
         {
            winner = secondPlayerName;
         }
         else
         {
            winner = firstPlayerName;
         }
      }

      ctx.fillStyle = "#08adff";
      ctx.font = "30px Frijole";
      ctx.textAlign = "center";

      if (isOnePlayer)
      {
         if (winner)
         {
            ctx.fillText("Congratulations " + onePlayerName, gameWidth / 2, gameHeight / 2 - 50);
            ctx.fillText("You won!", gameWidth / 2, gameHeight / 2 + 15);
         }
         else
         {
            ctx.fillText("Sorry " + onePlayerName, gameWidth / 2, gameHeight / 2 - 50);
            ctx.fillText("You lost!", gameWidth / 2, gameHeight / 2 + 15);
         }
      }
      else if (areTwoPlayers)
      {
         ctx.fillText("Congratulations " + winner, gameWidth / 2, gameHeight / 2 - 50); 
         ctx.fillText("You won!", gameWidth / 2, gameHeight / 2 + 15);
      }
      
      playAgain.style.visibility = "visible";
   }

   var upKeyDown       = false;
   var downKeyDown     = false;
   var wKeyDown        = false;
   var sKeyDown        = false;
   var onePlayerClick  = false;
   var twoPlayersClick = false;
   var isOnePlayer     = false;
   var areTwoPlayers   = false;
   var isGamePaused    = true;

   var playerInput     = document.getElementById("playerInput");
   var playerOneInput  = document.getElementById("firstPlayerInput");
   var playerTwoInput  = document.getElementById("secondPlayerInput");
   var onePlayer       = document.getElementById("onePlayer");
   var twoPlayers      = document.getElementById("twoPlayers");
   var play            = document.getElementById("play");
   var playAgain       = document.getElementById("playAgain");
   var back            = document.getElementById("back");
   var title           = document.getElementById("title");
   var enterName       = document.getElementById("enterName");
   var enterFirstName  = document.getElementById("enterFirstName");
   var enterSecondName = document.getElementById("enterSecondName");

   function onePlayerOnClick()
   {
      onePlayer.style.visibility   = "hidden";
      twoPlayers.style.visibility  = "hidden";
      playerInput.style.visibility = "visible";
      play.style.visibility        = "visible";
      back.style.visibility        = "visible";
      enterName.style.visibility   = "visible";

      isOnePlayer = true;
   }

   function twoPlayersOnClick()
   {
      onePlayer.style.visibility       = "hidden";
      twoPlayers.style.visibility      = "hidden";
      playerOneInput.style.visibility  = "visible";
      playerTwoInput.style.visibility  = "visible";
      play.style.visibility            = "visible";
      back.style.visibility            = "visible";
      enterFirstName.style.visibility  = "visible";
      enterSecondName.style.visibility = "visible";

      areTwoPlayers = true;
   }

   function playOnClick()
   {
      playerInput.style.visibility     = "hidden";
      playerOneInput.style.visibility  = "hidden";
      playerTwoInput.style.visibility  = "hidden";
      enterName.style.visibility       = "hidden";
      enterFirstName.style.visibility  = "hidden";
      enterSecondName.style.visibility = "hidden";
      title.style.visibility           = "hidden";
      play.style.visibility            = "hidden";
      back.style.visibility            = "hidden";

      initGame();
   }

   function playAgainOnClick()
   {
      playAgain.style.visibility = "hidden";

      leftPoints = 0;
      rightPoints = 0;

      drawMenuScreen();
   }

   function backOnClick()
   {
      playerInput.style.visibility     = "hidden";
      playerOneInput.style.visibility  = "hidden";
      playerTwoInput.style.visibility  = "hidden";
      enterName.style.visibility       = "hidden";
      enterFirstName.style.visibility  = "hidden";
      enterSecondName.style.visibility = "hidden";
      play.style.visibility            = "hidden";
      back.style.visibility            = "hidden";
      title.style.visibility           = "visible";

      drawMenuScreen();
   }

   var pauseInterval;

   function onKeyDown(e)
   {
      if (e.keyCode == 38)
      {
         upKeyDown = true;
      }
      else if (e.keyCode == 40)
      {
         downKeyDown = true;
      }

      if (e.keyCode == 87)
      {
         wKeyDown = true;
      }
      else if (e.keyCode == 83)
      {
         sKeyDown = true;
      } 

      if (e.keyCode == 80)
      {
         if (gamePaused)
         {
            if (isGamePaused)
            {
               clearInterval(playInterval);
               pauseInterval = setInterval(pauseText, 500);
               isGamePaused = false;
            }
            else
            {
               clearInterval(pauseInterval);
               playInterval = setInterval(drawPlayScreen, 1);
               isGamePaused = true;
            }
         }
      }
   }

   function onKeyUp(e)
   {
      if (e.keyCode == 38)
      {
         upKeyDown = false;
      }
      else if (e.keyCode == 40)
      {
         downKeyDown = false;
      }

      if (e.keyCode == 87)
      {
         wKeyDown = false;
      }
      else if (e.keyCode == 83)
      {
         sKeyDown = false;
      }
   }

   twoPlayers.addEventListener("click", function() { twoPlayersOnClick() }, false);
    onePlayer.addEventListener("click", function() { onePlayerOnClick() }, false);
    playAgain.addEventListener("click", function() { playAgainOnClick() }, false);
         play.addEventListener("click", function() { playOnClick() }, false);
         back.addEventListener("click", function() { backOnClick() }, false);
       window.addEventListener("keydown", onKeyDown, false);
       window.addEventListener("keyup", onKeyUp, false);
       

   function circle(x, y)
   {
      ctx.fillStyle = ballColor;
      ctx.beginPath();
      ctx.arc(x, y, ballR, 0, (Math.PI / 180) * 360, true);
      ctx.fill();
   }

   function rect(x, y, w, h)
   {
      ctx.fillStyle = paddleColor;
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.fill();
   }

   var pauseCounter = 2;

   function pauseText()
   {
      clearScreen();

      if (pauseCounter % 2 == 0)
      {
         ctx.fillStyle = "#08adff";
         ctx.textAlign = "center";
         ctx.font = "40px Frijole";
         ctx.fillText("Paused!", gameWidth / 2, gameHeight / 2);
      }
      else
      {
         clearScreen();
      }

      pauseCounter++;
   }

   function clearScreen() {
      ctx.clearRect(0, 0, gameWidth, gameHeight);
   }

   init(); 
};