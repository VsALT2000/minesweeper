import React, {useState} from 'react';
import styles from "./App.less";
import cn from "classnames";

const width = 14;
const height = 18;
const countMines = 40;

type tile = {
    x: number,
    y: number,
    flag: boolean,
    opened: boolean,
    mine: boolean,
    countMineAround: number
}

const addMinesOnMap = (arr: tile[][], x: number, y: number) => {
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

    const flat = arr.flat();
    const index = x * height + y;
    flat.splice(index, 1);

    while (width * height - flat.length - 1 !== countMines) {
        const index = Math.floor(Math.random() * flat.length);
        const element = flat[index];
        addMine(element.x, element.y);
        flat.splice(index, 1);
    }
}

const getMap = () => {
    const arr: tile[][] = [];

    for (let x = 0; x < width; x++) {
        arr[x] = [];
        for (let y = 0; y < height; y++) {
            arr[x][y] = {x: x, y: y, flag: false, opened: false, mine: false, countMineAround: 0}
        }
    }

    return arr;
}

function bfs(map: any, x: number, y: number) {
    const queue = []
    if (!map[x][y].flag) {
        queue.push(map[x][y])
        map[x][y].opened = true
    }
    while (queue.length > 0) {
        const v = queue.shift()
        if (v.countMineAround === 0)
            for (let dx = Math.max(v.x - 1, 0); dx < Math.min(v.x + 2, width); dx++) {
                for (let dy = Math.max(v.y - 1, 0); dy < Math.min(v.y + 2, height); dy++) {
                    if (!map[dx][dy].opened && !map[dx][dy].flag) {
                        map[dx][dy].opened = true
                        if (map[dx][dy].countMineAround === 0) {
                            queue.push(map[dx][dy]);
                        }
                    }
                }
            }
    }
    return map
}

function App() {
    const [map, setMap] = useState<tile[][]>([]);
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
        <div className={styles.App}>
            {
                map.map(line =>
                    <div className={styles.LineMinesweeper}>
                        {
                            line.map(el => <div className={cn(styles.TileMinesweeper, {
                                [styles.Flag]: el.flag,
                                [styles.Mine]: el.mine && el.opened,
                                [styles.Opened]: !el.mine && el.opened
                            })}
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
    );
}

export default App;
