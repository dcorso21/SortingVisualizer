class UI {
    static enableDragNumbers() {
        pullElements().map((num) => {
            num.ondragstart = (e) => {
                // e.preventDefault();
                let img = e.target.cloneNode(numShow);
                img.classList.add("drag-num");
                let h = pullHeight(img);
                img.id = "tempDrag";
                // img.style.backgroundColor = "ffffff00";
                document.body.appendChild(img);
                e.dataTransfer.setDragImage(img, 25, h * 5);
                requestAnimationFrame(() => {
                    (img.style.opacity = "0"), (e.target.style.opacity = "0");
                    dragVal = e.target;
                });
            };
            num.ondragend = (e) => {
                e.preventDefault();
                e.target.style.opacity = "100%";
                // console.log(document.getElementById("tempDrag"));
                let temp = document.getElementById("tempDrag");
                temp.parentNode.removeChild(temp);
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
                            currentNodeArr = newArray;
                            refreshArrDiv();
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
    static updateArr(arr, newValues) {
        arr = removeAllChildNodes(arr);
        newValues.unshift(brackets[0]);
        newValues.push(brackets[1]);
        newValues.map((el) => {
            el.style.transform = "none";
            arr.appendChild(el);
        });
    }
    static enableButtons() {
        let shuffle = document.getElementById("shuffle"),
            start = document.getElementById("start"),
            togNums = document.getElementById("numShow"),
            togBars = document.getElementById("barShow");

        shuffle.onclick = SortingAnimations.shuffleValues;
        start.onclick = scan;
        togNums.onclick = UI.toggleNums;
        togBars.onclick = UI.toggleBars;
    }

    static enableAddSubBars(){
        let add = document.querySelector('.addBar');
        let sub = document.querySelector('.subBar');
        add.onclick = () => {
            let currentLen = pullElements().length;
            if (currentLen === 10) return;
            else if (currentLen === 2) {
                sub.style.color = 'black';
            } else if (currentLen >= 9) {
                add.style.color = 'grey';
            }
            addOrSubBars('add');
        };
        sub.onclick = () => {
            let currentLen = pullElements().length;
            if (currentLen === 2) return;
            else if (currentLen === 10) {
                add.style.color = 'black';
            } else if (currentLen === 3) {
                sub.style.color = 'grey';
            }
            addOrSubBars('sub');
        };
    }
    static enableDropdown() {
        let btn = document.getElementById("pickAlgo");
        btn.onclick = () => {
            let drop = document.getElementsByClassName("dropdown")[0];
            console.log(drop);

            if (drop.style.opacity == 1) {
                drop.style.pointerEvents = "none";
                anime({
                    targets: drop,
                    keyframes: [
                        {
                            translateY: -5,
                            opacity: 0,
                        },
                    ],
                    duration: 300,
                    easing: "easeInOutBack",
                });
                return;
            }
            drop.style.pointerEvents = "all";
            anime({
                targets: drop,
                keyframes: [
                    {
                        translateY: 5,
                        opacity: 1,
                    },
                ],
                duration: 300,
                easing: "easeInOutBack",
            });
        };
    }
    static toggleNums() {
        let arr = document.getElementsByClassName("arr")[0];
        console.log(arr);
        if (numShow) {
            anime({
                targets: arr,
                keyframes: [
                    // {color: "rgba(0, 0, 0)"},
                    { color: "rgba(0, 0, 0, 0)" },
                ],
                duration: 400,
                delay: anime.stagger(100),
            });
            numShow = false;
        } else {
            anime({
                targets: arr,
                color: "rgba(0, 0, 0)",
                duration: 400,
                delay: anime.stagger(100),
            });
            numShow = true;
        }
    }
    static toggleBars() {
        nums = pullElements();
        if (barShow) {
            anime({
                targets: nums,
                keyframes: [
                    {
                        height: 50,
                        lineHeight: 50,
                        scale: 0.9,
                        // borderRadius: "35%"
                    },
                    { scale: 1, duration: 400, borderRadius: "50px" },
                ],
                easing: "easeInOutBack",
                duration: 700,
                delay: anime.stagger(100),
            });
            barShow = false;
        } else {
            makeBars();
            barShow = true;
        }
    }
    static enableChooseAlgo() {
        let algos = [...document.getElementsByClassName("algo-choice")],
            picked = document.getElementById("pickAlgo");

        picked.onclick = (e) => {
            tl = anime.timeline();
            let explainText = document.getElementsByClassName("explain-text");
            tl.add({
                targets: explainText,
                keyframes: [{ opacity: 0, translateY: 500 }],
                duration: 100,
                delay: anime.stagger(25),
            });
            tl.add(
                {
                    targets: algos,
                    keyframes: [
                        { opacity: 0, translateY: -40 },
                        { opacity: 1, translateY: 0 },
                    ],
                    duration: 100,
                    delay: anime.stagger(25),
                    complete: () => {
                        algos.map((e) => {
                            e.style.pointerEvents = "all";
                        });
                    },
                },
                50
            );
        };

        console.log(algos);
        algos.map((a) => {
            a.onclick = (e) => {
                tl = anime.timeline();
                picked.innerHTML = a.innerHTML;
                algo = a.innerHTML;
                setAlgoInfo();
                tl.add({
                    targets: algos,
                    keyframes: [
                        { opacity: 1, translateY: 40 },
                        { opacity: 0, translateY: 0 },
                    ],
                    duration: 100,
                    // delay: anime.stagger(25),
                    complete: () => {
                        algos.map((e) => {
                            e.style.pointerEvents = "none";
                        });
                    },
                });
                console.log(explanationId);
                console.log(document.getElementById(explanationId));
                tl.add({
                    targets: document.getElementById(explanationId),
                    keyframes: [
                        { translateY: 0 },
                    ],
                    duration: 0,
                });
                tl.add({
                    targets: document.getElementById(explanationId),
                    keyframes: [
                        { opacity: 0, translateY: -20 },
                        { opacity: 1, translateY: 0 },
                    ],
                    duration: 800,
                });
            };
        });
    }
}
