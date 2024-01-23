
class KeyPressing{
    static _keyPresseds = [];
    static _init(){
        document.addEventListener('keydown', (e) => {
            const keyCode = e.keyCode;
            if (KeyPressing._keyPresseds.includes(keyCode) == false){
                KeyPressing._keyPresseds.push(keyCode)
            }
        })
        document.addEventListener('keyup', (e) => {
            const keyCode = e.keyCode;
            if (KeyPressing._keyPresseds.includes(keyCode) == true){
                const index = KeyPressing._keyPresseds.indexOf(keyCode);
                if (index !== -1) {
                    KeyPressing._keyPresseds.splice(index, 1);
                }
            }
        })
    }
    static isKeyPressed(keyCode){
        return KeyPressing._keyPresseds.includes(keyCode)
    }
}
KeyPressing._init();


document.addEventListener('DOMContentLoaded',() => 
{
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const levelDisplay = document.querySelector('#level')
    const livesDisplay = document.querySelector('#lives')
    const timeDisplay = document.querySelector('#timer')
    const fpsDisplay = document.querySelector('#fps')
    const startBtn = document.querySelector('#start-button')
    const resetBtn = document.querySelector('#reset-button')
    const width = 10
    const displaySquares = document.querySelectorAll('.mini-grid div')
    let displayIndex = 0
    let playOrWhat = false; 
    
    let score = 0
    
    let level = 1
    let lives = 9
    let timeLeft = 1800
    let currentPosition = 4
    let currentRotation = 0

    let speed = 60;
    let counter = 0;
    let number = 0;
    let gameTerminated = false;

    //+------------------------------------------------------------------+
    //| function startStop                                               |
    //+------------------------------------------------------------------+
    function startStop(hRes)
    {
        if (playOrWhat)
        {   
            if (counter === speed)
            {
                moveDown();  
                counter = 0;
            }
            counter++;
            //fpsDisplay.innerHTML = counter;

            if (hRes)
            {
                let diff = hRes - number;
               //console.log('frame', diff);
               fpsDisplay.innerHTML = Math.round(100000/diff)/100
               number = hRes; // highResolutionTimeStamp
            }
            requestAnimationFrame(startStop)
        }    
    }




    startBtn.addEventListener('click', () => 
    {
        if(!playOrWhat && !gameTerminated) 
        {
            playOrWhat = true;
            requestAnimationFrame(startStop);
            counter = 0
 
        } 
        else
        {
            playOrWhat = false;

        }
    })

    resetBtn.addEventListener('click', () => 
    {
        location.reload();
    })

    const upNextTetrominoes = 
    [
        [4, 8, 9, 10],
        [8, 9, 5, 6],
        [4, 5, 9, 10],
        [5, 6, 9, 10],
        [8, 4, 5, 6],
        [8, 9, 10, 5],
        [1, 5, 9, 13]
    ]


    const jTetromino = 
    [
        [0, 10, 11, 12],
        [1, 2, 11, 21],
        [10, 11, 12, 22],
        [1, 11, 20 ,21]
    ]

    
    const zTetromino = 
    [
        [11, 12, 20, 21],
        [1, 11, 12, 22],
        [11, 12, 20, 21],
        [1, 11, 12, 22]
    ]
    
    const sTetromino = 
    [
        [10, 11, 21, 22],
        [1, 10, 11, 20],
        [10, 11, 21, 22],
        [1, 10, 11, 20]
        
    ]
    const oTetromino = 
    [
        [0, 1, 10, 11],
        [0, 1, 10, 11],
        [0, 1, 10, 11],
        [0, 1, 10, 11]
    ]

    const lTetromino = 
    [
        [10,  11, 12, 20],
        [0, 1, 11, 21],
        [2, 10, 11, 12],
        [1, 11, 21, 22]
        
    ]
    const tTetromino = 
    [
        [1, 10, 11, 12],
        [1, 11, 12, 21],
        [10, 11, 12, 21],
        [1, 10, 11, 21]
    ]
    
    const iTetromino = 
    [
        [1, 11, 21, 31],
        [10, 11, 12, 13],
        [1, 11, 21, 31],
        [10, 11, 12, 13]
    ]

    const theTetrominoes = [jTetromino, zTetromino, sTetromino, oTetromino, lTetromino, tTetromino, iTetromino]

    let random = Math.floor(Math.random() * theTetrominoes.length)
    let nextRandom = Math.floor(Math.random() * theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]
    displayShape();


    //+------------------------------------------------------------------+
    //| function draw                                                    |
    //+------------------------------------------------------------------+

    function draw() 
    {
        current.forEach(index => 
        {
            squares[currentPosition + index].classList.add('tetromino')
        })
    }


    //+------------------------------------------------------------------+
    //| function undraw                                                  |
    //+------------------------------------------------------------------+
    function undraw() 
    {
        current.forEach(index => 
        {
            squares[currentPosition + index].classList.remove('tetromino')
        })
    }

      setInterval(() => 
    {
        if (KeyPressing.isKeyPressed(38) && playOrWhat)
        {
            rotate()
        }
    }, 120)

    setInterval(() => 
    {
        if (KeyPressing.isKeyPressed(40) && playOrWhat)
        {
            moveDown()
        }
     
    }, 50)

    setInterval(() => 
    {
        if (KeyPressing.isKeyPressed(37) && playOrWhat)
        {
            moveLeft()
        }
        if (KeyPressing.isKeyPressed(39) && playOrWhat)
        {
            moveRight()
        }
     
    }, Math.floor(speed))

    //+------------------------------------------------------------------+
    //| function moveDown                                                |
    //+------------------------------------------------------------------+
    function moveDown()
    {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }


    //+------------------------------------------------------------------+
    //| function freeze                                                  |
    //+------------------------------------------------------------------+
    function freeze()
    {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken')))
        {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))

            random = nextRandom
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()                        
        
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            displayShape()    

            addScore()
            gameOver()  
        }
    }

   //+------------------------------------------------------------------+
    //| function displayShape                                            |
    //+------------------------------------------------------------------+
    function displayShape()
    {
        displaySquares.forEach(square => 
        {
            square.classList.remove('tetromino')
        })
        upNextTetrominoes[nextRandom].forEach(index => 
        {
            displaySquares[displayIndex + index].classList.add('tetromino')        
        })
    }



    //+------------------------------------------------------------------+
    //| function moveLeft                                                |
    //+------------------------------------------------------------------+
    function moveLeft()
    {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
        if(!isAtLeftEdge)
        {
            currentPosition -=1
        }

        if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
        {
            currentPosition +=1
        }
        draw()
    }
    
    //+------------------------------------------------------------------+
    //| function moveRight                                               |
    //+------------------------------------------------------------------+
    function moveRight()
    {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
        if(!isAtRightEdge)
        {
            currentPosition +=1
        }

        if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
        {
            currentPosition -=1
        }
        draw()
    }



    //+------------------------------------------------------------------+
    //| function rotate                                                  |
    //+------------------------------------------------------------------+
    function rotate()
    {
        let roationAtTheMoment = currentRotation
        let positionAtTheMoment = currentPosition
        
        if ((current.some(index => (currentPosition + index) % width === width - 1)) || (current.some(index => (currentPosition + index) % width === width - 2)))
        {
            undraw()
            currentRotation ++
            if(currentRotation === current.length)
            {
                currentRotation = 0
            }
            current = theTetrominoes[random][currentRotation]
            
            for (let i = 0; i < 2; i++) 
            {
                if (current.some(index => (currentPosition + index) % width === 0))
                {
                    currentPosition -=1
                }
            }

            if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
            {
                current = theTetrominoes[random][roationAtTheMoment]
                currentPosition = positionAtTheMoment
            }

            draw();
        }
        else if ((current.some(index => (currentPosition + index) % width === 0)) || (current.some(index => (currentPosition + index) % width === 1)))
        {
            undraw()
            currentRotation ++
            if(currentRotation === current.length)
            {
                currentRotation = 0
            }
            current = theTetrominoes[random][currentRotation]
            
            for (let i = 0; i < 2; i++) 
            {
                if (current.some(index => (currentPosition + index) % width === 9))
                {
                    currentPosition +=1
                }
            }
        
            if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
            {
                current = theTetrominoes[random][roationAtTheMoment]
                currentPosition = positionAtTheMoment
            }
            draw();
        }
        else
        {
            undraw()
            currentRotation ++
            if(currentRotation === current.length)
            {
                currentRotation = 0
            }
            current = theTetrominoes[random][currentRotation]
           
            if(current.some(index => squares[currentPosition + index].classList.contains('taken')))
            {
                current = theTetrominoes[random][roationAtTheMoment]
                currentPosition = positionAtTheMoment
            }
            draw()
        }
    }

    
    //+------------------------------------------------------------------+
    //| function addScore                                                |
    //+------------------------------------------------------------------+
    function addScore()
    {
        let bool = false;
        for(let i = 0; i < 199; i += width)
        {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]
            
            if(row.every(index => squares[index].classList.contains('taken')))
            {
                bool = true;
                score += 10
                scoreDisplay.innerHTML = score

                if (score%100 === 0 && score > 0)
                {
                    speed -= 5
                    level +=1
                    
                    levelDisplay.innerHTML = level 
                }

                

                row.forEach(index => 
                {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
              
            }
        }
        
        if(bool)
        {
            for(let ii = 0; ii < 199; ii++)
            {
                if(squares[ii].classList.contains('tetromino') && !squares[ii].classList.contains('taken'))
                {    
                    squares[ii].classList.remove('tetromino')
                    squares[ii - 10].classList.add('tetromino')
                    bool = false;   
                }
            }
        }

        if(score >= 1000)
        {
            scoreDisplay.innerHTML = "WAR IS OVER, UKRAINE WON!!!"
            levelDisplay.innerHTML = "SLAVA UKRAINI!!!"
            playOrWhat = false;
            
            
            for(let iii = 0; iii <= 199; iii++)
            {
                undraw()
                squares[iii].classList.remove('tetromino');
                squares[iii].classList.remove('taken');
                draw()
            }
         
           
        }
    }


    //+------------------------------------------------------------------+
    //| function gameOver                                                |
    //+------------------------------------------------------------------+
    function gameOver()
    {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken')) && lives === 1)
        {
            livesDisplay.innerHTML = 'The game is over. You spent all nine of your lives.'
            playOrWhat = false;
            gameTerminated = true;

            for(let i = 0; i <= 199; i++)
            {
                undraw()
                squares[i].classList.remove('tetromino');
                squares[i].classList.remove('taken');
                draw()
            }
        }

        if(current.some(index => squares[currentPosition + index].classList.contains('taken')) && lives > 1)
        {
            lives -= 1;
            livesDisplay.innerHTML = lives
            for(let i = 0; i <= 199; i++)
            {
                undraw()
                squares[i].classList.remove('tetromino');
                squares[i].classList.remove('taken');
                draw()
            }
            
        }

    }



    //+------------------------------------------------------------------+
    //| function calculateTime                                           |
    //+------------------------------------------------------------------+

    function calculateTime()
    {
        if (playOrWhat)
        {
            timeLeft -= 1
            let minutesLeft = Math.floor(timeLeft/60)
            let secondsLeft = timeLeft % 60
            if(secondsLeft < 10)
            {
                secondsLeft = "0" + secondsLeft
            }

            timeDisplay.innerHTML = minutesLeft + ":" + secondsLeft;
        }

        if(timeLeft === 0)
        {
            levelDisplay.innerHTML = "SLAVA UKRAINI!!!";
            timeDisplay.innerHTML = "The game is over, time is up.";
            playOrWhat = false;
            gameTerminated = true;
        }

    }
    setInterval(calculateTime, 1000)
})