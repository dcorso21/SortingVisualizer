let tl,
    nums = [...document.getElementsByClassName("num")],
    arrDiv = document.getElementsByClassName("arr")[0],
    brackets = document.querySelectorAll(".bracket"),
    currentNodeArr,
    xd,
    dragVal,
    dragapprove = true;

window.onload = () => {
    UI.enableDragNumbers();
    // scan();
};

function scan() {
    dragapprove = false;
    tl = anime.timeline();
    currentNodeArr = getCurrentArrOrdered();
    xd = getRelativeX(currentNodeArr[0], currentNodeArr[1]);
    arrVals = getNodeValues(currentNodeArr);
    // let [sortedArr, aniFrames] = SortingAlgos.bubbleSort(arrVals),
    let [sortedArr, aniFrames] = SortingAlgos.quickSort(arrVals),
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
 * @param {[Number]} HTMLvals
 */
function arrFromInnerHTML(nodeList, HTMLvals) {
    let newArr = [];
    let throwaway = nodeList.slice();
    HTMLvals.map((v) => {
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
        vals.push(Number(node.innerHTML));
    });
    return vals;
}

/**
 * Get relative positioning between two html elements in pixels
 * @param {node} targetElement element with coordinates to go to
 * @param {node} movingElement elements with coordinates to go from
 */
function getRelativeX(targetElement, movingElement) {
    // console.log("see", currentNodeArr, targetElement, movingElement);
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
    // console.log("vals", values);
    values.unshift(brackets[0]);
    values.push(brackets[1]);
    values.map((el) => {
        el.style.transform = "translateX(0px)";
        arrDiv.appendChild(el);
    });
    // console.log(arrDiv);
}

/**
 * Returns the current html values in the array.
 */
function getCurrentArrOrdered() {
    let nodes = document.getElementsByClassName("arr")[0].childNodes,
        // nums = document.getElementsByClassName("num");
        ordered = [];
    [...nodes].map((n) => {
        if (nums.includes(n)) {
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