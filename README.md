**Description** 

Tic tac toe is a game in which two players alternately put Xs and Os in compartments of a figure formed by two vertical lines crossing two horizontal lines and each tries to get a row of three Xs or three Os before the opponent does.

For their develop we use Typescript, Svelte and other tools as tailwindcss and daisyUI.

This game has tree game modes:

- **Computer**: This game mode consists of playing against the computer that performs automatic movements. It consists of three levels: Easy, normal and difficult. Normal and difficult levels have implemented an artificial intelligence algorithm known as minimax which allows to anticipate the movements and in case of maximum difficulty make it invincible.

- **Local**: This game mode allows you to play with a partner on the same computer.

- **Network**: The last option to choose as a game mode is network that allows you to play with a partner in different computers, you can create a game and share and ID game for your partner join or you can join it if you have an id.

***illustrative image***
![alt text](https://i.imgur.com/qXadvKv.png)

The deployment was made in Netlify and WebRTC, The game can be accessed through the following link: https://triqui.netlify.app

If you want to run it use: *npm run dev*