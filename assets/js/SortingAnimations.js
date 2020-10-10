class SortingAnimations {
    static animateCompare(frame) {
        let save = arrFromPulledValues(currentNodeArr, frame.values);
        SortingAnimations.removeColor(
            arrFromPulledValues(currentNodeArr, frame.stillUnsorted)
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
            keyframes: [{ backgroundColor: "#dbdbdb" }],
            duration: 400,
            easing: "linear",
        });
    }

    static animatePartition(frame) {
        // frame.element = arrFromInnerHTML(currentNodeArr, [frame.element])[0];
        if (frame.inPlace) {
            SortingAnimations.removeColor(
                arrFromPulledValues(currentNodeArr, frame.stillUnsorted)
            );
            tl.add({
                targets: currentNodeArr[frame.element],
                keyframes: [
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
            arrFromPulledValues(currentNodeArr, frame.stillUnsorted)
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
                currentNodeArr = currentNodeArr.concat(toNudge.slice());
                currentNodeArr.push(focusedElement);
            } else {
                currentNodeArr.push(focusedElement);
                currentNodeArr = currentNodeArr.concat(toNudge.slice());
            }
            currentNodeArr = currentNodeArr.concat(after.slice());
        }
        partAndSlice();
        return currentNodeArr;
    }

    static animateSwap(frame) {
        let save = arrFromPulledValues(currentNodeArr, frame.values);
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
            solved = arrFromPulledValues(currentNodeArr, frame.solved);
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

    static shuffleValues() {
        tl = anime.timeline();
        SortingAnimations.removeColor(currentNodeArr);

        let arr = [...getCurrentArrOrdered()];
        let values = [...arr];
        values = shuffle(values);

        currentNodeArr = [...values];

        let sep = getRelativeX(arr[1], arr[0]),
            yd = 20,
            dur = 900;

        arr.map((e, i) => {
            let newInd = values.indexOf(e),
                xd = (i - newInd) * sep,
                scalar = .2;
            if (i % 2 === 0) {
                yd += 20;
                scalar *= -1;
            }
            yd *= -1;
            let offset = 50 * i;

            tl.add(
                {
                    targets: e,
                    keyframes: [
                        { translateY: yd, scale: 1 + scalar },
                        {
                            translateX: xd,
                        },
                        { translateY: 0, scale: 1 },
                    ],
                    duration: dur,
                    easing: "easeOutExpo",
                    complete: () => {
                        if (i == arr.length - 1) {
                            currentNodeArr = values.slice();
                            refreshArrDiv();
                        }
                    },
                },
                offset
            );
        });
    }
}
