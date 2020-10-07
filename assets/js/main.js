let tl,
    nums = [...document.getElementsByClassName("num")],
    arrDiv = document.getElementsByClassName("arr")[0],
    brackets = document.querySelectorAll(".bracket"),
    currentNodeArr,
    xd,
    dragVal,
    dragapprove = true;

window.onload = () => {
    enableDragNumbers();
    // scan();
    // firstScan();
    // moveE1(num4, num2);
    // moveE2(num4, num2);
    // endScan();
};

function scan() {
    dragapprove = false;
    tl = anime.timeline();
    currentNodeArr = getCurrentArrOrdered();
    xd = getRelativeX(currentNodeArr[0], currentNodeArr[1]);
    arrVals = getNodeValues(currentNodeArr);
    // let [sortedArr, aniFrames] = bubbleSort(arrVals),
    let [sortedArr, aniFrames] = selectionSort(arrVals),
        primaryValues = currentNodeArr.slice();
    aniFrames.map((frame) => {
        actions = {
            compare: animateCompare,
            swap: animateSwap,
            solved: animateSolved,
            partition: animatePartition,
        };
        currentNodeArr = actions[frame.action](frame);
    });
    currentNodeArr = primaryValues.slice();
}

function animateCompare(frame) {
    let save = arrFromInnerHTML(currentNodeArr, frame.values);
    // console.log(frame.elements);
    // let save = [currentNodeArr[frame.elements[0]], currentNodeArr[frame.elements[1]]]
    tl.add({
        targets: currentNodeArr,
        keyframes: [{ backgroundColor: "#fff" }],
        duration: 400,
        easing: "linear",
    });
    tl.add({
        targets: save,
        keyframes: [{ backgroundColor: "#96d5e8" }],
        duration: 400,
        easing: "linear",
    });
    return currentNodeArr;
}

function animatePartition(frame) {
    let nudge = frame.index,
    toNudge = [],
    moving = currentNodeArr.slice()[frame.element],
    after = currentNodeArr.slice(frame.element, currentNodeArr.length)
    while (nudge !== frame.element) {
        toNudge.push(nudge);
        nudge++;
    }
    toNudge.map((v, i) => {
        toNudge[i] = currentNodeArr[v];
    });
    
    resetAnimX();
    tl.add({
        targets: currentNodeArr[frame.element],
        keyframes: [
            // { translateX: 0 },
            { translateY: -40 },
            {
                translateX:
                    -1 *
                    getRelativeX(
                        currentNodeArr[frame.index],
                        currentNodeArr[frame.element]
                    ),
            },
            { translateY: 0 },
        ],
        duration: 900,
        easing: "easeOutElastic(1, .8)",
    });
    tl.add(
        {
            targets: toNudge,
            keyframes: [
                {
                    translateX: getRelativeX(
                        currentNodeArr[0],
                        currentNodeArr[1]
                    ),
                },
            ],
            duration: 900,
            easing: "easeOutElastic(1, .8)",
            delay: anime.stagger(100),
            changeComplete: () => {partAndSlice(), refreshArrDiv()},
        },
        "-=800"
    );
    function partAndSlice() {
        currentNodeArr = currentNodeArr.slice(0, frame.index);
        console.log("bf", currentNodeArr);
        currentNodeArr.push(moving);
        console.log("el", currentNodeArr);
        currentNodeArr = currentNodeArr.concat(toNudge);
        currentNodeArr = currentNodeArr.concat(after);
        console.log("after", currentNodeArr);
        // refreshArrDiv();
    }
    partAndSlice();
    return currentNodeArr;
}

function animateSwap(frame) {
    let save = arrFromInnerHTML(currentNodeArr, frame.values);
    tl.add({
        targets: [save[0], save[1]],
        keyframes: [
            { backgroundColor: "#e07474", duration: 300 },
            { backgroundColor: "#fff", duration: 300 },
        ],
        easing: "linear",
    });

    resetAnimX();
    syncSwitchAnimate(save, frame.xdMult, update);
    // moveE2(save, frame.xdMult, update);

    function update() {
        swapPositions(frame.elements.slice());
        refreshArrDiv();
    }
    swapPositions(frame.elements.slice());
    return currentNodeArr;
}

