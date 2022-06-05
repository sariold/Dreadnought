# SERVER SHIT
--When PLAYER A clicks on 1v1, it should generate a unique id that PLAYER B can insert into a textbox that connects them to PLAYER A--the game's transitionState may be 'HALF' or 'FULL'--If the game is 'HALF', the PLAYER who joins using the code becomes PLAYER B. If the game is 'FULL', the PLAYER who joins using the code is rejected and the user is presented with the ServerWindow div.

--Clicking 1v1, should generate a unique server id inside the gameID input box, so that the user can simply click join and they will be redirected to that specific URL, such as http://localhost:9138/game?gameID=12kjlk412

--When a PLAYER clicks random, they will immediately join a game which can have 2 cases--the game's transitionState may be 'EMPTY' or 'HALF'--If the game is 'EMPTY', the first PLAYER becomes PLAYER A. If the game is 'HALF', the PLAYER that just joins becomes PLAYER B.
