# Plan of Action
## 1. Chat
-- needs to be implemented in the server-side of the game
-- when you type a message it should pop up on both screens
-- we need to work with web sockets, so that the messages are visible on both screens
-- we need to add functionality for the Send button and allow sending messages with "enter" button
-- play noise when you receive message

## 2. Number of Moves
-- counter for your moves
-- counter for enemy moves

## 3. Enemy/Player Ships
### During preparation
-- before the game has started you should be able to see your ships one at a time and arrange them on the board
--- if your enemy is not ready you will get alert "Waiting for your opponent"
-- there is going to be a button to rotate the ship before placing it on the board
### After the game has started
-- you will see your own ships when it is not your turn
-- you will see a shipless grid when it is your turn so you have to guess where to shoot
-- every ship consists of different pictures which will update once a ship is hit
--- When you win or lose you will get a notification

## 4. Surrender button
-- when pressed shoud return you to the splash screen
-- should notify the other player that the connection is lost

## 5. Board
### During preparation
-- presents current ship type and prompts the user to click anywhere on the 10x10 grid to place their ship
-- should restrict the user from adding new ships on top of each other or right next to their other ships or outside of the boundaries of the grid
### After the game has started
-- after the game has started the user that was ready second will see his own ships and the other player will attack him
-- player will be notified thet it is not his turn and that he is spectating his own ships
-- when all the pieces of a ship get destroyed the players will be notified
-- when all the ships get destroyed the game ends
-- Screen indicators to allow players to know whose turn it is
-- as player 1 selects which tile to attack, player 2 will be viewing as spectator of their own board
-- if it is not your turn, the board will restrict access to attacking enemy ships and will show your ships
-- clicking on a tile when it is your turn will check if their is an enemy ship segment and present both user screens with a CSS indicator of whether or not it was a hit or miss

## Side notes
-- we need different id for each box of the table
-- when connection is lost, players should be notified

# Server Side 
## 1. Splash Screen
-- User should be shown a total of three statistics: number of games played in total, number of players online, and total number of times they have visited the website using a client side cookie
-- Need to implement client side cookie, will do that once game is complete
## 2. Game Screen
-- The header will contain a div element for keeping count of both PLAYER A and PLAYER B's amount of moves
-- The counter for the number of moves will be kept on the server side. After each player selects a spot on the grid to fire, game.js function will increase the amount of moves for either PLAYER A or B and send that info directly to the server which will then be transmitted back to the clients in the current game
-- This html element will be updated by the server and the number of moves will be placed inside using "span" elements
-- The chatbox in the bottom right corner will allow both PLAYER A and PLAYER B to communicate as they play
-- The chat history will be saved and presented to both clients that are connected to the server
-- The gameboard is a matrix that will store where both PLAYER A and PLAYER B's ships are
-- This matrix will be sent from client to server and back from server to client after each PLAYER initiates a move. Each player's matrix will be updated with the correct numbers to indicate a hit or a miss and sent directly to the server using websockets
## 3. Database (Splash Screen)
-- In order to keep track of how many players are online, how many games have been played, and how many times each user has visited the website, we are going to need to keep and update a server side database.
-- To see how many current players are online, we will be using websockets in order to determine how many concurrent connections there are at one time and then increment the element on the splash screen
-- To keep track of how many times each user has visited the webpage, we will use client side cookies to keep record
-- The first time a user connects to our website, their client will donwload a unique cookie, which we can then use to identify them and increment the number element of how many times they have visited the site

# Game Objects
## 1. GameBoard
-- Object constructor to create a gameboard once a client connects and joins a game
-- Will construct a gameboard grid for the user to place their ships accordingly
## 2. Status Bar
-- Notifies the user of the current status message from the server
-- Whose turn it is, waiting for player to connect, player has disconnected, who has won
-- Will be used to help the player understand the flow of the game due to our design of only having one gameboard that alternates as the player's turns change
## 3. Player Ship's Indicator
-- UI element that indicates to a player how many and which section of their ships the enemy has hit
-- Will include a rotate button to allow the player to change the orientation of their ships in order to increase user configurability on the gameboard
-- Will present the user with one ship image at a time with the prompt to place their ships to allow them to understand which ship is concurrently ready to be placed on the board
## 4. Chat Box/History
-- Allows the players to communicate with each other over their websocket connections to the server
-- Chat history will be scrollable and they can view all of their shared messages
-- Chat box will remain hidden until the game status is "2 JOINT" which means two players are connected and the game is ready to start