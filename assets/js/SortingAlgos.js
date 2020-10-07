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
        let sorted = [arr.shift()];

        arr.map((v, i) => {
            let toRight = [];
            while (v < sorted[sorted.length - 1]) {
                toRight.unshift(sorted.pop());
            }
            sorted.push(v);
            sorted = sorted.concat(toRight);
        });
        aniFrames.push({ action: "solved" });
        return [sorted, aniFrames];
    }
}