function animateSolved(frame) {
    tl.add({
        targets: currentNodeArr,
        keyframes: [
            // { backgroundColor: "#96d5e8" },
            { backgroundColor: "#fff" },
        ],
        duration: 400,
        easing: "linear",
    });
    tl.add({
        targets: currentNodeArr,
        keyframes: [
            { backgroundColor: "#74e098" },
            // { backgroundColor: "#fff" },
        ],
        duration: 400,
        easing: "linear",
        delay: anime.stagger(100),
        complete: () => {
            dragapprove = true;
        },
    });
    return currentNodeArr;
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

function bubbleSort(arr) {
    let stillWorking = true,
        aniFrames = [];

    function swapBubble(values, frameList) {
        let changed = false;

        values.map((n, i) => {
            if (i === values.length - 1) return;
            frameList.push({
                action: "compare",
                elements: [i, i + 1],
                values: [values[i], values[i + 1]],
            });
            if (n > values[i + 1]) {
                values[i] = values[i + 1];
                values[i + 1] = n;
                changed = true;
                let newFrame = {
                    action: "swap",
                    elements: [i, i + 1],
                    values: [values[i], values[i + 1]],
                };
                (newFrame.xdMult = Math.abs(
                    newFrame.elements[0] - newFrame.elements[1]
                )),
                    frameList.push(newFrame);
            }
        });
        return [arr, changed, frameList];
    }

    while (stillWorking) {
        [arr, stillWorking, aniFrames] = swapBubble(arr, aniFrames);
    }
    aniFrames.push({ action: "solved" });
    return [arr, aniFrames];
}

function selectionSort(arr) {
    let stillWorking = true,
        aniFrames = [];

    function reduceToMin(fullArray, startIndex, frameList) {
        let currentMin = 0,
            toSort = fullArray.slice(startIndex),
            sorted = fullArray.slice(0, startIndex);

        toSort.map((v, i) => {
            frameList.push({
                action: "compare",
                elements: [currentMin + startIndex, i + startIndex],
                values: [toSort[currentMin], toSort[i]],
            });
            if (toSort[currentMin] > toSort[i]) {
                currentMin = i;
            }
        });

        if (currentMin !== 0){
            frameList.push({
                action: "partition",
                element: currentMin + startIndex,
                index: startIndex,
            });
        }

        let pull = toSort[currentMin],
            moreToSort = toSort.length !== 1;
        toSort.splice(currentMin, 1);
        toSort.unshift(pull);
        fullArray = sorted.concat(toSort);

        return [fullArray, moreToSort, frameList];
    }

    for (let i = 0; i < arr.length; i++) {
        [arr, stillWorking, aniFrames] = reduceToMin(arr, i, aniFrames);
    }
    aniFrames.push({ action: "solved" });
    return [arr, aniFrames];
}

function endScan() {
    tl.add({
        targets: [num1, num2, num3, num4],
        backgroundColor: ["#fff", "#afea97"],
        duration: 300 * 2,
        easing: "linear",
        delay: anime.stagger(300),
        direction: "alternate",
        // loop: true,
    });
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
function syncSwitchAnimate([e1, e2], xdMult, changeComplete) {
    tl.add({
        targets: e1,
        keyframes: [
            // { translateX: 0 },
            { translateY: -40 },
            {
                translateX: xd * xdMult * -1,
            },
            { translateY: 0 },
        ],
        duration: 900,
        easing: "easeOutElastic(1, .8)",
    });
    tl.add(
        {
            targets: e2,
            keyframes: [
                // { translateX: 0 },
                { translateY: 40 },
                {
                    translateX: xd * xdMult,
                },
                { translateY: 0 },
            ],
            duration: 900,
            easing: "easeOutElastic(1, .8)",
            changeComplete: changeComplete,
        },
        "-=800"
    );
}

function resetAnimX() {
    currentNodeArr.map((n, i) => {
        tl.add({
            targets: n,
            translateX: 0,
            duration: 1,
            easing: "linear",
            // , `-=${i*1}`
        });
    });
}

function enableDragNumbers() {
    nums.map((num) => {
        num.ondragstart = (e) => {
            // e.preventDefault();
            let img = e.target.cloneNode(true);
            img.classList.add("drag-num");
            img.id = "tempDrag";
            img.style.backgroundColor = "ffffff00";
            document.body.appendChild(img);
            e.dataTransfer.setDragImage(img, 25, 25);
            requestAnimationFrame(() => {
                (img.style.opacity = "0"), (e.target.style.opacity = "0");
                dragVal = e.target;
            });
        };
        num.ondragend = (e) => {
            e.preventDefault();
            e.target.style.opacity = "100%";
            document.body.removeChild(document.getElementById("tempDrag"));
        };
        num.ondragover = (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!dragapprove) return; //stop unwanted overcalls
            if (dragVal === e.target) return; //no change if hover over self
            dragapprove = false; // ensure function not called while animating

            let numOrd = getCurrentArrOrdered(),
                gap = numOrd.indexOf(dragVal),
                hovering = numOrd.indexOf(e.target),
                backwards = gap > hovering,
                Anums = [],
                numToAnim = Math.abs(gap - hovering) - 1;

            // Make list of elements to Animate
            while (numToAnim !== 0) {
                if (backwards) {
                    Anums.unshift(numOrd[hovering + numToAnim]);
                } else {
                    Anums.push(numOrd[hovering - numToAnim]);
                }
                numToAnim--;
            }
            backwards ? Anums.unshift(e.target) : Anums.push(e.target);

            let bf = [],
                af = [],
                newArray;

            // Finding Static Elements (not animated)
            for (let i = 0; i < numOrd.length; i++) {
                if (i === gap || i === hovering) continue;
                else if (i < Math.min(gap, hovering)) {
                    bf.push(numOrd[i]);
                } else if (i > Math.max(gap, hovering)) {
                    af.push(numOrd[i]);
                } else continue;
            }

            // Creating New array from static and animated
            if (backwards) {
                bf.push(dragVal);
                newArray = bf.concat(Anums);
            } else {
                newArray = bf.concat(Anums);
                newArray.push(dragVal);
            }
            newArray = newArray.concat(af);

            // Animate number movement
            let xdist = getRelativeX(numOrd[1], numOrd[0]);
            xdist = backwards ? xdist * -1 : xdist;

            Anums.map((node) => {
                anime({
                    targets: node,
                    translateX: xdist,
                    duration: 175,
                    easing: "easeOutElastic(1, .8)",
                    complete: () => {
                        let arr = e.path[1];
                        updateArr(arr, newArray);
                        dragapprove = true; // this function can now be called again
                    },
                });
            });
        };
        num.ondrop = (e) => {
            e.preventDefault();
        };
    });
}

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
