class SortingAnimations {
    static animateCompare(frame) {
        let save = arrFromInnerHTML(currentNodeArr, frame.values);
        SortingAnimations.removeColor(
            arrFromInnerHTML(currentNodeArr, frame.stillUnsorted)
        );
        tl.add({
            targets: save,
            keyframes: [{ backgroundColor: "#96d5e8" }],
            duration: 400,
            easing: "linear",
        });
        return currentNodeArr;
    }

    static removeColor(targets) {
        tl.add({
            targets: targets,
            keyframes: [{ backgroundColor: "rgba(255,255,255,0)" }],
            duration: 400,
            easing: "linear",
        });
    }

    static animatePartition(frame) {
        if (frame.inPlace) {
            SortingAnimations.removeColor(
                arrFromInnerHTML(currentNodeArr, frame.stillUnsorted)
            );
            tl.add({
                targets: currentNodeArr[frame.element],
                keyframes: [
                    // { translateX: 0 },
                    { backgroundColor: "#bf97d2" },
                    { backgroundColor: "#74e098" },
                ],
                duration: 900,
                easing: "linear",
            });
            return currentNodeArr;
        }
        let toNudge = [],
            before,
            after,
            focusedElement = currentNodeArr[frame.element],
            customXD;
        if (frame.backwards) {
            before = currentNodeArr.slice(0, frame.element);
            toNudge = currentNodeArr.slice(frame.element + 1, frame.index + 1);
            after = currentNodeArr.slice(frame.index + 1);
            customXD = xd * -1;
        } else {
            before = currentNodeArr.slice(0, frame.index);
            toNudge = currentNodeArr.slice(frame.index, frame.element);
            after = currentNodeArr.slice(frame.element + 1);
            customXD = xd;
        }

        SortingAnimations.removeColor(
            arrFromInnerHTML(currentNodeArr, frame.stillUnsorted)
        );
        SortingAnimations.resetAnimX();
        tl.add({
            targets: currentNodeArr[frame.element],
            keyframes: [
                { translateY: -40, backgroundColor: "#bf97d2" },
                {
                    translateX: customXD * toNudge.length * -1,
                },
                { translateY: 0, backgroundColor: "#74e098" },
            ],
            duration: 900,
            easing: "easeOutElastic(1, .8)",
        });
        tl.add(
            {
                targets: toNudge,
                keyframes: [
                    {
                        translateX: customXD,
                    },
                ],
                duration: 900,
                easing: "easeOutElastic(1, .8)",
                delay: anime.stagger(100),
                changeComplete: () => {
                    partAndSlice();
                    refreshArrDiv();
                },
            },
            "-=800"
        );
        function partAndSlice() {
            currentNodeArr = before.slice();
            if (frame.backwards) {
                console.log("before", before);
                console.log("N", toNudge);
                console.log("e", focusedElement);
                console.log("after", after);
                currentNodeArr = currentNodeArr.concat(toNudge.slice());
                currentNodeArr.push(focusedElement);
            } else {
                console.log("before", before);
                console.log("e", focusedElement);
                console.log("N", toNudge);
                console.log("after", after);
                currentNodeArr.push(focusedElement);
                currentNodeArr = currentNodeArr.concat(toNudge.slice());
            }
            currentNodeArr = currentNodeArr.concat(after.slice());
            console.log("FINAL", currentNodeArr);
        }
        partAndSlice();
        return currentNodeArr;
    }

    static animateSwap(frame) {
        console.log(frame.values);
        let save = arrFromInnerHTML(currentNodeArr, frame.values);
        tl.add({
            targets: [save[0], save[1]],
            keyframes: [
                { backgroundColor: "#e07474", duration: 300 },
                { backgroundColor: "#fff", duration: 300 },
            ],
            easing: "linear",
        });

        SortingAnimations.resetAnimX();
        SortingAnimations.syncSwitchAnimate(save, frame.xdMult, update);
        // moveE2(save, frame.xdMult, update);
        function update() {
            swapPositions(frame.elements.slice());
            refreshArrDiv();
        }
        function swapPositions([posA, posB]) {
            let b = currentNodeArr[posB];
            currentNodeArr[posB] = currentNodeArr[posA];
            currentNodeArr[posA] = b;
        }
        swapPositions(frame.elements.slice());
        return currentNodeArr;
    }

    static animateSolved(frame) {
        let solved = currentNodeArr;
        if (!!frame.solved) {
            solved = arrFromInnerHTML(currentNodeArr, frame.solved);
        }
        SortingAnimations.removeColor(solved);
        tl.add({
            targets: solved,
            keyframes: [{ backgroundColor: "#74e098" }],
            duration: 400,
            easing: "linear",
            delay: anime.stagger(100),
            complete: () => {
                dragapprove = true;
            },
        });
        return currentNodeArr;
    }

    static syncSwitchAnimate([e1, e2], xdMult, changeComplete) {
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

    static resetAnimX() {
        currentNodeArr.map((n, i) => {
            tl.add({
                targets: n,
                translateX: 0,
                duration: 1,
                easing: "linear",
            });
        });
    }
}
