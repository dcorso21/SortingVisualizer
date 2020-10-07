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
    // let [sortedArr, aniFrames] = bubbleSort(arrVals),
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

function getNodeValues(nodeList) {
    let vals = [];
    nodeList.map((node) => {
        vals.push(node.innerHTML);
    });
    return vals;
}

function getRelativeX(targetElement, movingElement) {
    // console.log("see", currentNodeArr, targetElement, movingElement);
    return (
        movingElement.getBoundingClientRect().x -
        targetElement.getBoundingClientRect().x
    );
}

// Scan list of numbers
// Switch Numbers
// Scan again

function updateArr(arr, newValues) {
    arr = removeAllChildNodes(arr);
    newValues.unshift(brackets[0]);
    newValues.push(brackets[1]);
    newValues.map((el) => {
        el.style.transform = "none";
        arr.appendChild(el);
    });
}
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

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
    return parent;
}

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

function constructNewArr(indexes, arrNodes) {
    let newArr = [];
    indexes.map((ind) => {
        newArr.push(arrNodes[ind]);
    });
    return newArr;
}

function swapPositions([posA, posB]) {
    let b = currentNodeArr[posB];
    currentNodeArr[posB] = currentNodeArr[posA];
    currentNodeArr[posA] = b;
}
