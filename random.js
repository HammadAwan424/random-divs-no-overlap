document.addEventListener("DOMContentLoaded", function() {

    // Generated a grid 2d array with 200 height (200 subarrays) and 190 width (len of subarrays)
    const grid = new Grid(200, 190)

    // Add borders so those pixels are not selected surrounding grid
    grid.addBordersToGrid(5) 

    // Visual test of grid on screen, red pixels that are out and green that can be selected in future
    grid.checkGrid() 


    for (let i = 0; i < 10; i++) {
        // Return available coordinates which are not red or excluded
        const [y, x] = grid.getAvailableCoors()

        console.log("y: ", y, "x: ", x)

        // Generate a circular div with center at coordinates
        generateDiv(y, x)
    }   
    // generateDiv(0, 0)
})




class Grid {
    constructor(height, width) {
        this.height = height
        this.width = width
        this.grid = this.getScreenGrid(height, width)

        // to know which rows aka grid[n] are empty arrays so to end random picking when len(arr) == len(grid)
        this.exhaustedRows = []

        // !!Need to modify the below to adapt, must be element (w / 2 or h / 2) + borders for now
        this.elementWidth = 20
        this.elementHeight = 20
    }

    set height(n) {
        this._height = n
        this.grid = this.getScreenGrid(this.height, this.width)
    }
    get height() {
        return this._height
    }

    set width(n) {
        this._width = n
        this.grid = this.getScreenGrid(this.height, this.width)
    }
    get width() {
        return this._width
    }


    getAvailableCoors(screenGrid = this.grid) {
        
        let y = 0
        let x = 0

        // Breaks when correct pixel (x, y coors) is found
        while (true) { 

            // random y until array of non zero len is found aka y coordinate
            y = Math.floor(Math.random() * screenGrid.length) 
            if (screenGrid[y].length == 0) {
                this.exhaustedRows.push(y) // shrinks problem by increasing zero rows number
                continue
            }


            // random index from yth row then its value aka x coordinate
            let xIndex = Math.floor(Math.random() * screenGrid[y].length)
            x = screenGrid[y][xIndex]

            // Very left or very right, shrinks the array aswell
            if (x < this.elementWidth || x > (this.width - 30)) { 
                screenGrid[y].splice(xIndex, 1)
                continue
            }

            // Very top or bottom, shrinks the array aswell
            if (y < this.elementHeight || y > (this.height - this.elementHeight)) { 
                screenGrid[y].splice(0, )
                this.exhaustedRows.push(y)
                continue
            }
            

            // when found, shrinks the problem aswell
            screenGrid[y].splice(xIndex, 1)
            return [y, x]
        }
    }


    getScreenGrid(height, width) {
        let grid = []

        for (let i = 0; i < height; i++) {
            let row = []
            for (let j = 0; j < width; j++) {
                row.push(j)
            }
            grid.push(row)
        }

        return grid // Height * Width
    }


    checkGrid(screenGrid = this.grid) {

        let height = this.height
        let width = this.width

        for (let i = 0 ; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (screenGrid[i].includes(j)) {
                    generatePixel(i, j, "green")
                }
                else {
                    generatePixel(i, j, "red")
                }
            }
        }

        console.log(screenGrid)
    }

    addBordersToGrid(n, screenGrid = this.grid) {

        let height = this.height
        let width = this.width

        for (let i = 0 ; i < height; i++) { // Iterates from top to bottom



            if (i < n) {
                screenGrid[i].splice(0,) // Empty the whole ith row/array without iterating from left to right
                continue
            }

            if (i >= (height - n)) {
                screenGrid[i].splice(0,) // Same as above but for ending n arrays
                continue
            }

            for (let j = 0; j < width; j++) { // Iterates from left to right
                if (!screenGrid[i].includes(j)) {
                    continue
                }
                else if (j < n || j >= (width - n)) {
                    let ind = screenGrid[i].indexOf(j)
                    screenGrid[i].splice(ind, 1)
                }
            }
        }
    }

}


function getScreenCoors() {
  let coors = {
    x: window.innerWidth,
    y: window.innerHeight,
  };
  console.log(coors);
  return coors;
}

function generatePixel(y, x, color) { //generate a pixel on given x y
    let pixel = document.createElement('div')
    pixel.style.position = 'absolute'
    pixel.style.width = '1px'
    pixel.style.height = '1px'
    pixel.style.backgroundColor = color

    pixel.style.top = `${y}px`
    pixel.style.left = `${x}px`
    document.getElementById('grid').append(pixel)
}


// n elements but zero indexed so nth element is (n-1)
function fillupto(arr, n) {
    for (let i = 0; i < n; i++) {
        arr.push(i)
    }
}

// Generate a circular div with center at coordinates, height width in css
function generateDiv(y, x) {
    let div = document.createElement("div")
    div.classList.add("circular")

    div.style.visibility = 'hidden'
    document.getElementById('grid').append(div)

    let pos = div.getBoundingClientRect()
    div.style.left = `${x - (pos.width / 2)}px`
    div.style.top = `${y - (pos.height / 2)}px`

    div.style.visibility = "visible"
}