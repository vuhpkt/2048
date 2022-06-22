import Grid from "./Grid.js"
import Tile from "./Tile.js"

const modal = document.querySelector('.modal')
const restartBtn = document.querySelector('.restart-btn')


const gameBoard = document.getElementById("game-board")

const grid = new Grid(gameBoard)

grid.randomEmptyCell().tile = new Tile(gameBoard)
grid.randomEmptyCell().tile = new Tile(gameBoard)

setupInput()

function setupInput() {
    window.addEventListener("keydown", handleInput, { once: true })
}

async function handleInput(e) {
    switch (e.key) {
        case "ArrowDown":
            if (!canMoveDown()) {
                setupInput()
                return
            }
            await moveDown()
            break
        case "ArrowUp":
            if (!canMoveDown()) {
                setupInput()
                return
            }
            await moveDown()
            break
        case "ArrowRight":
            if (!canMoveLeft()) {
                setupInput()
                return
            }
            await moveLeft()
            break
        case "ArrowLeft":
            if (!canMoveLeft()) {
                setupInput()
                return
            }
            await moveLeft()
            break
        default:
            setupInput()
            return
    }

    grid.cells.forEach(cell => {
        cell.mergeTiles()
    })
    const newTile = new Tile(gameBoard)
    grid.randomEmptyCell().tile = newTile

    if (!canMoveLeft() && !canMoveRight() && !canMoveUp() && !canMoveDown()) {
        await newTile.waitForTransition(true)
        modal.style.display = 'flex'
    }

    setupInput()
}

function moveDown() {
    return slideTile(grid.cellByColumn.map(group => [...group].reverse()))
}

function moveUp() {
    return slideTile(grid.cellByColumn)
}

function moveLeft() {
    return slideTile(grid.cellByRow)
}

function moveRight() {
    return slideTile(grid.cellByRow.map(group => [...group].reverse()))
}

function slideTile(cells) {
    return Promise.all(
        cells.flatMap(group => {
            const promises = []
            console.log(group)
            for (let i = 1; i < group.length; i++) {
                const cell = group[i]
                if (cell.tile == null) continue
                let lastValidCell
                for (let j = i - 1; j >= 0; j--) {
                    const moveToCell = group[j]
                    if (!moveToCell.canAccept(cell.tile)) break
                    lastValidCell = moveToCell
                }
                if (lastValidCell != null) {
                    promises.push(cell.tile.waitForTransition())
                    if (lastValidCell.tile == null) {
                        lastValidCell.tile = cell.tile
                    } else {
                        lastValidCell.mergeTile = cell.tile
                    }
                    cell.tile = null
                }
            }
            return promises
        })
    )
}

function canMoveDown() {
    return canMove(grid.cellByColumn.map(group => [...group].reverse()))
}

function canMoveUp() {
    return canMove(grid.cellByColumn)
}

function canMoveLeft() {
    return canMove(grid.cellByRow)
}

function canMoveRight() {
    return canMove(grid.cellByRow.map(group => [...group].reverse()))
}

function canMove(cells) {
    return cells.some(group => {
        return group.some((cell, index) => {
            if (index == 0) return false
            if (cell.tile == null) return false
            const moveToCell = group[index - 1]
            return moveToCell.canAccept(cell.tile)
        })
    })
}

restartBtn.onclick = restart

function restart () {
    modal.style.display = 'none'
    for (let i = 0; i < grid.cells.length; i++) {
        if (grid.cells[i].tile == null) continue
        grid.cells[i].tile.remove()
        grid.cells[i].tile = null
    }

    grid.randomEmptyCell().tile = new Tile(gameBoard)
    grid.randomEmptyCell().tile = new Tile(gameBoard)
}

var startX, startY, moveX, moveY;
//here clientX, and clientY means X and Y coordinates
function touchStart(e){
    startX = e.touches[0].clientX ;
    startY = e.touches[0].clientY ;
}

function touchMove(e){
    moveX = e.touches[0].clientX ;
    moveY = e.touches[0].clientY ;
}
async function touchEnd(){
    if(startX+100 < moveX){
        if (!canMoveRight()) {
            setupInput()
            return
        }
        await moveRight()
    }else if(startX-100 > moveX){
        if (!canMoveLeft()) {
            setupInput()
            return
        }
        await moveLeft()
    }
    if(startY+100 < moveY){
        if (!canMoveDown()) {
            setupInput()
            return
        }
        await moveDown()
    }else if(startY-100 > moveY){
        if (!canMoveUp()) {
            setupInput()
            return
        }
        await moveUp()
    }

    grid.cells.forEach(cell => {
        cell.mergeTiles()
    })
    const newTile = new Tile(gameBoard)
    grid.randomEmptyCell().tile = newTile

    if (!canMoveLeft() && !canMoveRight() && !canMoveUp() && !canMoveDown()) {
        await newTile.waitForTransition(true)
        modal.style.display = 'flex'
    }

    setupInput()
}

window.ontouchstart = touchStart
window.ontouchmove = touchMove
window.ontouchend = touchEnd