import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';

const width = 8;
const height = 10;
const countMines = 10;

type tale = {
    x: number,
    y: number,
    flag: boolean,
    opened: boolean,
    mine: boolean,
    countMineAround: number
}

const addMinesOnMap = (arr: tale[][], x: number, y: number) => {
    const addMine = (x: number, y: number) => {
        arr[x][y].mine = true;
        arr[x][y].countMineAround = -1;

        for (let dx = Math.max(x - 1, 0); dx < Math.min(x + 2, width); dx++) {
            for (let dy = Math.max(y - 1, 0); dy < Math.min(y + 2, height); dy++) {
                if (!arr[dx][dy].mine)
                    arr[dx][dy].countMineAround++;
            }
        }
    }

    const temp = arr.flat();
    console.log(temp)
    console.log(x)
    console.log(y)
    const index = x * height + y; //temp.findIndex(element => element.x === x && element.y === y)
    temp.splice(index, 1);
    console.log(index)
    console.log(temp)

    while (width * height - temp.length - 1 !== countMines) {
        const index = Math.floor(Math.random() * temp.length);
        const element = temp[index];
        console.log(temp[index])
        addMine(element.x, element.y);
        temp.splice(index, 1);
    }
}

const getMap = () => {
    const arr: tale[][] = [];

    for (let x = 0; x < width; x++) {
        arr[x] = [];
        for (let y = 0; y < height; y++) {
            arr[x][y] = {x: x, y: y, flag: false, opened: false, mine: false, countMineAround: 0}
        }
    }

    return arr;
}

function bfs(map: any, x: number, y: number) {
    // adj - смежный список
    // map - начальная вершина
    // t - пункт назначения
    // инициализируем очередь
    let queue = []
    // добавляем map в очередь
    if (!map[x][y].flag) {
        queue.push(map[x][y])
        map[x][y].opened = true
    }
    while (queue.length > 0) {
        // удаляем первый (верхний) элемент из очереди
        let v = queue.shift()
        // abj[v] - соседи v
        if (v.countMineAround === 0)
            for (let dx = Math.max(v.x - 1, 0); dx < Math.min(v.x + 2, width); dx++) {
                for (let dy = Math.max(v.y - 1, 0); dy < Math.min(v.y + 2, height); dy++) {
                    if (!map[dx][dy].opened && !map[dx][dy].flag) {
                        // добавляем его в очередь
                        // помечаем вершину как посещенную
                        // если сосед является пунктом назначения, мы победили
                        map[dx][dy].opened = true
                        if (map[dx][dy].countMineAround === 0) {
                            queue.push(map[dx][dy]);
                        }
                    }
                }
            }
    }
    return map
    // если t не обнаружено, значит пункта назначения достичь невозможно
}

function App() {
    const [map, setMap] = useState<tale[][]>([]);
    const [firstStep, setFirstStep] = useState(true);

    if (!map.length)
        setMap(getMap());

    const onClick = (e: React.SyntheticEvent, x: number, y: number) => {
        e.preventDefault();
        if (e.type === "click") {
            if (firstStep) {
                addMinesOnMap(map, x, y);
                setFirstStep(false);
            }
            setMap(bfs(map, x, y).slice());
        }
        if (e.type === "contextmenu") {
            map[x][y].flag = !map[x][y].flag;
            setMap(map.slice());
        }
    }

    return (
        <div className="App">
            <div>
                {
                    map.map(line =>
                        <div className={"LineMinesweeper"}>
                            {
                                line.map(el => <div className={"TileMinesweeper " + (
                                    el.flag ? "TileMinesweeper--flag"
                                        : el.opened
                                            ? el.mine ? "TileMinesweeper--mine" : "TileMinesweeper--opened"
                                            : "TileMinesweeper--closed")}
                                                    onClick={(e) => onClick(e, el.x, el.y)}
                                                    onContextMenu={(e) => onClick(e, el.x, el.y)}
                                >
                                    {
                                        el.opened && (el.mine ? "MINE" : el.countMineAround > 0 && el.countMineAround)
                                    }
                                </div>)
                            }
                        </div>
                    )
                }
            </div>
        </div>
    );
}

export default App;
