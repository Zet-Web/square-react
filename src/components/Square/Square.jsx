import React, { useEffect, useState } from "react";

import "./Square.css";

export default function Square() {
  const squareSize = 16;
  const [size, setSize] = useState(1);
  const [startCoord, setStartCoord] = useState([3, 3]);
  // Hovered cell coordinates
  const [current, setCurrent] = useState(null);
  const [isOnDrag, setIsOnDrag] = useState(false);
  const [Resize, setResize] = useState(false);

  // cancel events
  const cancelAction = () => {
    setIsOnDrag(false);
    setResize(false);
  };
  // start drag or resize
  useEffect(() => {
    if (!isOnDrag && Resize !== false) {
      handleResize(Resize, current);
    }
    if (isOnDrag) {
      handleDrag(current);
    }
  }, [current]);

  // drag square
  const handleDrag = coord => {
    const [row, column] = coord;
    if (row <= squareSize - size && column <= squareSize - size) {
      setStartCoord(coord);
    }
  };
  // resize square
  const handleResize = (startCell, newCell) => {
    if (newCell[0] === startCoord[0] - 1 && newCell[1] === startCoord[1] - 1) {
      console.log("up + left");
      setStartCoord(newCell);
      setSize(size + 1);
    }

    if (size >= 2 && isBlock(newCell)) {
      if (
        newCell[0] === startCoord[0] + 1 &&
        newCell[1] === startCoord[1] + 1
      ) {
        console.log("down + right dec");
        setStartCoord(newCell);
        setSize(size - 1);
      }
    }
  };
  // detect cells that belongs to the square
  const isBlock = coord => {
    return (
      coord[0] <= startCoord[0] + size - 1 &&
      coord[0] >= startCoord[0] &&
      coord[1] <= startCoord[1] + size - 1 &&
      coord[1] >= startCoord[1]
    );
  };
  // detect angle cells of square
  const isResizableCell = coord => {
    const [row, column] = coord;
    return row === startCoord[0] && column === startCoord[1];
  };
  // generate table and its square
  const getLayout = size => {
    let items = [];
    for (let row = 0; row < size; row++) {
      for (let column = 0; column < size; column++) {
        let cell = (
          <div
            key={`${row}.${column}`}
            onMouseEnter={() => setCurrent([row, column])}
            className={`square__subsquare`}
          />
        );

        let block = (
          <div
            key={`${row}.${column}`}
            onMouseUp={() => cancelAction()}
            className={"square__subsquare square__block"}
          >
            {isResizableCell([row, column]) && (
              <div
                onMouseEnter={() => setCurrent([row, column])}
                onMouseDown={() =>
                  isResizableCell([row, column])
                    ? setResize([row, column])
                    : null
                }
                className="block__resize"
              />
            )}
            <div
              onMouseEnter={() => setCurrent([row, column])}
              onMouseDown={() => setIsOnDrag(true)}
              className="block__drag"
            />
          </div>
        );
        items.push(isBlock([row, column]) ? block : cell);
      }
    }
    return items;
  };

  return (
    <div
      className="square__wrapper"
      style={{ gridTemplateColumns: "repeat(" + squareSize + ", 1fr)" }}
      onMouseUp={() => cancelAction()}
      onMouseLeave={() => cancelAction()}
    >
      {getLayout(squareSize)}
    </div>
  );
}
