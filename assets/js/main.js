let tl,
    arrDiv = document.getElementsByClassName("arr")[0],
    brackets = document.querySelectorAll(".bracket"),
    currentNodeArr,
    xd,
    dragVal,
    dragapprove = true,
    focusOn = "arr";

window.onload = () => {
    UI.enableDragNumbers();
    // renderBars(7);

    // scan();
};

function scan() {
    dragapprove = false;
    tl = anime.timeline();
    currentNodeArr = getCurrentArrOrdered();
    console.log(currentNodeArr);
    xd = getRelativeX(currentNodeArr[0], currentNodeArr[1]);
    arrVals = getNodeValues(currentNodeArr);
    console.log(arrVals);
    // let [sortedArr, aniFrames] = SortingAlgos.bubbleSort(arrVals),
    let [sortedArr, aniFrames] = SortingAlgos.selectionSort(arrVals),
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
    console.log(focusOn);
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
    let val = focusOn === "bars" ? "bar" : "num";
    return [...document.getElementsByClassName(val)];
}

function makeBars() {
    nums = pullElements()
    nums.map((v, i) => {
        let h = 50
        console.log(h);
        h = Number(v.innerHTML) * h
        console.log(h);
        v.style.height = `${h}px`;
        v.style.borderRadius = "20px";
        v.style.lineHeight = v.style.height;
    })
}

function populateArrayDiv(numOfBars) {
    let arrFill = [];
    // let bracket1 = document.createElement("div");
    // bracket1.className = "bracket";
    // bracket1.innerHTML = "[";
    // arrFill.push(bracket1)
    // let bracket2 = document.createElement("div");
    // bracket2.className = "bracket";
    // bracket2.innerHTML = "]";
    // arrFill.push(bracket2)
    let values = [...Array(numOfBars).keys()];
    values.map((v, i) => {
        let bar = document.createElement("div");
        bar.className = "num";
        bar.innerHTML = v + 1;
        arrFill.push(bar)
    })
    currentNodeArr = arrFill;
    refreshArrDiv()
    
}

populateArrayDiv(10)
makeBars();