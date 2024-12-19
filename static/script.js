const latticeGrid = document.getElementById('latticeGrid');
let startCell = null;
let dstCell = null;
let clickCount = 0;
let grid = [];
let isCancelled = false;
const dstColor = 'rgb(255, 0, 0)';
const startColor = 'rgb(255, 250, 240)';
const pathColor = 'path';
const defColor = 'cell-color';
const visitedColor = 'visited';
const neighborColor = 'neighbor';
const barrierColor = 'rgb(128, 128, 128)';
let isMouseDown = false;


async function aStar() {
    let startPos = getCellPos(startCell);
    let dstPos = getCellPos(dstCell);
    let commonWeight = 1;

    let neighbors = [{ pos: startPos, weight: 0 }];

    let calculatedWeights = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(Number.MAX_VALUE));
    let parent = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(null));

    calculatedWeights[startPos[0]][startPos[1]] = 0;

    while (neighbors.length && !isCancelled) {
        await delay(1);

        neighbors.sort((a, b) => a.weight - b.weight);
        let currentNode = neighbors.shift();
        let e = currentNode.pos;

        // Termination
        if (e[0] === dstPos[0] && e[1] === dstPos[1]) {
            grid[e[0]][e[1]][1] = false;
            let p = parent[e[0]][e[1]];
            while (p != startPos) {
                grid[p[0]][p[1]][0].classList.remove(visitedColor);
                grid[p[0]][p[1]][0].classList.add(pathColor);
                p = parent[p[0]][p[1]];
            }
            grid[p[0]][p[1]][1] = false;
            break;
        }

        if (grid[e[0]][e[1]][0] != startCell) {
            markCell(e, true, visitedColor, [neighborColor]);
        }

        function exploreNeighbor(neighborX, neighborY) {
            if (
                neighborX >= 0 && neighborX < grid.length &&
                neighborY >= 0 && neighborY < grid[0].length &&
                calculatedWeights[e[0]][e[1]] + commonWeight < calculatedWeights[neighborX][neighborY] &&
                grid[neighborX][neighborY][1] == false
            ) {
                neighbors.push({ pos: [neighborX, neighborY], weight: calculatedWeights[e[0]][e[1]] + commonWeight + distance([neighborX, neighborY]) });
                calculatedWeights[neighborX][neighborY] = calculatedWeights[e[0]][e[1]] + commonWeight;
                parent[neighborX][neighborY] = e;
                if (grid[neighborX][neighborY][0] != dstCell) {
                    markCell([neighborX, neighborY], true, neighborColor, [defColor])
                }
            }
        }
        function distance(currPos) {
            return Math.sqrt((dstPos[0] - currPos[0])**2 + (dstPos[1] - currPos[1])**2);
        }
        exploreNeighbor(e[0] - 1, e[1]); // left
        exploreNeighbor(e[0] + 1, e[1]); // right
        exploreNeighbor(e[0], e[1] - 1); // up
        exploreNeighbor(e[0], e[1] + 1); // down

    }
    pathFound = true;
}

async function dijkstra() {
    let startPos = getCellPos(startCell);
    let dstPos = getCellPos(dstCell);
    let commonWeight = 1;

    let neighbors = [{ pos: startPos, weight: 0 }];

    let calculatedWeights = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(Number.MAX_VALUE));
    let parent = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(null));

    calculatedWeights[startPos[0]][startPos[1]] = 0;

    while (neighbors.length && !isCancelled) {
        await delay(1);

        neighbors.sort((a, b) => a.weight - b.weight);
        let currentNode = neighbors.shift();
        let e = currentNode.pos;

        // Termination
        if (e[0] === dstPos[0] && e[1] === dstPos[1]) {
            grid[e[0]][e[1]][1] = false;
            let p = parent[e[0]][e[1]];
            while (p != startPos) {
                grid[p[0]][p[1]][0].classList.remove(visitedColor);
                grid[p[0]][p[1]][0].classList.add(pathColor);
                p = parent[p[0]][p[1]];
            }
            grid[p[0]][p[1]][1] = false;
            break;
        }

        if (grid[e[0]][e[1]][0] != startCell) {
            markCell(e, true, visitedColor, [neighborColor]);
        }

        function exploreNeighbor(neighborX, neighborY) {
            if (
                neighborX >= 0 && neighborX < grid.length &&
                neighborY >= 0 && neighborY < grid[0].length &&
                calculatedWeights[e[0]][e[1]] + commonWeight < calculatedWeights[neighborX][neighborY] &&
                grid[neighborX][neighborY][1] == false
            ) {
                neighbors.push({ pos: [neighborX, neighborY], weight: calculatedWeights[e[0]][e[1]] + commonWeight });
                calculatedWeights[neighborX][neighborY] = calculatedWeights[e[0]][e[1]] + commonWeight;
                parent[neighborX][neighborY] = e;
                if (grid[neighborX][neighborY][0] != dstCell) {
                    markCell([neighborX, neighborY], true, neighborColor, [defColor])
                }
            }
        }
        exploreNeighbor(e[0] - 1, e[1]); // left
        exploreNeighbor(e[0] + 1, e[1]); // right
        exploreNeighbor(e[0], e[1] - 1); // up
        exploreNeighbor(e[0], e[1] + 1); // down

    }
    pathFound = true;
}

