class SortingAlgos {
    static bubbleSort(arr) {
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
                    stillUnsorted: values,
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
    static selectionSort(arr) {
        let stillWorking = true,
            aniFrames = [];

        function reduceToMin(fullArray, startIndex, frameList) {
            let currentMin = 0,
                toSort = fullArray.slice(startIndex),
                sorted = fullArray.slice(0, startIndex);

            toSort.map((v, i) => {
                if (i === 0) return;
                frameList.push({
                    action: "compare",
                    elements: [currentMin + startIndex, i + startIndex],
                    values: [toSort[currentMin], toSort[i]],
                    stillUnsorted: fullArray.slice(startIndex),
                });
                if (toSort[currentMin] > toSort[i]) {
                    currentMin = i;
                }
            });

            frameList.push({
                action: "partition",
                element: currentMin + startIndex,
                index: startIndex,
                stillUnsorted: fullArray.slice(startIndex),
                inPlace: currentMin === 0,
            });

            let pull = toSort[currentMin],
                moreToSort = toSort.length !== 2;
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
    static insertionSort(arr) {
        let sorted = [arr.shift()],
            aniFrames = [];

        arr.map((v, i) => {
            let toRight = [],
                movInd = i;
            i++;
            while (true) {
                if (i === 0) break;
                aniFrames.push({
                    action: "compare",
                    elements: [i - 1, i],
                    values: [sorted[sorted.length - 1], v],
                    stillUnsorted: arr.slice(arr.indexOf(v)),
                });
                if (v < sorted[sorted.length - 1]) {
                    let newFrame = {
                        action: "swap",
                        elements: [i - 1, i],
                        values: [sorted[sorted.length - 1], v],
                    };
                    (newFrame.xdMult =
                        -1 *
                        Math.abs(newFrame.elements[0] - newFrame.elements[1])),
                        aniFrames.push(newFrame);
                    toRight.unshift(sorted.pop());
                    movInd--;
                    i--;
                } else break;
            }
            sorted.push(v);
            sorted = sorted.concat(toRight);
            // console.log("sor", sorted);
            if (v !== arr[arr.length - 1]) {
                aniFrames.push({
                    action: "solved",
                    solved: sorted.slice(),
                });
            }
        });
        aniFrames.push({ action: "solved" });
        return [sorted, aniFrames];
    }
    static quickSort(arr) {
        console.log(arr);
        let aniFrames = [],
            // parentInd = 0,
            unsorted = arr.slice();

        function recursiveSort(values, highOrLow, parentInd) {
            console.log("vals", values);
            if (values.length <= 1) return values;
            let pivot = pickPivot(values),
                pi = values.indexOf(pivot);

            parentInd =
                highOrLow == "high"
                    ? parentInd + pi + 1
                    : parentInd + (pi - values.length);
            
            console.log("PINDEX, PIVOT", parentInd, pivot);


            let higher = [],
                lower = [],
                offset = 0;
            function sort(v, i) {
                if (i === pi) return; // dont include the pivot
                if (v === pivot) {
                    // if there are duplicates, leave them where they are.
                    parentInd + i - pi + offset < parentInd
                        ? higher.push(v)
                        : lower.unshift(v);
                    return;
                }
                let elementInd = i - pi + parentInd + offset
                console.log("ELEMENTINDEX, element", elementInd, v);

                aniFrames.push({
                    action: "compare",
                    elements: [parentInd + offset, parentInd + i - pi + offset],
                    values: [pivot, v],
                    stillUnsorted: unsorted.slice(),
                });
                if (v > pivot) { // Move Right
                    if (elementInd < parentInd + offset) {
                        aniFrames.push({
                            action: "partition",
                            element: elementInd,
                            index: parentInd - pi + values.length - 1 + offset, // end of list
                            stillUnsorted: unsorted,
                            inPlace: false,
                            backwards: true,
                        });
                        console.log(`${v} (at ind ${elementInd}) moved RIGHT to index ${parentInd - pi +values.length -1 + offset}`);
                        offset--;
                        higher.push(v);
                    } else higher.unshift(v);
                } else { //Move Left
                    if (elementInd > parentInd + offset) {
                        offset++;
                        console.log("afteroff", parentInd, pi, offset);
                        aniFrames.push({
                            action: "partition",
                            element: elementInd,
                            index: pi === 0? parentInd :parentInd - pi + offset, // start of list
                            stillUnsorted: unsorted,
                            inPlace: false,
                        });
                        console.log(`${v} (at ind ${elementInd}) moved LEFT to index ${parentInd - pi + offset}`);
                        // offset++;
                        lower.unshift(v);
                    } else lower.push(v)
                }
            }
            values.map(sort);
            parentInd += offset
            console.log("updated PIndex", parentInd);
            unsorted.splice(values.indexOf(pivot), 1);
            return recursiveSort(lower, "low", parentInd)
                .concat([pivot])
                .concat(recursiveSort(higher, "high", parentInd));
        }

        function pickPivot(arr) {
            let pVals;
            if (arr.length > 3) {
                pVals = [
                    arr[0],
                    arr[arr.length - 1],
                    arr[Math.round(arr.length / 2)],
                ];
            } else if (arr.length === 3) {
                pVals = arr.slice();
            }
            if (!!pVals) {
                pVals.splice(pVals.indexOf(Math.min(...pVals)), 1);
                pVals.splice(pVals.indexOf(Math.max(...pVals)), 1);
                return pVals[0];
            }
            return arr[0];
        }

        let solved = recursiveSort(arr, "high", -1)
        aniFrames.push({ action: "solved" });
        console.log(solved, aniFrames);
        return [solved, aniFrames];
    }
}
