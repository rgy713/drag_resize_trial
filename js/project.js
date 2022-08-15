console.log("hello world")

var histories = []
var historyStep = 0;
var isResize = 0;

function dragElement(elmnt) {
    let x = 0, y = 0, sx = 0, sy = 0;
    elmnt.querySelector(".rectangle").addEventListener('mousedown', dragMouseDown);

    function dragMouseDown(e) {
        let resizeControls = elmnt.querySelector(".resize_controls");
        if (!resizeControls.classList.contains("active")) return;
        e = e || window.event;
        e.preventDefault();
        if (isResize) return;
        // get the mouse cursor position at startup:
        x = e.clientX;
        y = e.clientY;
        sx = elmnt.getBoundingClientRect().left + "px";
        sy = elmnt.getBoundingClientRect().top + "px";
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    }

    function mouseMoveHandler(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        const dx = x - e.clientX;
        const dy = y - e.clientY;
        x = e.clientX;
        y = e.clientY;
        // set the element's new position:
        elmnt.style.left = `${elmnt.offsetLeft - dx}px`;
        elmnt.style.top = `${elmnt.offsetTop - dy}px`;

        const intersectInfo = checkIntersection(elmnt);
        let rectangle = elmnt.querySelector(".rectangle")
        const sizeInfo = elmnt.querySelector(".size-info");
        let txt = `Size info: w=${rectangle.getBoundingClientRect().width}px,h=${rectangle.getBoundingClientRect().height}px`
        if (intersectInfo) {
            txt += `. Intersection: Rect${intersectInfo}`
        }
        sizeInfo.innerHTML = txt;
    }

    function mouseUpHandler() {
        // stop moving when mouse button is released:
        let history = {
            undo: {
                type: 'position',
                el: elmnt,
                info: {
                    left: sx,
                    top: sy,
                }
            },
            redo: {
                type: 'position',
                el: elmnt,
                info: {
                    left: elmnt.style.left,
                    top: elmnt.style.top,
                }
            }
        }
        histories.push(history)
        historyStep++;
        elmnt.querySelector(".guides").classList.remove("active");
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    }
}

