const GRID_SIZE = 4
const CELL_SIZE = 20
const CELL_GAP = 2

export default class Grid {
    #cells

    constructor(gridElement) {
        gridElement.style.setProperty('--grid-size', GRID_SIZE)
        gridElement.style.setProperty('--cell-size', `${CELL_SIZE}vmin`)
        gridElement.style.setProperty('--cell-gap', `${CELL_GAP}vmin`)
        this.#cells = createCellElement(gridElement).map((cellElement, index) => 
            new Cell(index % GRID_SIZE, Math.floor(index / GRID_SIZE))
        )
    }

    get cells() { return this.#cells }

    get #emptyCells() {
        return this.#cells.filter(cell => cell.tile == null)
    }

    randomEmptyCell() {
        const randomIndex = Math.floor(Math.random() * this.#emptyCells.length)
        return this.#emptyCells[randomIndex]
    }

    get cellByColumn() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.x] = cellGrid[cell.x] || []
            cellGrid[cell.x][cell.y] = cell
            return cellGrid
        }, [])
    }

    get cellByRow() {
        return this.#cells.reduce((cellGrid, cell) => {
            cellGrid[cell.y] = cellGrid[cell.y] || []
            cellGrid[cell.y][cell.x] = cell
            return cellGrid
        }, [])
    }
}

class Cell {
    #x
    #y
    #tile
    #mergeTile

    constructor(x, y) {
        this.#x = x
        this.#y = y
    }

    get x() { return this.#x }

    get y() { return this.#y }

    get tile() { return this.#tile }

    set tile(value) {
        this.#tile = value
        if (value == null) return
        this.#tile.x = this.x
        this.#tile.y = this.y
    }

    canAccept(tile) {
        return this.tile == null || this.#mergeTile == null && this.tile.value == tile.value
    }

    set mergeTile(value) {
        this.#mergeTile = value
        if (value == null) return
        this.#mergeTile.x = this.x
        this.#mergeTile.y = this.y
    }

    mergeTiles() {
        if (this.tile == null || this.#mergeTile == null) return
        this.#tile.value *= 2
        this.#mergeTile.remove()
        this.#mergeTile = null
    }
}

function createCellElement(gridElement) {
    const cells = []
    for (var i = 0; i < GRID_SIZE ** 2; i++) {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        gridElement.append(cell)
        cells.push(cell)
    }
    return cells
}