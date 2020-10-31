let tl,
    arrDiv = document.getElementsByClassName("arr")[0],
    brackets = document.querySelectorAll(".bracket"),
    currentNodeArr,
    xd,
    dragVal,
    dragapprove = true,
    barShow = true,
    numShow = true,
    focusOn = "arr",
    algo = "Bubble Sort",
    algoFunc = SortingAlgos.bubbleSort,
    explanationId = "bubble-explain";

window.onload = () => {
    populateArrayDiv(5);
    makeBars();
    UI.enableDragNumbers();
    UI.enableButtons();
    UI.enableAddSubBars();
    UI.enableChooseAlgo();
};

function scan() {
    dragapprove = false;
    tl = anime.timeline();
    currentNodeArr = getCurrentArrOrdered();
    xd = getRelativeX(currentNodeArr[0], currentNodeArr[1]);
    arrVals = getNodeValues(currentNodeArr);
    // let [sortedArr, aniFrames] = SortingAlgos.bubbleSort(arrVals),
    let [sortedArr, aniFrames] = algoFunc(arrVals),
        primaryValues = currentNodeArr.slice();
    aniFrames.map((frame) => {
        actions = {
            compare: SortingAnimations.animateCompare,
            swap: SortingAnimations.animateSwap,
            solved: SortingAnimations.animateSolved,
            partition: SortingAnimations.animatePartition,
        };
        currentNodeArr = actions[frame.action](frame);
    });
    currentNodeArr = primaryValues.slice();
}

/**
 * Takes a list of nodes and a list of values of the nodes
 * returns arr of nodes based on given vals
 * @param {[any]} nodeList
 * @param {[Number]} values
 */
function arrFromPulledValues(nodeList, values) {
    let newArr = [],
        throwaway = nodeList.slice();
    values.map((v) => {
        let add = false;
        for (let i = 0; i < throwaway.length; i++) {
            if (focusOn === "bars" && pullHeight(throwaway[i]) == v) {
                add = true;
            } else if (Number(throwaway[i].innerHTML) == v) {
                add = true;
            }
            if (add) {
                newArr.push(throwaway[i]);
                throwaway.splice(i, 1);
                break;
            }
        }
    });
    values.map((v) => {
        for (let i = 0; i < throwaway.length; i++) {
            if (Number(throwaway[i].innerHTML) == v) {
                newArr.push(throwaway[i]);
                throwaway.splice(i, 1);
                break;
            }
        }
    });
    return newArr;
}

/**
 * Takes a node list and returns arr of HTMLinner content
 * @param {[any]} nodeList
 */
function getNodeValues(nodeList) {
    let vals = [];
    nodeList.map((node) => {
        if (focusOn === "bars") {
            vals.push(pullHeight(node));
        } else {
            vals.push(Number(node.innerHTML));
        }
    });
    return vals;
}

function pullHeight(node) {
    let h = node.style.height;
    h = h.slice(0, h.length - 3);
    return Number(h);
}

/**
 * Get relative positioning between two html elements in pixels
 * @param {node} targetElement element with coordinates to go to
 * @param {node} movingElement elements with coordinates to go from
 */
function getRelativeX(targetElement, movingElement) {
    return (
        movingElement.getBoundingClientRect().x -
        targetElement.getBoundingClientRect().x
    );
}

/**
 * takes the CurrentNodeArr and updates the html element holding the numbers
 */
function refreshArrDiv() {
    arrDiv = removeAllChildNodes(arrDiv);
    let values = currentNodeArr.slice();
    values.unshift(brackets[0]);
    values.push(brackets[1]);
    values.map((el) => {
        el.style.transform = "translateX(0px)";
        arrDiv.appendChild(el);
    });
}

/**
 * Returns the current html values in the array.
 */
function getCurrentArrOrdered() {
    let nodes = pullElements();
    (ordered = []), (elements = pullElements());
    [...nodes].map((n) => {
        if (elements.includes(n)) {
            ordered.push(n);
        }
    });
    return ordered;
}

/**
 * General function to remove all child nodes from an element
 * @param {htmlElement} parent HTML element with children to remove
 */
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    return parent;
}

function shuffle(arr) {
    // Fisher Yates Shuffle Found here:
    // https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * i);
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

function pullElements() {
    let elements = [...document.getElementsByClassName("num")];
    return elements;
}

function makeBars() {
    nums = pullElements();
    nums.map((v, i) => {
        anime({
            targets: v,
            keyframes: [
                {
                    height: 50 * Number(v.innerHTML),
                    lineHeight: 50 * Number(v.innerHTML),
                    scale: 1.1,
                    borderRadius: "10px",
                },
                { scale: 1, duration: 400, borderRadius: "20px" },
                // {transformY:0},
            ],
            easing: "easeInOutBack",
            duration: 700,
            delay: 30 * i,
            complete: () => {
                h = Number(v.innerHTML) * 50;
                v.style.height = `${h}px`;
                v.style.borderRadius = "20px";
                v.style.lineHeight = v.style.height;
            },
        });
    });
}

function addOrSubBars(addOrSub) {
    let newCount = pullElements().length;
    if (addOrSub === "add") {
        newCount++;
    } else newCount--;
    populateArrayDiv(newCount);
    makeBars();
    UI.enableDragNumbers();
}

function populateArrayDiv(numOfBars) {
    let arrFill = [];
    let values = [...Array(numOfBars).keys()];
    values.map((v, i) => {
        let bar = document.createElement("div");
        bar.className = "num";
        bar.style.height = "50px";
        bar.draggable = "true";
        bar.innerHTML = v + 1;
        arrFill.push(bar);
    });
    currentNodeArr = arrFill;
    refreshArrDiv();
}

function setAlgoInfo() {
    switch (algo) {
        case "Bubble Sort":
            algoFunc = SortingAlgos.bubbleSort;
            explanationId = "bubble-explain";
            break;
        case "Selection Sort":
            algoFunc = SortingAlgos.selectionSort;
            explanationId = "selection-explain";
            break;
        case "Insertion Sort":
            algoFunc = SortingAlgos.insertionSort;
            explanationId = "insertion-explain";
            break;
        case "Quick Sort":
            algoFunc = SortingAlgos.quickSort;
            explanationId = "quick-explain";
            break;
        case "Merge Sort":
            algoFunc = SortingAlgos.mergeSort;
            explanationId = "merge-explain";
            break;
    }
}