function resizeElement(elmnt) {
    let sx = 0, sy = 0, x = 0, y = 0, w = 0, h = 0, type = 0;
    let st = 0, sl = 0;
    elmnt.querySelector('.control').addEventListener('mousedown', (e) => initMouseDown(e, 0));
    elmnt.querySelector('.control.top_right').addEventListener('mousedown', (e) => initMouseDown(e, 1));
    elmnt.querySelector('.control.right_mid').addEventListener('mousedown', (e) => initMouseDown(e, 2));
    elmnt.querySelector('.control.left_mid').addEventListener('mousedown', (e) => initMouseDown(e, 3));
    elmnt.querySelector('.control.bottom_right').addEventListener('mousedown', (e) => initMouseDown(e, 4));
    elmnt.querySelector('.control.bottom_left').addEventListener('mousedown', (e) => initMouseDown(e, 5));
    elmnt.querySelector('.control.top_mid').addEventListener('mousedown', (e) => initMouseDown(e, 6));
    elmnt.querySelector('.control.bottom_mid').addEventListener('mousedown', (e) => initMouseDown(e, 7));

    function initMouseDown(e, tp) {
        let resizeControls = elmnt.querySelector(".resize_controls");
        if (!resizeControls.classList.contains("active")) return;
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        isResize = 1;
        sx = e.clientX;
        sy = e.clientY;
        x = sx;
        y = sy;
        type = tp
        w = parseInt(document.defaultView.getComputedStyle(elmnt).width, 10);
        h = parseInt(document.defaultView.getComputedStyle(elmnt).height, 10);
        sl = elmnt.parentElement.getBoundingClientRect().left + "px";
        st = elmnt.parentElement.getBoundingClientRect().top + "px";
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    }

    function mouseMoveHandler(e) {
        e = e || window.event;
        e.preventDefault();
        const dx = e.clientX - sx;
        const dy = e.clientY - sy;
        const ddx = e.clientX - x;
        const ddy = e.clientY - y;
        x = e.clientX;
        y = e.clientY;
        // set the element's new position:
        if (type === 0) {
            elmnt.style.width = `${w - dx}px`;
            elmnt.style.height = `${h - dy}px`;
            elmnt.parentElement.style.top = `${elmnt.parentElement.getBoundingClientRect().top + ddy}px`;
            elmnt.parentElement.style.left = `${elmnt.parentElement.getBoundingClientRect().left + ddx}px`;
        } else if (type === 1) {
            elmnt.style.width = `${w + dx}px`;
            elmnt.style.height = `${h - dy}px`;
            elmnt.parentElement.style.top = `${elmnt.parentElement.getBoundingClientRect().top + ddy}px`;
        } else if (type === 2) {
            elmnt.style.width = `${w + dx}px`;
        } else if (type === 3) {
            elmnt.style.width = `${w - dx}px`;
            elmnt.parentElement.style.left = `${elmnt.parentElement.getBoundingClientRect().left + ddx}px`;
        } else if (type === 4) {
            elmnt.style.width = `${w + dx}px`;
            elmnt.style.height = `${h + dy}px`;
        } else if (type === 5) {
            elmnt.style.width = `${w - dx}px`;
            elmnt.style.height = `${h + dy}px`;
            elmnt.parentElement.style.left = `${elmnt.parentElement.getBoundingClientRect().left + ddx}px`;
        } else if (type === 6) {
            elmnt.style.height = `${h - dy}px`;
            elmnt.parentElement.style.top = `${elmnt.parentElement.getBoundingClientRect().top + ddy}px`;
        } else if (type === 7) {
            elmnt.style.height = `${h + dy}px`;
        }

        const intersectInfo = checkIntersection(elmnt.parentElement);
        const sizeInfo = elmnt.parentNode.querySelector(".size-info");
        let txt = `Size info: w=${elmnt.style.width},h=${elmnt.style.height}`
        if (intersectInfo) {
            txt += `. Intersection: Rect${intersectInfo}`
        }
        sizeInfo.innerHTML = txt;
    }

    function mouseUpHandler() {
        isResize = 0;
        let history = {
            undo: {
                type: 'size',
                el: elmnt,
                info: {
                    w: w + "px",
                    h: h + "px",
                    left: sl,
                    top: st,
                }
            },
            redo: {
                type: 'size',
                el: elmnt,
                info: {
                    w: elmnt.style.width,
                    h: elmnt.style.height,
                    left: elmnt.parentElement.style.left,
                    top: elmnt.parentElement.style.top,
                }
            }
        }
        histories.push(history)
        historyStep++;
        elmnt.querySelector(".guides").classList.remove("active");
        // stop moving when mouse button is released:
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    }
}

function checkIntersection(el) {
    let rectSelection = el.querySelector(".rectangle").getBoundingClientRect();
    let idx = 0;
    let interIdx = null;
    [].forEach.call(el.parentNode.children, function (child) {
        idx++;
        if (child != el) {
            let rect = child.querySelector(".rectangle").getBoundingClientRect();
            let flag = 0;
            if (rect.top < rectSelection.top && rect.bottom > rectSelection.top && rect.left < rectSelection.left && rect.right > rectSelection.left) {
                flag = 1;
                el.getElementsByClassName("v_huide")[0].style.left = rectSelection.left + "px";
                el.getElementsByClassName("guide")[0].style.top = rectSelection.top + "px";
            }
            if (rect.top < rectSelection.bottom && rect.bottom > rectSelection.bottom  && rect.left < rectSelection.left && rect.right > rectSelection.left) {
                flag = 1;
                el.getElementsByClassName("v_huide")[0].style.left = rectSelection.left + "px";
                el.getElementsByClassName("guide")[0].style.top = rectSelection.bottom + "px";
            }
            if (rect.top < rectSelection.top && rect.bottom > rectSelection.top && rect.left < rectSelection.right && rect.right > rectSelection.right) {
                flag = 1;
                el.getElementsByClassName("v_huide")[0].style.left = rectSelection.right + "px";
                el.getElementsByClassName("guide")[0].style.top = rectSelection.top + "px";
            }
            if (rect.top < rectSelection.bottom && rect.bottom > rectSelection.bottom  && rect.left < rectSelection.right && rect.right > rectSelection.right) {
                flag = 1;
                el.getElementsByClassName("v_huide")[0].style.left = rectSelection.right + "px";
                el.getElementsByClassName("guide")[0].style.top = rectSelection.bottom + "px";
            }
            if ( flag ) {
                interIdx = idx;
            }
            child.style.zIndex = 10;
        }
        else {
            child.style.zIndex = 1000;
        }
    });
    if (interIdx) {
        el.querySelector(".guides").classList.add("active");
    }
    else {
        el.querySelector(".guides").classList.remove("active");
    }
    return interIdx
}