async function bfs() {
    let queue = [];
    let startPos = getCellPos(startCell);
    queue.push(startPos);
    grid[startPos[0]][startPos[1]][1] = true;
    let parent = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(null));
    while (!isCancelled && queue.length > 0) {
        await delay(1);

        let e = queue.shift();

        // termination
        if (grid[e[0]][e[1]][0] == dstCell) {
            grid[e[0]][e[1]][1] = false;
            let p = parent[e[0]][e[1]];
            while (p != startPos) {
                grid[p[0]][p[1]][0].classList.remove(visitedColor);
                grid[p[0]][p[1]][0].classList.add(pathColor);
                p = parent[p[0]][p[1]];
            }
            grid[p[0]][p[1]][1] = false;
            break;
        }

        if (grid[e[0]][e[1]][0] != startCell) {
            markCell(e, true, visitedColor, [neighborColor]);
        }


        function exploreNeighbor(neighborX, neighborY) {
            if (
                neighborX >= 0 && neighborX < grid.length &&
                neighborY >= 0 && neighborY < grid[0].length &&
                grid[neighborX][neighborY][1] == false
            ) {
                queue.push([neighborX, neighborY]);
                parent[neighborX][neighborY] = e;

                if (grid[neighborX][neighborY][0] != dstCell) {
                    markCell([neighborX, neighborY], true, neighborColor, [defColor]);
                } else {
                    grid[neighborX][neighborY][1] = true;
                }
            }
        }

        exploreNeighbor(e[0] - 1, e[1]); // left
        exploreNeighbor(e[0] + 1, e[1]); // right
        exploreNeighbor(e[0], e[1] - 1); // up
        exploreNeighbor(e[0], e[1] + 1); // down

    }
    pathFound = true;
}

async function dfs() {
    let startPos = getCellPos(startCell);
    let dstPos = getCellPos(dstCell);
    let stack = [];
    stack.push(startPos);
    grid[startPos[0]][startPos[1]][1] = true;
    let parent = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(null));

    while (!isCancelled && stack.length > 0) {
        await delay(1);

        let e = stack.pop();

        // termination
        if (grid[e[0]][e[1]][0] == dstCell) {
            grid[e[0]][e[1]][1] = false;
            let p = parent[e[0]][e[1]];
            while (p != startPos) {
                grid[p[0]][p[1]][0].classList.remove(visitedColor);
                grid[p[0]][p[1]][0].classList.add(pathColor)
                p = parent[p[0]][p[1]];
            }
            grid[p[0]][p[1]][1] = false;
            break;
        }

        if (grid[e[0]][e[1]][0] != startCell) {
            markCell(e, true, visitedColor, [neighborColor]);
        }


        function exploreNeighbor(neighborX, neighborY) {
            if (
                neighborX >= 0 && neighborX < grid.length &&
                neighborY >= 0 && neighborY < grid[0].length &&
                grid[neighborX][neighborY][1] == false
            ) {
                stack.push([neighborX, neighborY]);
                parent[neighborX][neighborY] = e;
                if (grid[neighborX][neighborY][0] != dstCell) {
                    markCell([neighborX, neighborY], true, neighborColor, [defColor])
                } else {
                    grid[neighborX][neighborY][1] = true;
                }
            }
        }


        exploreNeighbor(e[0] - 1, e[1]); // Left
        exploreNeighbor(e[0], e[1] + 1); // Down
        exploreNeighbor(e[0] + 1, e[1]); // Right
        exploreNeighbor(e[0], e[1] - 1); // Up
    }
    pathFound = true;
}

function markCell(currPos, flag, color, remColors) {
    let cell = grid[currPos[0]][currPos[1]][0];
    for (let remCol of remColors) {
        if (cell.classList.contains(remCol)) {
            cell.classList.remove(remCol);
        }
    }
    if (window.getComputedStyle(cell).backgroundColor != barrierColor) {
        cell.classList.add(color);
        grid[currPos[0]][currPos[1]][1] = flag;
    }

}

function selectAlgorithm(algorithm) {
    console.log('Selected algorithm: ', algorithm);
    document.getElementById('algorithmMenu').innerText = algorithm;
}

async function selectGridSize(size) {
    console.log('Selected grid size: ', size);
    isCancelled = !isCancelled
    await delay(100);
    document.getElementById('sizeMenu').innerText = size;
    grid = [];
    drawGrid(size);
    clickCount = 0;
    isCancelled = false;
}

