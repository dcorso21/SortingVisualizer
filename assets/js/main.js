let [num1, num4, num3, num2] = document.querySelectorAll(".num"),
    tl = anime.timeline(),
    nums = [...document.getElementsByClassName("num")],
    brackets = document.querySelectorAll(".bracket"),
    dragVal,
    dragapprove = true;

window.onload = () => {
    enableDragNumbers();

    // firstScan();
    // moveE1(num4, num2);
    // moveE2(num4, num2);
    // endScan();
};

function scan() {
    let arrNodes = getCurrentArrOrdered();
    arr = getNodeValues(arrNodes);
    let [sortedArr, aniFrames] = bubbleSort(arr);
    // console.log(sortedArr);
    return sortedArr;
}

function getNodeValues(nodeList) {
    let vals = [];
    nodeList.map((node) => {
        vals.push(node.innerHTML);
    });
    return vals;
}

function bubbleSort(arr) {
    // let arr = getCurrentArrOrdered(),
    let stillWorking = true,
        aniFrames = [];

    function swapBubble(values, frameList) {
        let changed = false;

        values.map((n, i) => {
            frameList.push({
                action: "compare",
                elements: [i, i + 1],
            });
            if (n > values[i + 1]) {
                values[i] = values[i + 1];
                values[i + 1] = n;
                changed = true;
                frameList.push({
                    action: "swap",
                    elements: [i, i + 1],
                });
            }
        });
        return [arr, changed, frameList];
    }

    while (stillWorking) {
        [arr, stillWorking, aniFrames] = swapBubble(arr, aniFrames);
    }
    return arr, aniFrames;
    // for (let i = 0; i < seq.length; i++) {
    //     let color = [1, 3].includes(i) ? "#ea9797" : "#afea97";
    //     tl.add({
    //         targets: seq[i],
    //         keyframes: [
    //             { backgroundColor: color },
    //             { backgroundColor: "#fff" },
    //         ],
    //         duration: 700,
    //         easing: "linear",
    //         direction: "alternate",
    //     });
    // }
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
    return (
        movingElement.getBoundingClientRect().x -
        targetElement.getBoundingClientRect().x
    );
}

// Scan list of numbers
// Switch Numbers
// Scan again
function moveE1(e1, e2) {
    tl.add({
        targets: e1,
        keyframes: [
            { translateY: -40 },
            { translateX: getRelativeX(e1, e2) },
            { translateY: 0 },
        ],
        duration: 2500,
        easing: "easeOutElastic(1, .8)",
    });
}

function moveE2(e1, e2) {
    tl.add(
        {
            targets: e2,
            keyframes: [
                { translateY: 40 },
                { translateX: getRelativeX(e2, e1) },
                { translateY: 0 },
            ],
            duration: 2500,
            easing: "easeOutElastic(1, .8)",
        },
        "-=2500"
    );
}

function enableDragNumbers() {
    nums.map((num) => {
        num.ondragstart = (e) => {
            // e.preventDefault();
            let img = e.target.cloneNode(true);
            img.classList.add("drag-num");
            img.id = "tempDrag";
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
                });
            });

            // Update the Array
            setTimeout(() => {
                let arr = e.path[1];
                updateArr(arr, newArray);
                dragapprove = true; // this function can now be called again
            }, 200);
        };
        num.ondrop = (e) => {
            e.preventDefault();
        };
    });
}

function updateArr(arr, newValues) {
    newValues.unshift(brackets[0]);
    newValues.push(brackets[1]);
    newValues.map((el) => {
        el.style.transform = "none";
        arr.appendChild(el);
    });
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