function addNew() {
    const content = document.querySelector(".content")
    const contentName = `Rect${content.children.length + 1}`;
    let containerUnit = document.createElement('div');
    const innerHtml = `
        <div class="content_info">
            <div class="content-name">My name: ${contentName}</div>
        </div>
        <div class="rectangle">
            <div class="guides">
              <div class="v_huide"></div>
              <div class="guide"></div>
            </div>
            <div class="resize_controls">
              <div class="control"></div>
              <div class="control top_right"></div>
              <div class="control right_mid"></div>
              <div class="control left_mid"></div>
              <div class="control bottom_right"></div>
              <div class="control bottom_left"></div>
              <div class="control top_mid"></div>
              <div class="control bottom_mid"></div>
            </div>
        </div>
        <div class="content_info">
            <div class="size-info">Size info: w=220px,h=220px</div>
        </div>
    `;
    containerUnit.innerHTML = innerHtml.trim();
    containerUnit.classList.add("container_unit");
    containerUnit.classList.add("active");

    let rectangle = containerUnit.querySelector(".rectangle")
    rectangle.style.backgroundColor = `rgb(${parseInt(Math.random() * 255, 10)}, ${parseInt(Math.random() * 255, 10)}, ${parseInt(Math.random() * 255, 10)})`

    rectangle.addEventListener("mouseleave", (event) => {
        let resizeControls = event.target.querySelector(".resize_controls")
        resizeControls.classList.remove("active");
    }, false);

    rectangle.addEventListener("mouseenter", (event) => {
        let resizeControls = event.target.querySelector(".resize_controls");
        resizeControls.classList.add("active");
    }, false);

    resizeElement(rectangle)
    dragElement(containerUnit)

    content.append(containerUnit);
    let history = {
        undo: {
            type: 'add',
            el: containerUnit
        },
        redo: {
            type: 'add',
            el: containerUnit
        }
    }
    histories.push(history);
    historyStep++;
}

function undoAdd(el) {
    el.remove();
}

function redoAdd(el) {
    const content = document.querySelector(".content")
    content.append(el);
}

function undoRedoPosition(el, info) {
    el.style.left = info.left;
    el.style.top = info.top;
}

function undoRedoSize(el, info) {
    el.style.width = info.w;
    el.style.height = info.h;
    el.parentElement.style.left = info.left;
    el.parentElement.style.top = info.top;
    const sizeInfo = el.parentNode.querySelector(".size-info");
    sizeInfo.innerHTML = `Size info: w=${info.w},h=${info.h}`
}

function undo() {
    if (historyStep > 0) {
        const history = histories[historyStep - 1]
        historyStep--;
        if (history.undo.type == 'add') {
            undoAdd(history.undo.el)
        } else if (history.undo.type == 'position') {
            undoRedoPosition(history.undo.el, history.undo.info);
        } else if (history.undo.type == 'size') {
            undoRedoSize(history.undo.el, history.undo.info);
        }
    }
}

function redo() {
    if (histories.length > 0 && (historyStep < histories.length)) {
        historyStep++;
        const history = histories[historyStep - 1]
        if (history.redo.type == 'add') {
            redoAdd(history.redo.el)
        } else if (history.redo.type == 'position') {
            undoRedoPosition(history.redo.el, history.redo.info);
        } else if (history.redo.type == 'size') {
            undoRedoSize(history.redo.el, history.redo.info);
        }
    }
}

window.onload = function () {
    const addBtn = document.getElementById("add");
    addBtn.addEventListener("click", (event) => {
        addNew();
        if (histories.length === 1) {
            const undoBtn = document.getElementById("undo");
            undoBtn.classList.add("active");
            undoBtn.addEventListener("click", (event) => {
                undo()
            });
            const redoBtn = document.getElementById("redo");
            redoBtn.classList.add("active");
            redoBtn.addEventListener("click", (event) => {
                redo()
            });
        }
    });
}
