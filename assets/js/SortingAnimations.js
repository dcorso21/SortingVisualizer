class SortingAnimations {
    static animateCompare(frame) {
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

    static animatePartition(frame) {
        let nudge = frame.index,
            toNudge = [],
            moving = currentNodeArr.slice()[frame.element],
            after = currentNodeArr.slice(frame.element, currentNodeArr.length);
        while (nudge !== frame.element) {
            toNudge.push(nudge);
            nudge++;
        }
        toNudge.map((v, i) => {
            toNudge[i] = currentNodeArr[v];
        });

        SortingAnimations.resetAnimX();
        tl.add({
            targets: currentNodeArr[frame.element],
            keyframes: [
                // { translateX: 0 },
                { translateY: -40 },
                {
                    translateX: -1 *
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
                changeComplete: () => {
                    partAndSlice(), refreshArrDiv();
                },
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

    static animateSwap(frame) {
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
        swapPositions(frame.elements.slice());
        return currentNodeArr;
    }

    static animateSolved(frame) {
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