async function clearGrid() {
    isCancelled = !isCancelled;
    await delay(100);
    if (clickCount == 3) {
        clickCount--;

        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[0].length; j++) {
                let pos = [i, j];
                if (
                    grid[i][j][0].classList.contains(neighborColor) ||
                    grid[i][j][0].classList.contains(visitedColor) ||
                    grid[i][j][0].classList.contains([pathColor])
                ) {
                    markCell(pos, false, defColor, [visitedColor, pathColor, neighborColor]);
                }
            }
        }
        isCancelled = false;
    } else if (clickCount != 0) {
        let text = document.getElementById('guide');
        text.innerHTML = 'Choose the beginning';
        grid = [];
        drawGrid(document.getElementById('sizeMenu').innerHTML);
        clickCount = 0;
        startCell = null;
        dstCell = null;
        isCancelled = false;
    }
}

function drawGrid(size) {
    latticeGrid.innerHTML = '';
    let hor = 50;
    let ver = 20;
    let option = document.getElementById('sizeMenu').innerHTML;
    if (option === '30 X 75') {
        hor = 75;
        ver = 30;
    } else if (option === '40 X 100') {
        hor = 100;
        ver = 40;
    } else if (option === '10 X 25') {
        hor = 25;
        ver = 10;
    } else if (option === '50 X 125') {
        hor = 125;
        ver = 50;
    } else if (option === '60 X 150') {
        hor = 150;
        ver = 60;
    }

    let gap = 0.2 * 50 / hor;
    let pixelSize = `calc((100vw - 15vw - ${hor - 1} * ${gap}vw) / ${hor})`;
    let radius = `calc((100vw - 15vw - ${hor - 1} * ${gap}vw) / ${hor} / 3)`;

    latticeGrid.style.gridTemplateColumns = `repeat(${hor}, ${pixelSize})`;
    latticeGrid.style.gridTemplateRows = `repeat(${ver}, ${pixelSize})`;
    latticeGrid.style.gap = `${gap}vw`;

    for (let i = 0; i < ver; i++) {
        grid[i] = [];
        for (let j = 0; j < hor; j++) {
            const cell = document.createElement('div');
            cell.classList.add(defColor);
            cell.id = 'X' + j + ' Y' + i;
            grid[i][j] = [cell, false];
            cell.style.width = `${pixelSize}`;
            cell.style.height = `${pixelSize}`;
            cell.style.borderRadius = `${radius}`;

            cell.addEventListener('click', function () {
                if (clickCount < 2) {
                    clickCount++;

                    if (clickCount === 1) {
                        cell.style.backgroundColor = `${startColor}`;
                        startCell = cell;
                        let text = document.getElementById('guide');
                        text.innerHTML = 'Choose the destination';
                    } else if (clickCount === 2) {
                        if (cell != startCell) {
                            cell.style.backgroundColor = `${dstColor}`;
                            dstCell = cell;
                            let text = document.getElementById('guide');
                            text.innerHTML = 'Now you can add barriers';
                        } else {
                            clickCount--;
                        }

                    }
                }
            });

            cell.addEventListener('mousedown', () => {
                isMouseDown = true;

                if (clickCount == 2 && grid[j][i][0] != startCell && grid[j][i][0] != dstCell) {
                    grid[j][i][0].style.backgroundColor = `${barrierColor}`;
                    grid[j][i][1] = true;

                }
            });

            cell.addEventListener('mouseover', () => {
                if (isMouseDown) {
                    if (clickCount == 2 && grid[j][i][0] != startCell && grid[j][i][0] != dstCell) {
                        grid[j][i][0].style.backgroundColor = `${barrierColor}`;
                        grid[j][i][1] = true;
                    }
                }
            });

            latticeGrid.appendChild(cell);

        }
    }

    function transpose() {
        const rows = grid.length;
        const cols = grid[0].length;
        const transposed = [];

        for (let j = 0; j < cols; j++) {
            transposed[j] = [];
            for (let i = 0; i < rows; i++) {
                transposed[j][i] = grid[i][j];
            }
        }

        return transposed;
    }

    grid = transpose();

    document.addEventListener('mouseup', () => {
        isMouseDown = false;
    });


}
drawGrid(document.getElementById('sizeMenu').innerHTML);



function getCellPos(cell) {
    let parts = cell.id.split(" ");
    let x = parseInt(parts[0].slice(1));
    let y = parseInt(parts[1].slice(1));
    return [x, y];
}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function find() {
    if (dstCell != null && clickCount == 2) {
        clickCount++;
        let option = document.getElementById('algorithmMenu').innerHTML;

        if (option == 'DFS') {
            await dfs();

        } else if (option == 'BFS') {
            await bfs();

        } else if (option == 'DIJKSTRA') {
            await dijkstra();

        } else {
            await aStar();
        }
    }
}
