import React, { useState, useEffect, useCallback } from "react";
import wall from "./assets/wall.png";
import coin from "./assets/coin.png";
import pacmann from "./assets/pacman.png";
import bg from "./assets/bg.png";
import ghost from "./assets/ghost2.png";
import "./App.css"; // Import your CSS file


const PacManGame = () => {
  const [pacman, setPacman] = useState({ x: 6, y: 4});
  const [ghostPos, setGhostPos] = useState({x:7, y: 7});
  const [map, setMap] = useState ([
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 2, 2, 1, 1, 5, 1, 1, 2, 2, 2, 1],
    [1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1],
    [1, 2, 1, 1, 2, 2, 1, 2, 2, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 4, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  ]);
  const [gameOver, setGameover] = useState(false);

  

  //Player movement function
  const handleKeyDown = useCallback(
    (event) => {
      if (gameOver) return;

      let newX = pacman.x;
      let newY = pacman.y;

      if (event.keyCode === 37 && map[pacman.y][pacman.x - 1] !== 1) {
        // Move left
        newX -= 1;
      } else if (event.keyCode === 38 && map[pacman.y - 1][pacman.x] !== 1) {
        // Move up
        newY -= 1;
      } else if (event.keyCode === 39 && map[pacman.y][pacman.x + 1] !== 1) {
        // Move right
        newX += 1;
      } else if (event.keyCode === 40 && map[pacman.y + 1][pacman.x] !== 1) {
        // Move down
        newY += 1;
      } else {
        return;
      }

      setMap((prevMap) => {
        const newMap = [...prevMap];
        newMap[pacman.y][pacman.x] = 3; // Empty current cell
        newMap[newY][newX] = 5; // Pacman moves
        return newMap;
      });

      setPacman({ x: newX, y: newY });
      checkCollision(newX, newY, ghostPos.x, ghostPos.y);
    },
    [gameOver, map, pacman, ghostPos]
  );


  const moveGhost = useCallback(() => {
    if (gameOver) return;

    const directions = [
      { x: 0, y: -1 }, // Up
      { x: 0, y: 1 },  // Down
      { x: -1, y: 0 }, // Left
      { x: 1, y: 0 },  // Right
    ];

    const validMoves = directions.filter((dir) => {
       const newX = ghostPos.x + dir.x;
       const newY = ghostPos.y + dir.y;
       return (
        newX >= 0 &&
        newY >= 0 &&
        newX < map[0].length &&
        newY < map.length &&
        map[newY][newX] !== 1
       );
    });
    if (validMoves.length > 0) {
      const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
      const newX = ghostPos.x + randomMove.x;
      const newY = ghostPos.y + randomMove.y;

      setMap((prevMap) => {
        const newMap = [...prevMap];
        newMap[ghostPos.y][ghostPos.x] = 3; // Empty previous ghost cell
        newMap[newY][newX] = 4; // Ghost moves
        return newMap;
      });

      setGhostPos({ x: newX, y: newY });
      checkCollision(pacman.x, pacman.y, newX, newY);
    }
  }, [gameOver, ghostPos, map, pacman]);
  
  const checkCollision = (pacX, pacY, ghostX, ghostY) => {
    if (pacX === ghostX && pacY === ghostY) {
      setGameover(true);
      alert("Game over! The ghost caught you!");
    }
  };
    
  const checkWinningCondition = () => {
    if (!map.some((row) => row.includes(2))) {
      setGameover(true);
      alert("Congratulations! You collected all the coins. You win!");
    }
  };
//player movement effect
  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  //ghost movement effect
  useEffect(() => {
    const ghostInterval = setInterval(moveGhost, 500); // Move ghost every 500ms

    return () => {
      clearInterval(ghostInterval);
    };
  }, [moveGhost]);

return (
  <div id='world' style={{ backgroundColor: 'white'}}>
    {/*render the game map*/}
    {map.map((row,rowIndex) => (
      <div key={rowIndex}>
        {row.map((cell, colIndex) => (
          <div 
          key={colIndex}
          className={
            cell === 1
            ? "wall"
            : cell === 2
            ? "coin"
            : cell === 3
            ? "ground"
            : cell === 4
            ? "ghost"
            : cell === 5
            ? "pacman"
            : null
          }
          style={
            cell === 1
            ? { backgroundImage: `url(${wall})` }
            : cell === 2
            ? { backgroundImage: `url(${coin})` }
            : cell === 3
            ? { backgroundImage: `url(${bg})` }
            : cell === 4
            ? { backgroundImage: `url(${ghost})` }
            : cell === 5
            ? { backgroundImage: `url(${pacmann})` }
            : null
          }
          ></div>
        ))}
        </div>
    ))}
  </div>
);
};
export default PacManGame;
